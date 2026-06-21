(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  var navLinks = document.querySelectorAll('[data-nav-link]');
  var sections = document.querySelectorAll("section[id]");

  /* Sticky header border on scroll */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  function closeMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-label", "메뉴 열기");
  }

  function openMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "true");
    mobileNav.classList.add("is-open");
    navToggle.setAttribute("aria-label", "메뉴 닫기");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  /* Smooth scroll + close mobile nav */
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;

      var target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      closeMobileNav();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      if (history.pushState) {
        history.pushState(null, "", href);
      }
    });
  });

  /* Active nav link on scroll */
  var observerOptions = {
    root: null,
    rootMargin: "-40% 0px -55% 0px",
    threshold: 0,
  };

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          var isActive = link.getAttribute("href") === "#" + id;
          link.classList.toggle("is-active", isActive);
        });
      });
    }, observerOptions);

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* Close mobile nav on resize to desktop */
  window.addEventListener(
    "resize",
    function () {
      if (window.innerWidth >= 768) {
        closeMobileNav();
      }
    },
    { passive: true }
  );

  /* Escape closes mobile nav */
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });
})();
