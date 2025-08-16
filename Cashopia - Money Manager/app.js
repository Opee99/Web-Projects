/* app.js - Cashopia v1.5 (advanced: category manager, chart ranges, adv filters, subs snapshot, bold ৳ in tx list) */

const LS_KEY = 'cashopia_state_v15';

/* ----------------- State ----------------- */
const state = {
  transactions: [],
  budgets: [],
  customCats: { income: [], expense: [] }, // NEW: user categories
  settings: {
    themeDark: false,
    brandColor: '#5b8def',
    language: 'en',
    currency: 'BDT',
    notifications: false,
    passcode: '',
    profile: { name: '', email: '', occupation: '', phone: '', bio: '', avatar: '' },
    unlocked: true
  },
  alerts: { budgets: {} },
  activity: []
};

const currencySymbols = { BDT: '৳', USD: '$', EUR: '€', INR: '₹' };

/* Default categories (can be extended by user) */
const defaultCategories = {
  income: [
    { key: 'salary', name_en: 'Salary', name_bn: 'বেতন', icon: '💼' },
    { key: 'business', name_en: 'Business', name_bn: 'বিজনেস', icon: '🏢' },
    { key: 'gift', name_en: 'Gift', name_bn: 'উপহার', icon: '🎁' },
    { key: 'other_inc', name_en: 'Other', name_bn: 'অন্যান্য', icon: '➕' }
  ],
  expense: [
    { key: 'food', name_en: 'Food', name_bn: 'খাবার', icon: '🍔' },
    { key: 'transport', name_en: 'Transport', name_bn: 'যাতায়াত', icon: '🚌' },
    { key: 'shopping', name_en: 'Shopping', name_bn: 'কেনাকাটা', icon: '🛍️' },
    { key: 'utilities', name_en: 'Utilities', name_bn: 'ইউটিলিটি', icon: '💡' },
    { key: 'rent', name_en: 'Rent', name_bn: 'ভাড়া', icon: '🏠' },
    { key: 'health', name_en: 'Health', name_bn: 'স্বাস্থ্য', icon: '🩺' },
    { key: 'other_exp', name_en: 'Other', name_bn: 'অন্যান্য', icon: '➖' }
  ]
};

/* Helpers to access merged categories */
function allCategories(type) {
  return [...defaultCategories[type], ...(state.customCats?.[type] || [])];
}

/* ----------------- DOM shortcuts ----------------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* ----------------- Load/Save ----------------- */
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }
function load(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return;
    const incoming = JSON.parse(raw);
    Object.assign(state, incoming);
    // Backward compatibility defaults
    state.customCats = incoming.customCats || { income: [], expense: [] };
    state.alerts = Object.assign({ budgets:{} }, incoming.alerts || {});
  }catch(e){ console.error('Load failed', e); }
}
load();

/* ----------------- i18n ----------------- */
const i18n = {
  en: {
    'nav.home':'Home','nav.transactions':'Transactions','nav.budgets':'Budgets','nav.more':'More',
    'home.income':'Income','home.expense':'Expense','home.balance':'Balance',
    'home.incomeSub':'Sum of all income','home.expenseSub':'Sum of all expenses','home.balanceSub':'Income - Expense',
    'home.lineTitle':'Income vs Expense','home.pieTitle':'Expenses by Category','home.barTitle':'Top 5 Spending Categories','home.doughnutTitle':'Income by Source',
    'tx.searchPh':'Search transactions…','tx.allTypes':'All types','tx.allCats':'All categories','tx.income':'Income','tx.expense':'Expense',
    'tx.addTitle':'Add Transaction','tx.editTitle':'Edit Transaction','tx.type':'Type','tx.category':'Category','tx.amount':'Amount','tx.date':'Date',
    'tx.recurring':'Recurring','tx.none':'None','tx.daily':'Daily','tx.weekly':'Weekly','tx.monthly':'Monthly',
    'tx.notes':'Notes (optional)','tx.notesPh':'Add a note…','tx.empty':'No transactions yet. Tap ➕ to add.',
    'budget.title':'Monthly Budgets','budget.monthlyAmount':'Monthly Budget Amount','budget.addTitle':'Add Budget','budget.editTitle':'Edit Budget',
    'more.profile':'Profile','more.name':'Name','more.pic':'Profile picture','more.email':'Email','more.occupation':'Occupation',
    'more.namePlaceholder':'Your name','more.emailPlaceholder':'Your email','more.occupationPlaceholder':'Your occupation',
    'more.phone':'Phone','more.phonePlaceholder':'Phone number','more.bio':'Bio','more.bioPlaceholder':'A short bio (optional)',
    'more.theme':'Theme','more.darkMode':'Dark mode','more.brandColor':'Brand color','more.language':'Language','more.chooseLang':'Choose language',
    'more.currency':'Currency','more.chooseCurrency':'Choose currency','more.notifications':'Notifications','more.notifToggle':'Enable notifications',
    'more.security':'Security','more.setPasscode':'Set Passcode','more.activity':'Activity Log','more.about':'About','more.aboutText1':'Cashopia helps you track income, expenses, and budgets—privately on your device.',
    'more.passcodeNote':'Note: passcode is stored locally on your device.','more.lockEnter':'Enter passcode',
    'btn.save':'Save','btn.delete':'Delete','btn.remove':'Remove','btn.exportJson':'Export JSON','btn.exportCsv':'Export CSV','btn.import':'Import',
    'btn.reset':'Reset All','btn.unlock':'Unlock','confirm.deleteTransaction':'Delete this transaction?','confirm.deleteBudget':'Remove this budget?',
    'toast.profileSaved':'Profile saved','toast.photoUpdated':'Photo updated','toast.passcodeSaved':'Passcode saved','toast.unlocked':'Unlocked',
    'toast.importedCsv':'Imported CSV rows','toast.importedJson':'Imported JSON','toast.transactionDeleted':'Transaction deleted','toast.budgetRemoved':'Budget removed',
    'unknown':'Unknown'
  },
  bn: {
    'nav.home':'হোম','nav.transactions':'লেনদেন','nav.budgets':'বাজেট','nav.more':'আরও',
    'home.income':'আয়','home.expense':'খরচ','home.balance':'ব্যালেন্স',
    'home.incomeSub':'সমস্ত আয়ের যোগফল','home.expenseSub':'সমস্ত খরচের যোগফল','home.balanceSub':'আয় - খরচ',
    'home.lineTitle':'আয় বনাম খরচ','home.pieTitle':'শ্রেণিভিত্তিক খরচ','home.barTitle':'শীর্ষ ৫ খরচ বিভাগ','home.doughnutTitle':'আয়ের উৎস',
    'tx.searchPh':'লেনদেন খুঁজুন…','tx.allTypes':'সকল ধরণ','tx.allCats':'সকল বিভাগ','tx.income':'আয়','tx.expense':'খরচ',
    'tx.addTitle':'লেনদেন যোগ করুন','tx.editTitle':'লেনদেন সম্পাদনা','tx.type':'ধরণ','tx.category':'বিভাগ','tx.amount':'পরিমাণ','tx.date':'তারিখ',
    'tx.recurring':'পুনরাবৃত্তি','tx.none':'কোনো নয়','tx.daily':'দৈনন্দিন','tx.weekly':'সাপ্তাহিক','tx.monthly':'মাসিক',
    'tx.notes':'নোট (ঐচ্ছিক)','tx.notesPh':'নোট যোগ করুন…','tx.empty':'কোনো লেনদেন নেই। ➕ চাপুন।',
    'budget.title':'মাসিক বাজেট','budget.monthlyAmount':'মাসিক বাজেটের পরিমাণ','budget.addTitle':'বাজেট যোগ করুন','budget.editTitle':'বাজেট সম্পাদনা',
    'more.profile':'প্রোফাইল','more.name':'নাম','more.pic':'প্রোফাইল ছবি','more.email':'ইমেইল','more.occupation':'পেশা',
    'more.namePlaceholder':'আপনার নাম','more.emailPlaceholder':'আপনার ইমেইল','more.occupationPlaceholder':'আপনার পেশা',
    'more.phone':'ফোন','more.phonePlaceholder':'ফোন নম্বর','more.bio':'বায়ো','more.bioPlaceholder':'সংক্ষিপ্ত বায়ো (ঐচ্ছিক)',
    'more.theme':'থিম','more.darkMode':'ডার্ক মোড','more.brandColor':'ব্র্যান্ড রং','more.language':'ভাষা','more.chooseLang':'ভাষা নির্বাচন করুন',
    'more.currency':'মুদ্রা','more.chooseCurrency':'মুদ্রা নির্বাচন','more.notifications':'নোটিফিকেশন','more.notifToggle':'নোটিফিকেশন চালু করুন',
    'more.security':'নিরাপত্তা','more.setPasscode':'পাসকোড সেট করুন','more.activity':'অ্যাক্টিভিটি লগ','more.about':'সম্পর্কে','more.aboutText1':'Cashopia আপনাকে ডিভাইসে ব্যক্তিগতভাবে আয়, খরচ এবং বাজেট ট্র্যাক করতে সাহায্য করে।',
    'more.passcodeNote':'বিঃ দ্রঃ পাসকোড আপনার ডিভাইসে স্থানীয়ভাবে সংরক্ষিত থাকে।','more.lockEnter':'পাসকোড লিখুন',
    'btn.save':'সংরক্ষণ','btn.delete':'মুছুন','btn.remove':'বাতিল','btn.exportJson':'JSON এক্সপোর্ট','btn.exportCsv':'CSV এক্সপোর্ট','btn.import':'ইমপোর্ট',
    'btn.reset':'সব মুছুন','btn.unlock':'আনলক','confirm.deleteTransaction':'এই লেনদেনটি মুছবেন?','confirm.deleteBudget':'এই বাজেটটি মুছবেন?',
    'toast.profileSaved':'প্রোফাইল সংরক্ষিত','toast.photoUpdated':'ছবি আপডেট হয়েছে','toast.passcodeSaved':'পাসকোড সংরক্ষিত','toast.unlocked':'আনলক হয়েছে',
    'toast.importedCsv':'CSV রো ইমপোর্ট হয়েছে','toast.importedJson':'JSON ইমপোর্ট হয়েছে','toast.transactionDeleted':'লেনদেন মুছে ফেল করা হয়েছে','toast.budgetRemoved':'বাজেট মুছে দেওয়া হয়েছে',
    'unknown':'অজানা'
  }
};
function t(key){
  const lang = state.settings.language || 'en';
  return (i18n[lang] && i18n[lang][key]) || (i18n.en[key] || key);
}

/* i18n apply */
function applyI18n(){
  document.documentElement.lang = state.settings.language || 'en';
  $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if(k) el.textContent = t(k); });
  $$('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if(k) el.setAttribute('placeholder', t(k)); });
  const activeView = $('.view.active');
  if(activeView){
    const viewName = activeView.id.replace('view-','');
    const navKey = 'nav.'+viewName;
    if($('#headerTitle')) $('#headerTitle').textContent = t(navKey) || $('#headerTitle').textContent;
  }
}

/* Utils */
function cryptoRandomId(){ return Math.random().toString(36).slice(2,9); }
function toISO(d){ const D = new Date(d); D.setMinutes(D.getMinutes()-D.getTimezoneOffset()); return D.toISOString().slice(0,10); }
function todayISO(){ return toISO(new Date()); }
function nextDate(dateISO, days){ const d=new Date(dateISO+'T00:00:00'); d.setDate(d.getDate()+Number(days)); return toISO(d); }
function isSameMonth(isoDate, compareIso){ return isoDate.slice(0,7) === (compareIso || todayISO()).slice(0,7); }
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

/* Localized name for category meta */
function nameFor(meta){
  if(!meta) return t('unknown');
  return (state.settings.language === 'bn' ? meta.name_bn : meta.name_en) || meta.key || t('unknown');
}

/* Sum helper */
function sumOf(fn){ return state.transactions.reduce((s,t)=> s + (fn(t) ? Number(t.amount||0):0), 0); }

/* Currency formatters */
function fmtNumber(amount){ return Number(amount||0).toLocaleString(undefined,{ maximumFractionDigits:2 }); }
function fmt(amount){ const sym = currencySymbols[state.settings.currency] || ''; return `${sym}${fmtNumber(amount)}`; }
/* For transaction list: bold symbol */
function fmtParts(amount){
  return {
    sym: currencySymbols[state.settings.currency] || '',
    num: fmtNumber(amount)
  };
}

/* HTML currency with bold symbol */
function currencyHTML(amount){
  const parts = fmtParts(amount);
  const sign = (Number(amount||0) < 0) ? '-' : '';
  return `${sign}<span class="cur">${parts.sym}</span>${parts.num}`;
}
/* Category metaa lookup (merged) */
function getCatMeta(type,key){
  const list = allCategories(type);
  return list.find(c=>c.key===key) || null;
}

/* Recurring label */
function recurringLabel(days){
  if(!days) return '';
  if(days===1) return t('tx.daily');
  if(days===7) return t('tx.weekly');
  if(days===30) return t('tx.monthly');
  return `${days} days`;
}

/* Toast */
function toast(msg, kind=''){ const wrap=$('#toastWrap'); const el=document.createElement('div'); el.className='toast '+(kind||''); el.textContent=msg; wrap.appendChild(el); setTimeout(()=>{ el.style.opacity='0'; el.addEventListener('transitionend',()=>el.remove()); },2500); }

/* Theme + brand */
function shadeColor(hex,percent){
  if(!hex) return hex;
  const h=hex.replace('#',''); const bigint=parseInt(h,16);
  let r=(bigint>>16)&255, g=(bigint>>8)&255, b=bigint&255;
  r=Math.min(255,Math.max(0,Math.round(r*(100+percent)/100)));
  g=Math.min(255,Math.max(0,Math.round(g*(100+percent)/100)));
  b=Math.min(255,Math.max(0,Math.round(b*(100+percent)/100)));
  return '#' + ((1<<24) + (r<<16) + (g<<8) + b).toString(16).slice(1);
}
function applySettingsToDOM(){
  document.body.classList.toggle('dark', !!state.settings.themeDark);
  document.documentElement.style.setProperty('--brand', state.settings.brandColor || '#5b8def');
  document.documentElement.style.setProperty('--brand-600', shadeColor(state.settings.brandColor || '#5b8def', -12));
  const themeIcon = $('#themeToggle i'); if(themeIcon) themeIcon.className = state.settings.themeDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  const metaTheme = document.querySelector('meta[name="theme-color"]'); if(metaTheme) metaTheme.setAttribute('content', state.settings.themeDark ? '#0f1115' : (state.settings.brandColor || '#5b8def'));
  setChartTheme();
}
function setChartTheme(){
  if(!window.Chart) return;
  const text = getComputedStyle(document.body).color || '#222';
  Chart.defaults.color = text;
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.plugins = Chart.defaults.plugins || {};
  Chart.defaults.plugins.legend = Chart.defaults.plugins.legend || {};
  Chart.defaults.plugins.legend.labels = Chart.defaults.plugins.legend.labels || {};
  Chart.defaults.plugins.legend.labels.color = text;
}

function chartTheme(){
  const isDark = document.body.classList.contains('dark');
  return {
    text: isDark ? '#e5e7eb' : '#111827',
    grid: isDark ? 'rgba(229,231,235,0.15)' : 'rgba(17,24,39,0.08)',
    tooltipBg: isDark ? '#111827' : '#ffffff'
  };
}

function applyChartAxisTheme(){
  const theme = chartTheme();
  [window.lineChart, window.barChart].forEach(ch=>{
    if(!ch) return;
    ch.options.scales = ch.options.scales || {};
    ['x','y'].forEach(ax=>{
      ch.options.scales[ax] = ch.options.scales[ax] || {};
      ch.options.scales[ax].ticks = Object.assign({}, ch.options.scales[ax].ticks, { color: theme.text });
      ch.options.scales[ax].grid  = Object.assign({}, ch.options.scales[ax].grid , { color: theme.grid });
    });
    ch.update();
  });
}


applySettingsToDOM();

/* ----------------- Navigation ----------------- */
$$('.bottom-nav .tab').forEach((btn,i,arr)=>{
  btn.addEventListener('click',()=>switchView(btn.dataset.view));
  btn.addEventListener('keydown',(e)=>{
    if(e.key==='ArrowRight'){ arr[(i+1)%arr.length].focus(); arr[(i+1)%arr.length].click(); }
    if(e.key==='ArrowLeft'){ arr[(i-1+arr.length)%arr.length].focus(); arr[(i-1+arr.length)%arr.length].click(); }
  });
});
function switchView(view){
  $$('.view').forEach(v=>v.classList.remove('active'));
  const target = $(`#view-${view}`); if(target) target.classList.add('active');
  $$('.tab').forEach(t=>{ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
  const btn = $(`.tab[data-view="${view}"]`); if(btn){ btn.classList.add('active'); btn.setAttribute('aria-selected','true'); btn.focus(); }
  $('#headerTitle').textContent = t('nav.'+view) || $('#headerTitle').textContent;
  applyI18n();
  if(view==='home') renderCharts();
}

/* ----------------- Settings controls ----------------- */
$('#languageSelect').value = state.settings.language || 'en';
$('#languageSelect').addEventListener('change', e=>{ state.settings.language = e.target.value; save(); applyI18n(); renderAll(); });

$('#currencySelect').value = state.settings.currency || 'BDT';
$('#currencySelect').addEventListener('change', e=>{ state.settings.currency = e.target.value; save(); renderAll(); });

$('#themeSwitch').checked = !!state.settings.themeDark;
$('#themeSwitch').addEventListener('change', e=>{ state.settings.themeDark = e.target.checked; applySettingsToDOM(); save(); renderAll(); });
$('#brandColor').value = state.settings.brandColor || '#5b8def';
$('#brandColor').addEventListener('input', e=>{ state.settings.brandColor = e.target.value || '#5b8def'; applySettingsToDOM(); save(); });

$('#themeToggle').addEventListener('click', ()=>{ state.settings.themeDark = !state.settings.themeDark; applySettingsToDOM(); save(); });

$('#notifSwitch').checked = !!state.settings.notifications;
$('#notifSwitch').addEventListener('change', async (e)=>{
  const on = e.target.checked; state.settings.notifications = on; save();
  if(on && 'Notification' in window){
    const p = await Notification.requestPermission();
    if(p!=='granted'){ toast('Notifications blocked in browser','warn'); $('#notifSwitch').checked=false; state.settings.notifications=false; save(); }
  }
});

/* ----------------- Profile ----------------- */
$('#profileName').value = state.settings.profile?.name || '';
$('#profileEmail').value = state.settings.profile?.email || '';
$('#profileOccupation').value = state.settings.profile?.occupation || '';
$('#profilePhone').value = state.settings.profile?.phone || '';
$('#profileBio').value = state.settings.profile?.bio || '';
if(state.settings.profile?.avatar) $('#profileAvatar').src = state.settings.profile.avatar;

$('#saveProfileBtn').addEventListener('click', ()=>{
  state.settings.profile.name = $('#profileName').value.trim();
  state.settings.profile.email = $('#profileEmail').value.trim();
  state.settings.profile.occupation = $('#profileOccupation').value.trim();
  state.settings.profile.phone = $('#profilePhone').value.trim();
  state.settings.profile.bio = $('#profileBio').value.trim();
  save(); toast(t('toast.profileSaved')); logActivity(t('toast.profileSaved'));
});
$('#profilePic').addEventListener('change', (e)=>{
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader(); reader.onload=()=>{ state.settings.profile.avatar=reader.result; $('#profileAvatar').src=reader.result; save(); toast(t('toast.photoUpdated')); logActivity(t('toast.photoUpdated')); }; reader.readAsDataURL(file);
});

/* ----------------- Passcode lock ----------------- */
$('#savePasscodeBtn').addEventListener('click', ()=>{
  const v=$('#passcodeInput').value.trim();
  if(v && v.length<4){ toast('Passcode must be 4+ digits','err'); return; }
  state.settings.passcode=v; state.settings.unlocked=!v; save(); toast(t('toast.passcodeSaved')); logActivity(t('toast.passcodeSaved')); maybeLock();
});
function maybeLock(){
  const overlay=$('#lockOverlay');
  if(state.settings.passcode && !state.settings.unlocked){ overlay.classList.remove('hidden'); overlay.setAttribute('aria-hidden','false'); }
  else { overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true'); }
}
$('#unlockBtn').addEventListener('click', ()=>{
  const v=$('#lockInput').value.trim();
  if(v===state.settings.passcode){ state.settings.unlocked=true; save(); $('#lockOverlay').classList.add('hidden'); $('#lockOverlay').setAttribute('aria-hidden','true'); toast(t('toast.unlocked')); }
  else { $('#lockHint').textContent='Wrong passcode'; setTimeout(()=>$('#lockHint').textContent='',1300); }
});
document.addEventListener('visibilitychange', ()=>{
  if(document.hidden && state.settings.passcode){ state.settings.unlocked=false; save(); } else { maybeLock(); }
});
maybeLock();

/* ----------------- Categories: populate selects ----------------- */
function populateCategorySelects(){
  const lang = state.settings.language || 'en';
  const txType = $('#txType')?.value || 'expense';
  const build = arr => arr.map(c=>`<option value="${c.key}">${c.icon} ${lang==='bn'?c.name_bn:c.name_en}</option>`).join('');
  if($('#txCategory')) $('#txCategory').innerHTML = build(allCategories(txType));
  const allCats = [...allCategories('income'), ...allCategories('expense')];
  if($('#txFilterCat')) $('#txFilterCat').innerHTML = `<option value="">${t('tx.allCats')}</option>` + allCats.map(c=>`<option value="${c.key}">${c.icon} ${lang==='bn'?c.name_bn:c.name_en}</option>`).join('');
  if($('#budgetCategory')) $('#budgetCategory').innerHTML = allCategories('expense').map(c=>`<option value="${c.key}">${c.icon} ${lang==='bn'?c.name_bn:c.name_en}</option>`).join('');
}
$('#txType')?.addEventListener('change', populateCategorySelects);

/* ----------------- Modal focus trap ----------------- */
function trapFocus(modalEl){
  const focusable='a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  const nodes=Array.from(modalEl.querySelectorAll(focusable)).filter(n=>n.offsetParent!==null);
  if(nodes.length) nodes[0].focus();
  function onKey(e){
    if(e.key==='Escape'){ closeAllModals(); }
    if(e.key==='Tab'){
      const first=nodes[0], last=nodes[nodes.length-1];
      if(e.shiftKey){ if(document.activeElement===first){ e.preventDefault(); last.focus(); } }
      else { if(document.activeElement===last){ e.preventDefault(); first.focus(); } }
    }
  }
  modalEl.__trap=onKey; document.addEventListener('keydown', onKey);
}
function releaseTrap(modalEl){ if(modalEl && modalEl.__trap){ document.removeEventListener('keydown', modalEl.__trap); modalEl.__trap=null; } }
function closeAllModals(){ closeTxModal(); closeBudgetModal(); closeCatModal(); }

/* ----------------- Transaction modal ----------------- */
function openTxModal(editId=null){
  $('#txForm').reset(); $('#txId').value=editId||''; $('#txDeleteBtn').classList.toggle('hidden', !editId);
  $('#txModalTitle').textContent = editId ? t('tx.editTitle') : t('tx.addTitle');
  $('#txType').value = editId ? (state.transactions.find(t=>t.id===editId)?.type || 'expense') : 'expense';
  populateCategorySelects();
  if(editId){
    const tx=state.transactions.find(t=>t.id===editId); if(!tx) return;
    $('#txType').value=tx.type; populateCategorySelects();
    $('#txCategory').value=tx.category; $('#txAmount').value=tx.amount; $('#txDate').value=tx.date; $('#txNotes').value=tx.notes||''; $('#txRecurring').value=tx.recurringDays||'';
  }else{ $('#txDate').value=todayISO(); $('#txRecurring').value=''; }
  const modal=$('#txModal'); modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; trapFocus(modal);
}
function closeTxModal(){ const m=$('#txModal'); m.classList.remove('show'); m.setAttribute('aria-hidden','true'); document.body.style.overflow=''; releaseTrap(m); }
$('#homeAddBtn').addEventListener('click',()=>openTxModal());
$('#txAddBtn').addEventListener('click',()=>openTxModal());
$('#txModalClose').addEventListener('click',closeTxModal);
$('#txModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeTxModal(); });

$('#txDeleteBtn').addEventListener('click', ()=>{
  const id=$('#txId').value; if(!id) return;
  if(confirm(t('confirm.deleteTransaction'))){
    state.transactions = state.transactions.filter(t=>t.id!==id); save(); toast(t('toast.transactionDeleted')); logActivity(t('toast.transactionDeleted')); closeTxModal(); renderAll();
  }
});

/* ----------------- Budget modal ----------------- */
function openBudgetModal(editId=null){
  $('#budgetForm').reset(); $('#budgetId').value = editId||''; $('#budgetDeleteBtn').classList.toggle('hidden', !editId);
  $('#budgetModalTitle').textContent = editId ? t('budget.editTitle') : t('budget.addTitle');
  populateCategorySelects();
  if(editId){
    const b=state.budgets.find(x=>x.id===editId); if(b){ $('#budgetCategory').value=b.category; $('#budgetAmount').value=b.amount; }
  }
  const modal=$('#budgetModal'); modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; trapFocus(modal);
}
function closeBudgetModal(){ const m=$('#budgetModal'); m.classList.remove('show'); m.setAttribute('aria-hidden','true'); document.body.style.overflow=''; releaseTrap(m); }
$('#budgetAddBtn').addEventListener('click',()=>openBudgetModal());
$('#budgetModalClose').addEventListener('click',closeBudgetModal);
$('#budgetModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeBudgetModal(); });

$('#budgetDeleteBtn').addEventListener('click', ()=>{
  const id=$('#budgetId').value; if(!id) return;
  state.budgets = state.budgets.filter(b=>b.id!==id); save(); toast(t('toast.budgetRemoved')); logActivity(t('toast.budgetRemoved')); closeBudgetModal(); renderBudgets();
});

/* ----------------- Category modal (NEW) ----------------- */
function openCatModal(editKey=null, type='expense'){
  $('#catForm').reset(); $('#catId').value = editKey || ''; $('#catDeleteBtn').classList.toggle('hidden', !editKey);
  $('#catModalTitle').textContent = editKey ? 'Edit Category' : 'Add Category';
  $('#catType').value = type;

  if(editKey){
    const list = state.customCats[type] || [];
    const meta = list.find(c=>c.key===editKey);
    if(meta){ $('#catIcon').value=meta.icon||''; $('#catNameEn').value=meta.name_en||''; $('#catNameBn').value=meta.name_bn||''; }
  }
  const modal=$('#catModal'); modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; trapFocus(modal);
}
function closeCatModal(){ const m=$('#catModal'); m.classList.remove('show'); m.setAttribute('aria-hidden','true'); document.body.style.overflow=''; releaseTrap(m); }
$('#catAddBtn').addEventListener('click',()=>openCatModal(null,'expense'));
$('#catModalClose').addEventListener('click',closeCatModal);
$('#catModal').addEventListener('click',e=>{ if(e.target===e.currentTarget) closeCatModal(); });

$('#catSaveBtn').addEventListener('click', ()=>{
  const id = $('#catId').value || cryptoRandomId();
  const type = $('#catType').value;
  const icon = $('#catIcon').value.trim() || '🔖';
  const name_en = $('#catNameEn').value.trim() || 'Custom';
  const name_bn = $('#catNameBn').value.trim() || 'কাস্টম';
  const list = state.customCats[type] || (state.customCats[type]=[]);
  const existingIdx = list.findIndex(c=>c.key===id);
  const meta = { key:id, icon, name_en, name_bn };
  if(existingIdx>=0) list[existingIdx]=meta; else list.push(meta);
  save(); closeCatModal(); populateCategorySelects(); renderCatList(); renderAll(); toast('Category saved','ok');
});
$('#catDeleteBtn').addEventListener('click', ()=>{
  const id=$('#catId').value; const type=$('#catType').value;
  if(!id) return;
  state.customCats[type] = (state.customCats[type]||[]).filter(c=>c.key!==id);
  save(); closeCatModal(); populateCategorySelects(); renderCatList(); renderAll(); toast('Category deleted','ok');
});
function renderCatList(){
  const el=$('#catList'); el.innerHTML='';
  ['expense','income'].forEach(type=>{
    const header=document.createElement('div'); header.className='sub'; header.textContent = type.toUpperCase();
    el.appendChild(header);
    const items=[...state.customCats[type]];
    if(items.length===0){
      const none=document.createElement('div'); none.className='sub'; none.textContent='—';
      el.appendChild(none);
    }else{
      items.forEach(meta=>{
        const row=document.createElement('div'); row.className='item';
        row.innerHTML = `
          <div class="left">
            <div class="badge">${meta.icon||'🔖'}</div>
            <div>
              <div class="title">${nameFor(meta)}</div>
              <div class="sub">${meta.name_en} / ${meta.name_bn}</div>
            </div>
          </div>
          <button class="btn ghost small-btn edit" data-type="${type}" data-id="${meta.key}"><i class="fa-solid fa-pen"></i></button>
        `;
        row.querySelector('.edit').addEventListener('click', (e)=> openCatModal(e.currentTarget.dataset.id, e.currentTarget.dataset.type));
        el.appendChild(row);
      });
    }
  });
}

/* ----------------- Transaction submit ----------------- */
$('#txForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const id = $('#txId').value || cryptoRandomId();
  const tx = {
    id,
    type: $('#txType').value,
    category: $('#txCategory').value,
    amount: Math.max(0, parseFloat($('#txAmount').value || '0')),
    date: $('#txDate').value,
    notes: $('#txNotes').value.trim(),
    recurringDays: parseInt($('#txRecurring').value) || 0,
    recurNext: ''
  };
  if(tx.recurringDays>0) tx.recurNext = nextDate(tx.date, tx.recurringDays);
  const existingIdx = state.transactions.findIndex(t=>t.id===id);
  if(existingIdx>=0){ state.transactions[existingIdx]=tx; logActivity(t('tx.editTitle')); }
  else { state.transactions.push(tx); logActivity(t('tx.addTitle')); }
  save(); closeTxModal(); renderAll();
});
$('#txSaveBtn')?.addEventListener('click',()=>{
  const form=$('#txForm');
  if(form) form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit',{cancelable:true}));
});

/* ----------------- Budget submit ----------------- */
$('#budgetForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const id = $('#budgetId').value || cryptoRandomId();
  const b = { id, category: $('#budgetCategory').value, amount: Math.max(0, parseFloat($('#budgetAmount').value || '0')) };
  const existing = state.budgets.findIndex(x=>x.id===id);
  if(existing>=0){ state.budgets[existing]=b; logActivity(t('budget.editTitle')); } else { state.budgets.push(b); logActivity(t('budget.addTitle')); }
  save(); closeBudgetModal(); renderBudgets();
});
$('#budgetSaveBtn')?.addEventListener('click',()=>{
  const form=$('#budgetForm');
  if(form) form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit',{cancelable:true}));
});

/* ----------------- Recurring processing ----------------- */
function processRecurring(){
  const today=todayISO(); let added=0;
  state.transactions.slice().forEach(base=>{
    if(!base || !base.recurringDays) return;
    if(!base.recurNext) base.recurNext = nextDate(base.date, base.recurringDays);
    while(base.recurNext && base.recurNext <= today){
      const copy = { ...base, id: cryptoRandomId(), date: base.recurNext, notes: (base.notes||'')+' (recurring)', recurNext:'' };
      copy.recurringDays = base.recurringDays;
      state.transactions.push(copy);
      base.recurNext = nextDate(base.recurNext, base.recurringDays);
      added++;
    }
  });
  if(added>0){ save(); logActivity(`Auto-added ${added} recurring tx`); toast(`Added ${added} recurring items`,'ok'); }
}
processRecurring();

/* ----------------- Rendering ----------------- */
let lineChart, pieChart, barChart, doughnutChart;

function renderAll(){ applyI18n(); renderCards(); renderTransactions(); renderBudgets(); renderCharts(); renderActivity(); populateCategorySelects(); renderCatList(); renderSubs(); }
function renderCards(){
  const inc=sumOf(t=>t.type==='income');
  const exp=sumOf(t=>t.type==='expense');
  animateCount($('#homeIncome'), inc);
  animateCount($('#homeExpense'), exp);
  animateCount($('#homeBalance'), inc-exp);
}
function animateCount(el,target){
  if(!el) return;
  const start=Number(el.dataset._value||0); const end=Number(target||0);
  el.dataset._value=end; const duration=600; const startTime=performance.now();
  function step(now){
    const tt=Math.min(1,(now-startTime)/duration);
    const val=Math.round((start+(end-start)*easeOutCubic(tt))*100)/100;
    el.innerHTML = currencyHTML(val);
    if(tt<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOutCubic(t){ return 1 - Math.pow(1-t,3); }

/* --- Transactions list (with advanced filters) --- */
function renderTransactions(){
  const term = ($('#txSearch').value||'').toLowerCase();
  const typeF = $('#txFilterType').value;
  const catF = $('#txFilterCat').value;
  const from = $('#txDateFrom').value;
  const to = $('#txDateTo').value;
  const min = parseFloat($('#txAmountMin').value||'') || null;
  const max = parseFloat($('#txAmountMax').value||'') || null;

  const txs = state.transactions.slice()
    .sort((a,b)=> b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .filter(tx=>{
      if(typeF && tx.type !== typeF) return false;
      if(catF && tx.category !== catF) return false;
      if(from && tx.date < from) return false;
      if(to && tx.date > to) return false;
      if(min!=null && Number(tx.amount) < min) return false;
      if(max!=null && Number(tx.amount) > max) return false;
      if(term){
        const meta = getCatMeta(tx.type, tx.category);
        const name = meta ? `${meta.name_en} ${meta.name_bn}` : '';
        const hay = `${tx.category} ${name} ${tx.notes} ${tx.amount} ${tx.date}`.toLowerCase();
        return hay.includes(term);
      }
      return true;
    });

  $('#txEmpty').classList.toggle('hidden', txs.length>0);
  const list=$('#txList'); list.innerHTML='';
  txs.forEach(tx=>{
    const meta = getCatMeta(tx.type, tx.category);
    const item=document.createElement('div'); item.className='item';
    const sign = tx.type==='income' ? '+' : '-';
    const parts = fmtParts(tx.amount);

    item.innerHTML = `
      <div class="left">
        <div class="badge">${meta?.icon || '🔖'}</div>
        <div>
          <div class="title">${meta ? nameFor(meta) : t('unknown')}</div>
          <div class="sub">${tx.date}${tx.notes ? ` • ${escapeHtml(tx.notes)}` : ''}${tx.recurringDays ? ` • ⟳ ${recurringLabel(tx.recurringDays)}` : ''}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div class="amount ${tx.type==='income' ? 'positive':'negative'}">${sign}<span class="cur">${parts.sym}</span>${parts.num}</div>
        <div style="display:flex;gap:6px;align-items:center">
          <button class="btn small-btn edit-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn small-btn danger delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
    item.querySelector('.edit-btn').addEventListener('click',(e)=>{ e.stopPropagation(); openTxModal(tx.id); });
    item.querySelector('.delete-btn').addEventListener('click',(e)=>{
      e.stopPropagation();
      if(confirm(t('confirm.deleteTransaction'))){
        state.transactions = state.transactions.filter(t=>t.id!==tx.id); save(); toast(t('toast.transactionDeleted')); logActivity(t('toast.transactionDeleted')); renderAll();
      }
    });
    item.addEventListener('click', (e)=>{ if(!e.target.closest('button')) openTxModal(tx.id); });
    list.appendChild(item);
  });
}

/* Subscriptions / recurring snapshot */
function renderSubs(){
  const el = $('#subsList'); if(!el) return;
  el.innerHTML='';
  const bases = state.transactions.filter(t=>t.recurringDays>0)
    .sort((a,b)=> a.type.localeCompare(b.type) || a.category.localeCompare(b.category));
  if(bases.length===0){ el.textContent='—'; return; }
  bases.forEach(tx=>{
    const meta=getCatMeta(tx.type, tx.category);
    const chip=document.createElement('div'); chip.className='chip';
    chip.innerHTML = `${meta?.icon||'⟳'} ${nameFor(meta)} • ${recurringLabel(tx.recurringDays)} • ${currencyHTML(tx.amount)}`;
    el.appendChild(chip);
  });
}

/* --- Budgets --- */
function renderBudgets(){
  const el=$('#budgetsContainer'); el.innerHTML='';
  const thisMonthKey=todayISO().slice(0,7);
  if(!state.alerts) state.alerts={budgets:{}};
  const alerted=state.alerts.budgets;

  state.budgets.forEach(b=>{
    const spent = state.transactions
      .filter(t=> t.type==='expense' && t.category===b.category && isSameMonth(t.date))
      .reduce((s,t)=> s+Number(t.amount),0);
    const pct = b.amount>0 ? Math.min(100, Math.round(spent/b.amount*100)) : 0;
    const meta=getCatMeta('expense', b.category);
    const wrap=document.createElement('div'); wrap.className='item';
    wrap.innerHTML = `
      <div class="left">
        <div class="badge">${meta?.icon || '🎯'}</div>
        <div>
          <div class="title">${nameFor(meta)}</div>
          <div class="sub">${currencyHTML(spent)} / ${currencyHTML(b.amount)} (${pct}%)</div>
          <div style="margin-top:6px;height:8px;background:#e5e7eb;border-radius:6px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${pct>=100?'#ef4444':(pct>=80?'#f59e0b':'var(--brand)')}"></div>
          </div>
        </div>
      </div>
      <button class="btn ghost small-btn" data-id="${b.id}"><i class="fa-solid fa-pen"></i></button>
    `;
    wrap.querySelector('button').addEventListener('click',()=>openBudgetModal(b.id));
    el.appendChild(wrap);

    const key = `${thisMonthKey}:${b.category}`;
    if(pct>=80 && !alerted[key]){ toast(`${nameFor(meta)} ${pct}% of budget`, pct>=100?'err':'warn'); alerted[key]=true; save(); }
  });
}

/* --- Charts --- */
function generateColors(n){ const colors=[]; for(let i=0;i<n;i++){ const hue=(210 + (i*40))%360; colors.push(`hsl(${hue} 70% 55%)`); } return colors; }
function cssVar(name,fallback=''){ const val=getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return val||fallback; }

$('#rangeSelect').addEventListener('change', ()=> renderCharts(true));

function renderCharts(force=false){
  setChartTheme();
  const ctx1=$('#lineChart')?.getContext('2d');
  const ctx2=$('#pieChart')?.getContext('2d');
  const ctx3=$('#barChart')?.getContext('2d');
  const ctx4=$('#doughnutChart')?.getContext('2d');
  if(!ctx1||!ctx2||!ctx3||!ctx4) return;

  const rangeDays = parseInt($('#rangeSelect').value || '30',10);
  const daysBack = rangeDays-1;
  const labels=[]; const incData=[]; const expData=[];
  for(let i=daysBack;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    labels.push(d.toLocaleDateString(undefined,{month:'short', day:'numeric'}));
    const iso=toISO(d);
    incData.push(sumOf(t=>t.type==='income' && t.date===iso));
    expData.push(sumOf(t=>t.type==='expense' && t.date===iso));
  }

  if(lineChart && force){ lineChart.destroy(); lineChart=null; }
  if(!lineChart){
    lineChart=new Chart(ctx1,{
      type:'line',
      data:{ labels, datasets:[
        { label:t('home.income'), data:incData, borderColor:cssVar('--brand'), backgroundColor:cssVar('--brand'), tension:.25, pointRadius:2 },
        { label:t('home.expense'), data:expData, borderColor:cssVar('--red'), backgroundColor:cssVar('--red'), tension:.25, pointRadius:2 }
      ]},
      options:{ responsive:true, maintainAspectRatio:false, interaction:{mode:'index',intersect:false}, plugins:{ tooltip:{ callbacks:{ label:ctx=>`${ctx.dataset.label}: ${fmt(ctx.parsed.y)}` } } }, scales:{ y:{ ticks:{ callback:v=>fmt(v) } } } }
    });
  }else{
    lineChart.data.labels=labels; lineChart.data.datasets[0].data=incData; lineChart.data.datasets[1].data=expData; lineChart.update();
  }

  // Monthly aggregations
  const thisMonth = todayISO().slice(0,7);
  const catMap={};
  state.transactions.filter(t=>t.type==='expense' && t.date.startsWith(thisMonth)).forEach(t=> catMap[t.category]=(catMap[t.category]||0)+Number(t.amount));
  const pieLabels=Object.keys(catMap).map(k=>nameFor(getCatMeta('expense',k)));
  const pieValues=Object.values(catMap);
  const pieColors = pieLabels.length ? generateColors(pieLabels.length) : [cssVar('--brand')];
  if(pieChart && force){ pieChart.destroy(); pieChart=null; }
  if(!pieChart){
    pieChart=new Chart(ctx2,{ type:'pie', data:{ labels: pieLabels.length?pieLabels:[t('unknown')], datasets:[{ data: pieValues.length?pieValues:[1], backgroundColor: pieColors }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{ tooltip:{ callbacks:{ label:ctx=>`${ctx.label}: ${fmt(ctx.parsed)}` } } } }});
  }else{
    pieChart.data.labels=pieLabels.length?pieLabels:[t('unknown')]; pieChart.data.datasets[0].data=pieValues.length?pieValues:[1]; pieChart.data.datasets[0].backgroundColor=pieColors; pieChart.update();
  }

  // Top 5
  const sortedCats=Object.entries(catMap).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const barLabels=sortedCats.map(([k])=>nameFor(getCatMeta('expense',k)));
  const barValues=sortedCats.map(([,v])=>v);
  const barColors=barLabels.length ? generateColors(barLabels.length) : [cssVar('--brand')];
  if(barChart && force){ barChart.destroy(); barChart=null; }
  if(!barChart){
    barChart=new Chart(ctx3,{ type:'bar', data:{ labels:barLabels.length?barLabels:[t('unknown')], datasets:[{ data:barValues.length?barValues:[1], backgroundColor:barColors }]}, options:{ responsive:true, maintainAspectRatio:false, scales:{ y:{ ticks:{ callback:v=>fmt(v) } } }, plugins:{ tooltip:{ callbacks:{ label:ctx=>`${ctx.label}: ${fmt(ctx.parsed.y)}` } } } }});
  }else{
    barChart.data.labels=barLabels.length?barLabels:[t('unknown')]; barChart.data.datasets[0].data=barValues.length?barValues:[1]; barChart.data.datasets[0].backgroundColor=barColors; barChart.update();
  }

  // Income by source
  const incMap={};
  state.transactions.filter(t=>t.type==='income' && t.date.startsWith(thisMonth)).forEach(t=> incMap[t.category]=(incMap[t.category]||0)+Number(t.amount));
  const doughLabels=Object.keys(incMap).map(k=>nameFor(getCatMeta('income',k)));
  const doughValues=Object.values(incMap);
  const doughColors=doughLabels.length ? generateColors(doughLabels.length) : [cssVar('--brand')];
  if(doughnutChart && force){ doughnutChart.destroy(); doughnutChart=null; }
  if(!doughnutChart){
    doughnutChart=new Chart(ctx4,{ type:'doughnut', data:{ labels:doughLabels.length?doughLabels:[t('unknown')], datasets:[{ data:doughValues.length?doughValues:[1], backgroundColor:doughColors }]}, options:{ responsive:true, maintainAspectRatio:false, plugins:{ tooltip:{ callbacks:{ label:ctx=>`${ctx.label}: ${fmt(ctx.parsed)}` } } } }});
  }else{
    doughnutChart.data.labels=doughLabels.length?doughLabels:[t('unknown')]; doughnutChart.data.datasets[0].data=doughValues.length?doughValues:[1]; doughnutChart.data.datasets[0].backgroundColor=doughColors; doughnutChart.update();
  }
}

/* --- Search bindings --- */
function debounce(fn,wait=220){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn.apply(this,args), wait); }; }
$('#txSearch').addEventListener('input', debounce(renderTransactions, 180));
$('#txFilterType').addEventListener('change', renderTransactions);
$('#txFilterCat').addEventListener('change', renderTransactions);
$('#txDateFrom').addEventListener('change', renderTransactions);
$('#txDateTo').addEventListener('change', renderTransactions);
$('#txAmountMin').addEventListener('input', debounce(renderTransactions, 200));
$('#txAmountMax').addEventListener('input', debounce(renderTransactions, 200));

/* --- Export helpers --- */
function downloadBlob(blob, filename){
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 5000);
}
$('#exportJsonBtn').addEventListener('click', ()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); downloadBlob(blob, `cashopia-${Date.now()}.json`);
});
$('#exportCsvBtn').addEventListener('click', ()=>{
  const head='id,type,category,amount,date,notes,recurringDays\n';
  const rows=state.transactions.map(t=>[t.id,t.type,t.category,t.amount,t.date,(t.notes||'').replace(/\n/g,' ').replace(/"/g,'""'),t.recurringDays||0].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  downloadBlob(new Blob([head+rows],{type:'text/csv'}),`cashopia-${Date.now()}.csv`);
});

/* --- CSV parser & Import --- */
function parseCSV(text){
  const rows=[]; let cur=''; let inQuotes=false; let field='';
  for(let i=0;i<text.length;i++){
    const ch=text[i]; const next=text[i+1];
    if(ch==='"' && inQuotes && next==='"'){ field+='"'; i++; continue; }
    if(ch==='"'){ inQuotes=!inQuotes; continue; }
    if((ch===','||ch==='\n'||ch==='\r') && !inQuotes){
      cur+=field; field='';
      if(ch===',') cur+='\t'; else { rows.push(cur.split('\t')); cur=''; }
      continue;
    }
    field+=ch;
  }
  if(field) cur+=field; if(cur) rows.push(cur.split('\t'));
  return rows;
}
$('#importBtn').addEventListener('click', ()=>$('#importFile').click());
$('#importFile').addEventListener('change', (e)=>{
  const f=e.target.files[0]; if(!f) return;
  const reader=new FileReader(); reader.onload=()=>{
    const text=reader.result;
    if(f.name.toLowerCase().endsWith('.json')){
      try{
        const obj=JSON.parse(text);
        if(obj.transactions && Array.isArray(obj.transactions)){
          state.transactions = state.transactions.concat(obj.transactions.map(x=>({ ...x, id: x.id || cryptoRandomId() })));
          // Also import custom categories if present
          if(obj.customCats){ state.customCats = obj.customCats; }
          save(); toast(t('toast.importedJson')); logActivity(t('toast.importedJson')); renderAll();
        }else{ toast('JSON file does not contain transactions','err'); }
      }catch(err){ toast('Invalid JSON','err'); }
    }else{
      try{
        const rows=parseCSV(text);
        const header=rows[0].map(h=>h.trim().toLowerCase());
        const idx={ id:header.indexOf('id'), type:header.indexOf('type'), category:header.indexOf('category'), amount:header.indexOf('amount'), date:header.indexOf('date'), notes:header.indexOf('notes'), recurringDays:header.indexOf('recurringdays') };
        const dataRows=rows.slice(1); const added=[];
        dataRows.forEach(r=>{
          if(r.length<2) return;
          const txx={
            id:(idx.id>=0 ? r[idx.id] : cryptoRandomId()) || cryptoRandomId(),
            type:(idx.type>=0 ? r[idx.type] : 'expense') || 'expense',
            category: idx.category>=0 ? r[idx.category] : 'other_exp',
            amount: Number(idx.amount>=0 ? r[idx.amount] : 0) || 0,
            date: idx.date>=0 ? r[idx.date] : todayISO(),
            notes: idx.notes>=0 ? r[idx.notes] : '',
            recurringDays: idx.recurringDays>=0 ? Number(r[idx.recurringDays])||0 : 0
          };
          state.transactions.push(txx); added.push(txx);
        });
        save(); toast(`${t('toast.importedCsv')}: ${added.length}`); logActivity(`${t('toast.importedCsv')}: ${added.length}`); renderAll();
      }catch(err){ console.error(err); toast('CSV parse error','err'); }
    }
  };
  reader.readAsText(f);
});

/* --- Reset --- */
$('#resetBtn').addEventListener('click', ()=>{
  if(!confirm(t('btn.reset'))) return;
  localStorage.removeItem(LS_KEY);
  state.transactions=[]; state.budgets=[]; state.activity=[]; state.alerts={budgets:{}};
  state.customCats={ income:[], expense:[] };
  state.settings={ themeDark:false, brandColor:'#5b8def', language:'en', currency:'BDT', notifications:false, passcode:'', profile:{ name:'', email:'', occupation:'', phone:'', bio:'', avatar:'' }, unlocked:true };
  save(); toast('Reset complete','ok'); location.reload();
});

/* --- Activity log --- */
function logActivity(text){ state.activity.unshift({ time:new Date().toISOString(), text }); if(state.activity.length>200) state.activity.length=200; }
function renderActivity(){
  const log=$('#activityLog'); log.innerHTML='';
  state.activity.slice(0,50).forEach(a=>{
    const row=document.createElement('div'); row.className='sub'; row.textContent=`• ${new Date(a.time).toLocaleString()}: ${a.text}`; log.appendChild(row);
  });
}

/* ----------------- Kickoff ----------------- */
function findTx(id){ return state.transactions.find(t=>t.id===id); }
applyI18n();
applySettingsToDOM();
populateCategorySelects();
renderAll();
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closeAllModals(); } });
setInterval(()=>save(), 10000);

/* ----------------- Expose for debugging ----------------- */
window._cashopia = { state, save, load };
