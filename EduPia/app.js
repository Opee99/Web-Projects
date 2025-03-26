// No changes were provided in the plan, so the code remains the same
particlesJS.load('particles-js', 'particlesjs-config.json', function () {
  console.log('particles.js config loaded');
});

var app = document.getElementById('cover-text');

var typewriter = new Typewriter(app, {
  loop: true,
  delay: 75,
});

typewriter
  .pauseFor(2500)
  .typeString(' Best Online Learning Platform')
  .pauseFor(300)
  .deleteChars(30)
  .typeString(' Accessible Online Courses For All')
  .pauseFor(300)
  .deleteChars(34)
  .typeString(' Own Your Future—Learn New Skills Online')
  .pauseFor(300)
  .start();

// JavaScript to handle the login/register popup
const closeModalButton = document.getElementById('closeModal');
const loginModal = document.getElementById('loginModal');
const loginButton = document.querySelector('.neon-button');
const registerLink = document.getElementById('registerLink');
const loginLink = document.getElementById('loginLink');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const cartButton = document.querySelector('.fa-shopping-cart').parentNode;
const cartModal = document.getElementById('cartModal');
const closeCartModalButton = document.getElementById('closeCartModal');

loginButton.addEventListener('click', () => {
  loginModal.classList.remove('hidden');
});

registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
});

loginLink.addEventListener('click', (e) => {
  e.preventDefault();
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

document.querySelector('.neon-button.text-xl').addEventListener('click', () => {
  loginModal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', () => {
  loginModal.classList.add('hidden');
});

loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.classList.add('hidden');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  }
});

cartButton.addEventListener('click', () => {
  cartModal.classList.remove('hidden');
});

closeCartModalButton.addEventListener('click', () => {
  cartModal.classList.add('hidden');
});

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.add('hidden');
  }
});

// Cart functionality
let cartItems = [];

function addToCart(courseName, courseFullName) {
  const existingItem = cartItems.find(item => item.name === courseFullName);
    if (!existingItem) {
        cartItems.push({ name: courseFullName, count: 1 });
        updateCartModal();
        updateCartCount();
        updateCartListInProfile();
        alert(`${courseFullName} added to cart successfully!`);
    } else {
        alert(`${courseFullName} is already in the cart!`);
    }
}

function updateCartModal() {
  const cartList = document.querySelector('#cartModal ul');
  cartList.innerHTML = ''; // Clear existing items

  if (cartItems.length === 0) {
    cartList.innerHTML = '<li class="text-gray-300 mb-2">No items in cart.</li>';
  } else {
    cartItems.forEach((item, index) => { 
      const li = document.createElement('li');
      li.className = 'text-gray-300 mb-2 flex items-center justify-between'; 
      const coursePrice = getCoursePrice(item.name);
      li.innerHTML = `<span>${item.name} - $${coursePrice.toFixed(2)}</span>`;
      const removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fas fa-times"></i>'; 
      removeButton.className = 'text-red-500 hover:text-red-700 focus:outline-none'; 
      removeButton.addEventListener('click', () => removeFromCart(index)); 

      li.appendChild(removeButton);
      cartList.appendChild(li);
    });
  }
}

function updateCartListInProfile() {
    const cartListProfile = document.getElementById('cartListProfile');
    cartListProfile.innerHTML = ''; // Clear existing items

    if (cartItems.length === 0) {
        cartListProfile.innerHTML = '<li class="text-gray-300 mb-2">No items in cart.</li>';
    } else {
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'text-gray-300 mb-2';
            li.textContent = item.name;
            cartListProfile.appendChild(li);
        });
    }
}

function removeFromCart(index) {
  cartItems.splice(index, 1); 
  updateCartModal(); 
  updateCartCount(); 
  updateCartListInProfile();
}

function updateCartCount() {
  const cartCountSpan = document.querySelector('.fa-shopping-cart').parentNode.querySelector('span');
  cartCountSpan.textContent = cartItems.length;
}

// Attach event listeners to "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.course-card .neon-button:nth-child(1)'); 
addToCartButtons.forEach(button => {
  button.addEventListener('click', function() {
    const courseCard = this.closest('.course-card');
    const courseName = courseCard.querySelector('img').alt;
    const courseFullName = courseCard.querySelector('.text-gray-300').textContent; // Get the full course name
    addToCart(courseName, courseFullName);
  });
});

// Attach event listeners to "Add to Cart" buttons in all courses page
const addToCartButtonsAllCourses = document.querySelectorAll('.course-card .add-to-cart-btn'); 
addToCartButtonsAllCourses.forEach(button => {
  button.addEventListener('click', function() {
    const courseCard = this.closest('.course-card');
    const courseName = courseCard.querySelector('img').alt;
    const courseFullName = courseCard.querySelector('.text-gray-300').textContent; // Get the full course name
    addToCart(courseName, courseFullName);
  });
});

// Attach event listeners to "Buy Now" buttons
const buyNowButtons = document.querySelectorAll('.course-card .neon-button:nth-child(2)');
buyNowButtons.forEach(button => {
    button.addEventListener('click', function() {
        const courseCard = this.closest('.course-card');
        const courseFullName = courseCard.querySelector('.text-gray-300').textContent; // Get the full course name
        const coursePrice = getCoursePrice(courseFullName);
        openBuyNowModal(courseFullName, coursePrice);
    });
});

// Attach event listeners to "Buy Now" buttons in All courses page
const buyNowButtonsAllCourses = document.querySelectorAll('.course-card .buy-now-btn');
buyNowButtonsAllCourses.forEach(button => {
    button.addEventListener('click', function() {
        const courseCard = this.closest('.course-card');
        const courseFullName = courseCard.querySelector('.text-gray-300').textContent; // Get the full course name
        const coursePrice = getCoursePrice(courseFullName);
        openBuyNowModal(courseFullName, coursePrice);
    });
});

function openBuyNowModal(courseName, coursePrice) {
    const buyNowModal = document.createElement('div');
    buyNowModal.id = 'buyNowModal';
    buyNowModal.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center';

    const modalContent = document.createElement('div');
    modalContent.className = 'glassy-neon p-8 rounded-lg w-full max-w-md relative';

    const closeModalButton = document.createElement('button');
    closeModalButton.innerHTML = '<i class="fas fa-times"></i>';
    closeModalButton.className = 'absolute top-2 right-2 text-gray-500 hover:text-gray-300';
    closeModalButton.addEventListener('click', () => buyNowModal.remove());

    const courseNameHeading = document.createElement('h2');
    courseNameHeading.textContent = courseName;
    courseNameHeading.className = 'text-2xl font-bold neon-text text-center mb-4';

    const coursePriceElement = document.createElement('p');
    coursePriceElement.textContent = `Price: $${coursePrice.toFixed(2)}`;
    coursePriceElement.className = 'text-gray-300 text-center mb-4';

    const paymentButton = document.createElement('button');
    paymentButton.textContent = 'Proceed to Payment';
    paymentButton.className = 'neon-button text-sm block mx-auto';
    paymentButton.addEventListener('click', () => {
        openPaymentModal(courseName, coursePrice);
        buyNowModal.remove();
    });

    modalContent.appendChild(closeModalButton);
    modalContent.appendChild(courseNameHeading);
    modalContent.appendChild(coursePriceElement);
    modalContent.appendChild(paymentButton);

    buyNowModal.appendChild(modalContent);
    document.body.appendChild(buyNowModal);

    buyNowModal.addEventListener('click', (e) => {
        if (e.target === buyNowModal) {
            buyNowModal.remove();
        }
    });
}

function openPaymentModal(courseName, coursePrice) {
    const paymentModal = document.createElement('div');
    paymentModal.id = 'paymentModal';
    paymentModal.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center';

    const modalContent = document.createElement('div');
    modalContent.className = 'glassy-neon p-8 rounded-lg w-full max-w-md relative';

    const closeModalButton = document.createElement('button');
    closeModalButton.innerHTML = '<i class="fas fa-times"></i>';
    closeModalButton.className = 'absolute top-2 right-2 text-gray-500 hover:text-gray-300';
    closeModalButton.addEventListener('click', () => paymentModal.remove());

    const courseNameHeading = document.createElement('h2');
    courseNameHeading.textContent = courseName;
    courseNameHeading.className = 'text-2xl font-bold neon-text text-center mb-4';

    const coursePriceElement = document.createElement('p');
    coursePriceElement.textContent = `Price: $${coursePrice.toFixed(2)}`;
    coursePriceElement.className = 'text-gray-300 text-center mb-4';

    const paymentOptionsHeading = document.createElement('h3');
    paymentOptionsHeading.textContent = 'Payment Options';
    paymentOptionsHeading.className = 'text-xl font-bold neon-text mt-4 mb-2';

    const paymentOptions = document.createElement('div');
    paymentOptions.className = 'flex flex-col space-y-2';
    paymentOptions.innerHTML = `
        <button class="neon-button text-sm">Credit Card</button>
        <button class="neon-button text-sm" id="mobileBankingButton">Mobile Banking</button>
        <button class="neon-button text-sm">Other Payment Options</button>
    `;

    modalContent.appendChild(closeModalButton);
    modalContent.appendChild(courseNameHeading);
    modalContent.appendChild(coursePriceElement);
    modalContent.appendChild(paymentOptionsHeading);
    modalContent.appendChild(paymentOptions);

    paymentModal.appendChild(modalContent);
    document.body.appendChild(paymentModal);

    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            paymentModal.remove();
        }
    });

    document.getElementById('mobileBankingButton').addEventListener('click', () => {
        openMobileBankingModal(courseName, coursePrice);
        paymentModal.remove();
    });
}

function openMobileBankingModal(courseName, coursePrice) {
    const mobileBankingModal = document.createElement('div');
    mobileBankingModal.id = 'mobileBankingModal';
    mobileBankingModal.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center';

    const modalContent = document.createElement('div');
    modalContent.className = 'glassy-neon p-8 rounded-lg w-full max-w-md relative';

    const closeModalButton = document.createElement('button');
    closeModalButton.innerHTML = '<i class="fas fa-times"></i>';
    closeModalButton.className = 'absolute top-2 right-2 text-gray-500 hover:text-gray-300';
    closeModalButton.addEventListener('click', () => mobileBankingModal.remove());

    const courseNameHeading = document.createElement('h2');
    courseNameHeading.textContent = courseName;
    courseNameHeading.className = 'text-2xl font-bold neon-text text-center mb-4';

    const coursePriceElement = document.createElement('p');
    coursePriceElement.textContent = `Price: $${coursePrice.toFixed(2)}`;
    coursePriceElement.className = 'text-gray-300 text-center mb-4';

    const bankingAppsHeading = document.createElement('h3');
    bankingAppsHeading.textContent = 'Select Mobile Banking App';
    bankingAppsHeading.className = 'text-xl font-bold neon-text mt-4 mb-2 text-center';

    const bankingApps = document.createElement('div');
    bankingApps.className = 'grid grid-cols-2 gap-4';
    bankingApps.innerHTML = `
        <button class="mobile-banking-app" data-app="bkash"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/BKash_Logo.svg/2560px-BKash_Logo.svg.png" alt="bKash"></button>
        <button class="mobile-banking-app" data-app="nagad"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Nagad_Logo.svg/2560px-Nagad_Logo.svg.png" alt="Nagad"></button>
        <button class="mobile-banking-app" data-app="rocket"><img src="https://www.rocketbd.com/images/home/rocket.png" alt="Rocket"></button>
        <button class="mobile-banking-app" data-app="upay"><img src="https://www.upay.com.bd/wp-content/uploads/2021/04/upay_logo.png" alt="Upay"></button>
    `;

    const proceedButton = document.createElement('button');
    proceedButton.textContent = 'Proceed';
    proceedButton.className = 'neon-button text-sm block mx-auto mt-4';
    proceedButton.addEventListener('click', () => {
        const selectedApp = document.querySelector('.mobile-banking-app.selected');
        if (selectedApp) {
            alert(`Proceeding with payment using ${selectedApp.dataset.app}`);
            mobileBankingModal.remove();
        } else {
            alert('Please select a mobile banking app.');
        }
    });

    modalContent.appendChild(closeModalButton);
    modalContent.appendChild(courseNameHeading);
    modalContent.appendChild(coursePriceElement);
    modalContent.appendChild(bankingAppsHeading);
    modalContent.appendChild(bankingApps);
    modalContent.appendChild(proceedButton);

    mobileBankingModal.appendChild(modalContent);
    document.body.appendChild(mobileBankingModal);

    mobileBankingModal.addEventListener('click', (e) => {
        if (e.target === mobileBankingModal) {
            mobileBankingModal.remove();
        }
    });

    const appButtons = document.querySelectorAll('.mobile-banking-app');
    appButtons.forEach(button => {
        button.addEventListener('click', () => {
            appButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
}

// Checkout functionality
function openCheckoutModal() {
    const checkoutModal = document.createElement('div');
    checkoutModal.id = 'checkoutModal';
    checkoutModal.className = 'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center';

    const modalContent = document.createElement('div');
    modalContent.className = 'glassy-neon p-8 rounded-lg w-full max-w-md relative';

    const closeModalButton = document.createElement('button');
    closeModalButton.innerHTML = '<i class="fas fa-times"></i>';
    closeModalButton.className = 'absolute top-2 right-2 text-gray-500 hover:text-gray-300';
    closeModalButton.addEventListener('click', () => checkoutModal.remove());

    const cartListHeading = document.createElement('h2');
    cartListHeading.textContent = 'Checkout';
    cartListHeading.className = 'text-2xl font-bold neon-text text-center mb-4';

    const cartList = document.createElement('ul');
    cartList.id = 'checkoutCartList';

    let totalPrice = 0;
    cartItems.forEach(item => {
        const coursePrice = getCoursePrice(item.name);
        totalPrice += coursePrice;

        const listItem = document.createElement('li');
        listItem.className = 'text-gray-300 mb-2 flex items-center justify-between';
        listItem.innerHTML = `
            <span>${item.name}</span>
            <span>$${coursePrice.toFixed(2)}</span>
        `;
        cartList.appendChild(listItem);
    });

    const totalElement = document.createElement('div');
    totalElement.className = 'text-gray-300 mt-4 text-right';
    totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;

    const paymentOptionsHeading = document.createElement('h3');
    paymentOptionsHeading.textContent = 'Payment Options';
    paymentOptionsHeading.className = 'text-xl font-bold neon-text mt-4 mb-2';

    const paymentOptions = document.createElement('div');
    paymentOptions.className = 'flex flex-col space-y-2';
    paymentOptions.innerHTML = `
        <button class="neon-button text-sm">Credit Card</button>
        <button class="neon-button text-sm" id="checkoutMobileBankingButton">Mobile Banking</button>
        <button class="neon-button text-sm">Other Payment Options</button>
    `;

    modalContent.appendChild(closeModalButton);
    modalContent.appendChild(cartListHeading);
    modalContent.appendChild(cartList);
    modalContent.appendChild(totalElement);
    modalContent.appendChild(paymentOptionsHeading);
    modalContent.appendChild(paymentOptions);

    checkoutModal.appendChild(modalContent);
    document.body.appendChild(checkoutModal);

    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.remove();
        }
    });
}
const cartModalButton = document.querySelector('#cartModal .neon-button');
cartModalButton.addEventListener('click', openCheckoutModal);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkoutMobileBankingButton').addEventListener('click', () => {
        const courseName = cartItems.map(item => item.name).join(', ');
        let totalPrice = 0;
        cartItems.forEach(item => {
            const coursePrice = getCoursePrice(item.name);
            totalPrice += coursePrice;
        });
        openMobileBankingModal(courseName, totalPrice);
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.remove();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const menuLinks = document.getElementById('menu-links');

    if (mobileMenuButton) { 
        mobileMenuButton.addEventListener('click', () => {
            menuLinks.classList.toggle('mobile-menu-active');
            const icon = mobileMenuButton.querySelector('svg').querySelector('path');
            if (menuLinks.classList.contains('mobile-menu-active')) {
                icon.setAttribute('d', "M6 18L18 6M6 6l12 12"); 
            } else {
                icon.setAttribute('d', "M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2z"); 
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const loadMoreButton = document.getElementById('loadMoreButton');
    const courseContainer = document.getElementById('courseContainer');

    const courses = [
        {
            imgSrc: "https://images.unsplash.com/photo-1517245386804-267949c34175?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Course 7",
            price: "49.99",
            reviews: "4.5 (25 Reviews)",
            description: "Web Development Basics.",
            duration: "8 Weeks",
            progress: "75",
        },
        {
            imgSrc: "https://images.unsplash.com/photo-1519389950473-47a0277814d1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Course 8",
            price: "79.99",
            reviews: "4.8 (32 Reviews)",
            description: "Master the art of data science.",
            duration: "12 Weeks",
            progress: "90",
        },
        {
            imgSrc: "https://images.unsplash.com/photo-1581093455661-3e644b074b99?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Course 9",
            price: "59.99",
            reviews: "4.6 (18 Reviews)",
            description: "Unlock the potential of AI and ML.",
            duration: "10 Weeks",
            progress: "60",
        },
        {
            imgSrc: "https://plus.unsplash.com/premium_photo-1663011180254-4f97a9b66321?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
            alt: "Course 10",
            price: "69.99",
            reviews: "4.7 (22 Reviews)",
            description: "Enhance your business acumen.",
            duration: "11 Weeks",
            progress: "85",
        },
         {
            imgSrc: "https://images.unsplash.com/photo-1521737820321-3e644b074b99?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
            alt: "Course 11",
            price: "89.99",
            reviews: "4.9 (45 Reviews)",
            description: "Dive deep into advanced data analysis.",
            duration: "14 Weeks",
            progress: "70",
        },
        {
            imgSrc: "https://images.unsplash.com/photo-1516321318423-3e644b074b99?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Course 12",
            price: "99.99",
            reviews: "5.0 (50 Reviews)",
            description: "Become an expert in AI-driven solutions.",
            duration: "16 Weeks",
            progress: "80",
        },
        {
            imgSrc: "https://images.unsplash.com/photo-1517245386804-267949c34175?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Course 13",
            price: "49.99",
            reviews: "4.5 (25 Reviews)",
            description: "Web Development.",
            duration: "8 Weeks",
            progress: "75",
        },
        {
            imgSrc: "https://images.unsplash.com/photo-1519389950473-47a0277814d1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Course 14",
            price: "79.99",
            reviews: "4.8 (32 Reviews)",
            description: "Data science.",
            duration: "12 Weeks",
            progress: "90",
        },
        {
            imgSrc: "https://images.unsplash.com/photo-1581093455661-3e644b074b99?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Course 15",
            price: "59.99",
            reviews: "4.6 (18 Reviews)",
            description: "AI and ML.",
            duration: "10 Weeks",
            progress: "60",
        },
        {
            imgSrc: "https://plus.unsplash.com/premium_photo-1663011180254-4f97a9b66321?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
            alt: "Course 16",
            price: "69.99",
            reviews: "4.7 (22 Reviews)",
            description: "Business acumen.",
            duration: "11 Weeks",
            progress: "85",
        },
         {
            imgSrc: "https://images.unsplash.com/photo-1521737820321-3e644b074b99?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D",
            alt: "Course 17",
            price: "89.99",
            reviews: "4.9 (45 Reviews)",
            description: "Data analysis.",
            duration: "14 Weeks",
            progress: "70",
        },
        {
            imgSrc: "https://images.unsplash.com/photo-1516321318423-3e644b074b99?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Course 18",
            price: "99.99",
            reviews: "5.0 (50 Reviews)",
            description: "AI-driven solutions.",
            duration: "16 Weeks",
            progress: "80",
        },
    ];

    let coursesLoaded = 6;

    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            const coursesToAdd = courses.slice(coursesLoaded, coursesLoaded + 6);

            coursesToAdd.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = "course-card glassy-neon p-6 rounded-lg";
                courseCard.innerHTML = `
                    <img src="${course.imgSrc}"
                        alt="${course.alt}" class="rounded-md mb-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="neon-text">$${course.price}</span>
                        <div class="flex items-center">
                            <i class="fas fa-star text-yellow-400 mr-1"></i>
                            <span class="text-sm">${course.reviews}</span>
                        </div>
                    </div>
                    <p class="text-gray-300">${course.description}</p>
                    <div class="mt-4">
                        <div class="flex items-center justify-between">
                            <span>Duration: ${course.duration}</span>
                            <div class="w-1/2 bg-gray-700 rounded-full h-2">
                                <div class="bg-cyan-500 h-2 rounded-full" style="width: ${course.progress}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-around mt-4">
                        <button class="neon-button text-xs">Add to Cart</button>
                        <button class="neon-button text-xs">Buy Now</button>
                    </div>
                    <div class="flex justify-center mt-2">
                        <i class="far fa-star text-yellow-400 mr-1"></i>
                        <i class="far fa-star text-yellow-400 mr-1"></i>
                        <i class="far fa-star text-yellow-400 mr-1"></i>
                        <i class="far fa-star text-yellow-400 mr-1"></i>
                        <i class="far fa-star text-yellow-400"></i>
                    </div>
                `;
                courseContainer.appendChild(courseCard);
            });

            coursesLoaded += coursesToAdd.length;
            if (coursesLoaded >= courses.length) {
                loadMoreButton.style.display = 'none';
            }

            // Attach event listeners to newly added "Add to Cart" buttons
            const newAddToCartButtons = courseContainer.querySelectorAll('.course-card:nth-child(n+' + (coursesLoaded - coursesToAdd.length + 1) + ') .neon-button:nth-child(1)');
            newAddToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const courseCard = this.closest('.course-card');
                    const courseName = courseCard.querySelector('img').alt;
                    const courseFullName = courseCard.querySelector('.text-gray-300').textContent;
                    addToCart(courseName, courseFullName);
                });
            });

            // Attach event listeners to newly added "Buy Now" buttons
            const newBuyNowButtons = courseContainer.querySelectorAll('.course-card:nth-child(n+' + (coursesLoaded - coursesToAdd.length + 1) + ') .neon-button:nth-child(2)');
            newBuyNowButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const courseCard = this.closest('.course-card');
                    const courseFullName = courseCard.querySelector('.text-gray-300').textContent;
                    const coursePrice = getCoursePrice(courseFullName);
                    openBuyNowModal(courseFullName, coursePrice);
                });
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const loadMoreCategoriesButton = document.getElementById('loadMoreCategoriesButton');
    const categoryContainer = document.getElementById('categoryContainer');

    const categories = [
        {
            icon: "fas fa-flask fa-3x",
            title: "Science"
        },
        {
            icon: "fas fa-palette fa-3x",
            title: "Design"
        },
         {
            icon: "fas fa-music fa-3x",
            title: "Music"
        },
        {
            icon: "fas fa-camera fa-3x",
            title: "Photography"
        },
        {
            icon: "fas fa-graduation-cap fa-3x",
            title: "Education"
        },
        {
            icon: "fas fa-heart fa-3x",
            title: "Health & Fitness"
        },
         {
            icon: "fas fa-utensils fa-3x",
            title: "Cooking"
        },
        {
            icon: "fas fa-tree fa-3x",
            title: "Environmental Studies"
        },
    ];

    let categoriesLoaded = 4;

    if (loadMoreCategoriesButton) {
        loadMoreCategoriesButton.addEventListener('click', () => {
            const categoriesToAdd = categories.slice(categoriesLoaded, categoriesLoaded + 4);

            categoriesToAdd.forEach(category => {
                const categoryCard = document.createElement('div');
                categoryCard.className = "category-card glassy-neon p-6 rounded-lg text-center hover:scale-105 transition-transform";
                categoryCard.innerHTML = `
                    <i class="${category.icon} neon-text mb-4"></i>
                    <h3 class="text-xl font-semibold neon-text">${category.title}</h3>
                `;
                categoryContainer.appendChild(categoryCard);
            });

            categoriesLoaded += categoriesToAdd.length;
            if (categoriesLoaded >= categories.length) {
                loadMoreCategoriesButton.style.display = 'none';
            }
        });
    }
});

// Initialize cart count on page load
updateCartCount();
updateCartListInProfile();

function getCoursePrice(courseName) {
    switch (courseName) {
        case "Learn the basics of web development.": return 49.99;
        case "Master the art of data science.": return 79.99;
        case "Unlock the potential of AI and ML.": return 59.99;
        case "Enhance your business acumen.": return 69.99;
        case "Dive deep into advanced data analysis.": return 89.99;
        case "Become an expert in AI-driven solutions.": return 99.99;
        case "Learn the fundamentals of graphic design.": return 79.99;
        case "Explore the world of mobile app development.": return 69.99;
        case "Master the art of digital marketing.": return 89.99;
        default: return 0;
    }
}

// Star rating functionality
document.addEventListener('DOMContentLoaded', function() {
    const courseCards = document.querySelectorAll('.course-card');

    courseCards.forEach((card, index) => {
        const starContainer = card.querySelector('.flex.justify-center.mt-2');
        const stars = starContainer.querySelectorAll('i');
        const reviewSpan = card.querySelector('.text-sm');

        stars.forEach((star, i) => {
            star.addEventListener('click', () => {
                const rating = i + 1;
                updateRating(card, rating);
            });
        });
    });

    function updateRating(card, rating) {
        const starContainer = card.querySelector('.flex.justify-center.mt-2');
        const stars = starContainer.querySelectorAll('i');
        const reviewSpan = card.querySelector('.text-sm');

        stars.forEach((star, i) => {
            if (i < rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });

        // Update the displayed review text
        let reviewText = '';
        switch (rating) {
            case 1:
                reviewText = '1.0 (5 Reviews)';
                break;
            case 2:
                reviewText = '2.0 (10 Reviews)';
                break;
            case 3:
                reviewText = '3.0 (15 Reviews)';
                break;
            case 4:
                reviewText = '4.0 (20 Reviews)';
                break;
            case 5:
                reviewText = '5.0 (25 Reviews)';
                break;
            default:
                reviewText = '0.0 (0 Reviews)';
                break;
        }
        reviewSpan.textContent = reviewText;

        const ratingContainer = card.querySelector('.flex.items-center');
        ratingContainer.querySelector('.fas.fa-star').textContent = rating.toFixed(1);

    }
});