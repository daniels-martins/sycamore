class Slideshow {
  constructor() {
    this.slides = document.querySelectorAll('.slide');
    this.currentIndex = 0;
    this.interval = null;
    this.autoPlayDelay = 4000; // 4 seconds

    this.init();
  }

  init() {
    // Start autoplay
    this.startAutoPlay();
  }

  showSlide(index) {
    // Hide all slides
    this.slides.forEach(slide => slide.classList.remove('active'));

    // Show the selected slide
    this.slides[index].classList.add('active');

    this.currentIndex = index;
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(nextIndex);
  }

  startAutoPlay() {
    this.interval = setInterval(() => this.nextSlide(), this.autoPlayDelay);
  }
}

// Initialize the slideshow when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Slideshow();
});

// toggle between our mission and vision

const visionSection = document.getElementById('visionSection');
const missionSection = document.getElementById('missionSection');
const toMission = document.getElementById('toMission');
const toVision = document.getElementById('toVision');

let isAnimating = false;

function triggerBounce(section) {
  // Remove any existing animation classes
  const headings = section.querySelectorAll('h3, p');
  headings.forEach(el => {
    el.classList.remove('bounce-from-right', 'bounce-from-right-delay', 'bounce-from-left', 'bounce-from-left-delay');
  });

  // Force reflow to reset animation
  void section.offsetWidth;

  // Add appropriate animation classes based on section
  const h3 = section.querySelector('h3');
  const p = section.querySelector('p');

  if (section.id === 'missionSection') {
    h3.classList.add('bounce-from-left');
    p.classList.add('bounce-from-left-delay');
  } else {
    h3.classList.add('bounce-from-right');
    p.classList.add('bounce-from-right-delay');
  }
}

toMission.addEventListener('click', () => {
  if (isAnimating) return;
  isAnimating = true;

  visionSection.classList.replace('translate-x-0', '-translate-x-full');
  missionSection.classList.replace('translate-x-full', 'translate-x-0');

  setTimeout(() => {
    triggerBounce(missionSection);
    isAnimating = false;
  }, 700);
});

toVision.addEventListener('click', () => {
  if (isAnimating) return;
  isAnimating = true;

  missionSection.classList.replace('translate-x-0', 'translate-x-full');
  visionSection.classList.replace('-translate-x-full', 'translate-x-0');

  setTimeout(() => {
    triggerBounce(visionSection);
    isAnimating = false;
  }, 700);
});

// Initialize with animation on the visible section
document.addEventListener('DOMContentLoaded', () => {
  triggerBounce(visionSection);
});

// continuous scroll and tooltip on hover
document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.animate-scroll-loop');
  const template = document.querySelector('#scroll-items');

  if (container && template) {
    // Clear existing content
    container.innerHTML = '';

    // Add the original items
    const originalContent = template.content.cloneNode(true);
    container.appendChild(originalContent);

    // Add duplicate for seamless looping
    const duplicateContent = template.content.cloneNode(true);
    container.appendChild(duplicateContent);

    console.log('Scrolling items initialized with 10 items');
  }

  // Optional: Add intersection observer for better performance
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        } else {
          entry.target.style.animationPlayState = 'paused';
        }
      });
    }, { threshold: 0.1 });

    const scrollingElement = document.querySelector('.animate-scroll-loop');
    if (scrollingElement) {
      observer.observe(scrollingElement);
    }
  }
});

// Smooth scroll to top or #home
document.getElementById('backToTop').addEventListener('click', () => {
  const home = document.querySelector('#home');
  if (home) {
    home.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// navbar
document.addEventListener('DOMContentLoaded', function () {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');

  mobileMenuButton.addEventListener('click', function () {
    mobileMenu.classList.toggle('hidden');
  });

  // Active section highlighting
  const sections = document.querySelectorAll('[id]'); // Target all elements with IDs
  const desktopLinks = document.querySelectorAll('nav a[href^="#"]');
  const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');
  const allLinks = [...desktopLinks, ...mobileLinks];

  console.log('Found elements with IDs:', sections.length, Array.from(sections).map(s => s.id)); // Debug IDs
  console.log('Found links:', allLinks.length);

  function highlightActiveSection() {
    const scrollY = window.pageYOffset;
    const navHeight = 120; // Adjusted for py-6 (96px) + buffer

    // Default "Home" at top
    if (scrollY < navHeight) {
      allLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        }
      });
      return; // Exit early if at top
    }

    let activeSectionFound = false;
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionId = section.getAttribute('id');
      const sectionTop = section.offsetTop - navHeight;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        allLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
            activeSectionFound = true;
          }
        });
      }
    });


  }

  // Initial call with delay for layout
  setTimeout(highlightActiveSection, 100);
  window.addEventListener('scroll', highlightActiveSection);
  window.addEventListener('resize', highlightActiveSection);

});