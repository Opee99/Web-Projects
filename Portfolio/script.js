document.addEventListener('DOMContentLoaded', function () {
  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Original navigation functionality
  const hamburger = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking links or outside
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  // Enhanced smooth scrolling with easing
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      const navHeight = document.querySelector('nav').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: targetPosition - navHeight,
        behavior: 'smooth'
      });
    });
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
  });

  // Enhanced intersection observer for animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Add random rotation on entrance
        const rotation = Math.random() * 10 - 5;
        entry.target.style.transform = `rotate(${rotation}deg)`;

        // Reset rotation after animation
        setTimeout(() => {
          entry.target.style.transform = 'rotate(0deg)';
        }, 500);

        // Animate progress bars with randomized delays
        if (entry.target.classList.contains('skill-item')) {
          entry.target.querySelectorAll('.progress-bar').forEach((bar, index) => {
            setTimeout(() => {
              bar.style.width = bar.getAttribute('data-progress') + '%';
            }, index * 200);
          });
        }

        // Animate numbers when visible
        if (entry.target.classList.contains('animate-number')) {
          animateNumber(entry.target);
        }
      }
    });
  }, observerOptions);

  // Animate sections with alternating directions
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    if (section.id === 'home') return;

    const direction = index % 2 === 0 ? 'left' : 'right';
    section.classList.add(`slide-in-${direction}`);

    // Add stagger effect to grid items
    const gridItems = section.querySelectorAll('.skill-item, .project-card, .education-card, .course-card');
    gridItems.forEach((item, i) => {
      item.classList.add(`slide-in-${direction}`, `delay-${(i % 4) + 1}`);
      animateOnScroll.observe(item);
    });

    animateOnScroll.observe(section);
  });

  // Number animation function
  function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Modified skill item hover behavior with reduced movement
  document.querySelectorAll('.skill-item').forEach(item => {
    window.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width - 0.5) * 8;
      const yPercent = (y / rect.height - 0.5) * 8;

      item.style.transform = `perspective(1000px) rotateX(${yPercent}deg) rotateY(${xPercent}deg)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // Reduced movement for skill tags
  document.querySelectorAll('.skill-tags span').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'translateY(-3px) rotate(2deg)';
    });

    tag.addEventListener('mouseleave', () => {
      tag.style.transform = 'translateY(0) rotate(0)';
    });
  });

  // Reduced floating animation intensity for skill tags
  document.querySelectorAll('.skill-tags span').forEach((tag, index) => {
    tag.style.animation = `float ${1.5 + Math.random() * 0.5}s ease-in-out infinite`;
    tag.style.animationDelay = `${index * 0.1}s`;
  });

  // Enhanced form handling with validation and animation
  const form = document.querySelector('.contact-form');
  const inputs = form.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });

    // Real-time validation
    input.addEventListener('input', validateInput);
  });

  function validateInput(e) {
    const input = e.target;
    const value = input.value;
    const type = input.type;
    let isValid = true;

    switch (type) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case 'text':
        isValid = value.length >= 2;
        break;
      case 'textarea':
        isValid = value.length >= 10;
        break;
    }

    if (isValid) {
      input.classList.remove('invalid');
      input.classList.add('valid');
    } else {
      input.classList.remove('valid');
      input.classList.add('invalid');
    }
  }

  // Contact Form Enhancements
  const contactForm = document.querySelector('.contact-form');
  const formGroups = document.querySelectorAll('.form-group');

  // Add floating label and icon functionality
  formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');

    if (input && label) {
      // Add icons based on input type
      const icon = document.createElement('i');
      icon.className = `input-icon fas fa-${input.type === 'email' ? 'envelope' :
        input.type === 'text' ? 'user' :
          'comment'
        }`;
      group.appendChild(icon);

      // Handle input state
      input.addEventListener('input', () => {
        if (input.value) {
          label.classList.add('active');
        } else {
          label.classList.remove('active');
        }
      });
    }
  });

  // Animate form on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(contactForm);

  // Form submission handling
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const button = contactForm.querySelector('button');
    const formData = new FormData(contactForm);

    // Animate button during submission
    button.classList.add('loading');
    button.disabled = true;

    try {
      const response = await fetch('contact.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        showMessage('Message sent successfully!', 'success');
        contactForm.reset();
        formGroups.forEach(group => {
          group.querySelector('label')?.classList.remove('active');
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      showMessage('Failed to send message. Please try again.', 'error');
    } finally {
      button.classList.remove('loading');
      button.disabled = false;
    }
  });

  function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `${type}-message`;
    message.textContent = text;

    document.body.appendChild(message);

    // Trigger reflow for animation
    message.offsetHeight;

    message.classList.add('show');

    setTimeout(() => {
      message.classList.remove('show');
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }

  // Add ripple effect to submit button
  const submitButton = contactForm.querySelector('button');
  submitButton.addEventListener('click', function (e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });

  // Submit form with animation
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all inputs
    let isValid = true;
    inputs.forEach(input => {
      if (!input.classList.contains('valid')) {
        isValid = false;
      }
    });

    if (!isValid) {
      showMessage('Please fill all fields correctly', 'error');
      return;
    }

    // Animate submit button
    const button = form.querySelector('button');
    button.classList.add('loading');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      showMessage('Message sent successfully!', 'success');
      form.reset();
      inputs.forEach(input => {
        input.parentElement.classList.remove('focused');
        input.classList.remove('valid');
      });
    } catch (error) {
      showMessage('Failed to send message. Please try again.', 'error');
    } finally {
      button.classList.remove('loading');
    }
  });

  // Add particle system to all sections
  sections.forEach(section => {
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    section.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    function resizeCanvas() {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = [
          'rgba(52, 152, 219, 0.5)',
          'rgba(231, 76, 60, 0.5)',
          'rgba(46, 204, 113, 0.5)',
          'rgba(155, 89, 182, 0.5)'
        ][Math.floor(Math.random() * 4)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function initParticles() {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    // Handle resize
    window.addEventListener('resize', resizeCanvas);

    // Initial setup
    resizeCanvas();
    initParticles();
    animateParticles();
  });

  // Role text rotation
  const roles = document.querySelectorAll('.role-text');
  let currentRole = 0;

  function rotateRoles() {
    roles.forEach(role => {
      role.classList.remove('current');
      role.style.transform = 'translateY(100%) scale(0.9)';
      role.style.opacity = '0';
    });

    setTimeout(() => {
      roles[currentRole].classList.add('current');
      roles[currentRole].style.transform = 'translateY(0) scale(1)';
      roles[currentRole].style.opacity = '1';
      currentRole = (currentRole + 1) % roles.length;
    }, 500); // Match transition duration
  }

  setInterval(rotateRoles, 3000);

  // Typing effect
  const text = "Mubtasim Fuad Opee";
  const typingText = document.querySelector('.typing-text');
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      typingText.textContent = text.substring(0, i + 1);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      setTimeout(() => {
        i = 0;
        typeWriter();
      }, 5000);
    }
  }

  typeWriter();

  // Smooth scroll for CTA buttons
  document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      const navHeight = document.querySelector('nav').offsetHeight;

      window.scrollTo({
        top: targetSection.offsetTop - navHeight,
        behavior: 'smooth'
      });
    });
  });

  // Parallax effect for hero background
  document.addEventListener('mousemove', function (e) {
    const hero = document.querySelector('.hero-bg');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    hero.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
  });


  document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const scriptURL = "https://docs.google.com/forms/d/e/1FAIpQLSfqzpfEfoPsz1syll5lqKcDjTOoCI-RgOVIinP9Pb_2Ci27cw/formResponse";

    const userName = document.getElementById("name").value;
    const userEmail = document.getElementById("email").value;
    const userMessage = document.getElementById("message").value;
    const popupMessage = document.getElementById("popupMessage");

    const formData = new FormData();
    formData.append("entry.1951388164", userName);
    formData.append("entry.825770403", userEmail);
    formData.append("entry.1020935326", userMessage);

    fetch(scriptURL, { method: "POST", body: formData, mode: "no-cors" })
      .then(() => {
        showPopup(`✅ Thank you, ${userName}! Message sent successfully.`, "success");
        document.getElementById("contactForm").reset(); // Reset form fields
      })
      .catch(() => {
        showPopup("❌ Oops! Something went wrong. Please try again.", "error");
      });

    function showPopup(message, type) {
      popupMessage.innerHTML = message;
      popupMessage.className = `popup ${type} show`;

      // Hide the message after 2 seconds
      setTimeout(() => {
        popupMessage.className = "popup hidden";
      }, 2000);
    }
  });

});