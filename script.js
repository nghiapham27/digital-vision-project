const body = document.querySelector('body');
const header = document.querySelector('.header');
const headerBg = document.querySelectorAll('.header-bg');
// nav selector
const nav = document.querySelector('.navigation');
const navList = document.querySelector('.navigation__list');
const navLinks = document.querySelectorAll('.navigation__item');
const themeBtn = document.querySelector('.theme-btn');
const navBtn = document.querySelector('.nav-btn');
const themeIcons = document.querySelectorAll('.theme-icon');
// header btn selector
const leftArrow = document.querySelector('.header__arrow--left');
const rightArrow = document.querySelector('.header__arrow--right');
const allDots = document.querySelectorAll('.header__dot');
// sections selector
const allSections = document.querySelectorAll('.section');
const contactSection = document.querySelector('.section-contact');
const footerLinks = document.querySelectorAll('.footer-link');
const allImg = document.querySelectorAll('img');
// overlay selector
const overlay = document.querySelector('.overlay');

// variables
const bgHeaderDuration = 4000;
const maxBg = headerBg.length;
let bgId = 0;
let intervalId;

// NAVIGATION BUTTON HANDLER
const toggleTheme = () => {
  body.classList.toggle('onDark');
  nav.classList.toggle('onDark');
  themeIcons.forEach((icon) => icon.classList.toggle('hidden'));
};
// SIDEBAR HANDLER
const showSideNav = () => {
  navList.classList.toggle('show-nav');
  overlay.classList.toggle('hidden');
};

// theme toggle
themeBtn.addEventListener('click', toggleTheme);
// side nav toggle
navBtn.addEventListener('click', showSideNav);
// close navbar when clicking outside of it
overlay.addEventListener('click', showSideNav);

// HEADER BACKGROUND HANDLER
// auto-change header background
const autoChangeBg = (count) => {
  intervalId = setInterval(() => {
    count++;
    if (count === headerBg.length) count = 0;
    moveToBg(count);
  }, bgHeaderDuration);
};

// set active  bg
const setActiveBg = (index) => {
  // set active dot
  allDots.forEach((dot) => dot.classList.remove('active-dot'));
  allDots[index].classList.add('active-dot');
  // set active bg
  headerBg[index].dataset.pos = 'active-bg';
};

// bg position handler
const moveToBg = (targetBgId) => {
  // clear the last interval bg
  clearInterval(intervalId);
  // assign data-pos attribute
  headerBg.forEach((bg) => {
    bg.dataset.pos = 'right-bg';
  });

  targetBgId - 1 < 0
    ? (headerBg[maxBg - 1].dataset.pos = 'left-bg')
    : (headerBg[targetBgId - 1].dataset.pos = 'left-bg');

  //set active bg
  setActiveBg(targetBgId);
  // set auto-change mode active again
  autoChangeBg(targetBgId);
};

// DOTS CLICK EVENTS
allDots.forEach((dot) => {
  dot.addEventListener('click', () => {
    moveToBg(dot.dataset.bg);
  });
});

// LEFT ARROW
leftArrow.addEventListener('click', () => {
  bgId++;
  if (bgId === maxBg) bgId = 0;
  moveToBg(bgId);
});

// RIGHT ARROW
rightArrow.addEventListener('click', () => {
  bgId--;
  if (bgId < 0) bgId = maxBg - 1;
  moveToBg(bgId);
});

// SMOOTH SCROLLING TO SECTIONS
const scrollHandler = (e) => {
  e.preventDefault();
  if (e.target.classList.contains('btn')) {
    const href = e.target.getAttribute('href');
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
};
// Nav Links
navLinks.forEach((link) => {
  link.addEventListener('click', scrollHandler);
});
// Footer Links
footerLinks.forEach((link) => {
  link.addEventListener('click', scrollHandler);
});
// Buttons in all sections
document.querySelectorAll('.section-info').forEach((section) => {
  section.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
      scrollHandler(e);
    }
  });
});

// STICK THE NAVIGATION BAR
const navHeight = nav.getBoundingClientRect().height; //nav's height
const stickyNav = function (entries) {
  const [entry] = entries;
  // Add sticky class when moving out header
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
//Create the observer
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
//Observe header
headerObserver.observe(header);

// REVEAL SECTION & DO TEXT ANIMATION WHEN SCROLLING INTO IT
const revealSection = (entries, observer) => {
  const [entry] = entries;
  // do nothing when moving out the section
  if (!entry.isIntersecting) return;
  // show the section
  entry.target.classList.remove('hidden');
  // animate the section header text
  entry.target.childNodes.forEach((node) => {
    if (!node.classList) return;
    if (node.classList.contains('section__desc'))
      node.classList.add('animated');
  });

  // then unobserve it
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.05,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
});

// Initialization
const initialization = () => {
  moveToBg(0); // set bg-0 active & auto-change bg mode at first
  allSections.forEach((section) => section.classList.add('hidden')); // hide all sections first
};
initialization();
