'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');

const section1 = document.querySelector('#section--1');

const navLinks = document.querySelector('.nav__links');

const tabBtns = document.querySelector('.operations__tab-container');

const operationsEl = document.querySelector('.operations');

const nav = document.querySelector('.nav');

const menuBtn = document.querySelector('.nav__toggle');

const header = document.querySelector('header');

const allSections = document.querySelectorAll('.section');

const imgTargets = document.querySelectorAll('img[data-src]');

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
let currentSlide = 0;
const maxSlide = slides.length;

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////
//smooth scrolling

btnScrollTo.addEventListener('click', function (e) {
  // const secRect = section1.getBoundingClientRect();

  // window.scrollTo({
  //   left: secRect.left + window.screenX,
  //   top: secRect.top + window.scrollY,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  const id = e.target.getAttribute('href');
  if (e.target.classList.contains('nav__link')) {
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////
//tabbing component

tabBtns.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  const tabNum = clicked.getAttribute('data-tab');

  const targetContent = operationsEl.querySelector(
    `.operations__content--${tabNum}`
  );

  //remove active classes
  [...e.currentTarget.children].forEach(el =>
    el.classList.remove('operations__tab--active')
  );

  [...operationsEl.querySelectorAll('.operations__content')].forEach(el =>
    el.classList.remove('operations__content--active')
  );
  //active tab

  clicked.classList.add('operations__tab--active');

  //active content

  targetContent.classList.add('operations__content--active');
});

// menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;

  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//navigation
menuBtn.addEventListener('click', function (e) {
  e.preventDefault();

  menuBtn.classList.toggle('nav__toggle--active');
  navLinks.classList.toggle('nav--open');
});

//revealing sections while scrolling
const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// lazy loading images

const loadingImgs = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadingImgs, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

//slider
const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
  });
};

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);

  activateDots(currentSlide);
};
const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
};

const init = function () {
  goToSlide(currentSlide);
  createDots();
  activateDots(0);
};

init();

btnLeft.addEventListener('click', prevSlide);
btnRight.addEventListener('click', nextSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    currentSlide = +e.target.dataset.slide;

    goToSlide(currentSlide);
    activateDots(currentSlide);
  }
});
