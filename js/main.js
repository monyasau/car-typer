/* CarTyper landing page — the only JS on the page.
   Kept intentionally tiny: link wiring, mobile menu, scroll reveals, year. */
(function () {
  "use strict";

  var CFG = window.CARTYPER_SITE || {};

  /* ---------- Wire up links from the deploy config ---------- */
  var play = CFG.playUrl || "play/";
  document.querySelectorAll("[data-play]").forEach(function (el) {
    el.href = play;
  });

  var installer = document.getElementById("installer-link");
  if (installer && CFG.installerUrl) installer.href = CFG.installerUrl;
  var ver = document.querySelector("[data-ver]");
  if (ver && CFG.version) ver.textContent = CFG.version;
  var size = document.querySelector("[data-size]");
  if (size && CFG.installerSize) size.textContent = CFG.installerSize;

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");
  var burger = document.getElementById("icon-burger");
  var close = document.getElementById("icon-close");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("hidden") === false;
      toggle.setAttribute("aria-expanded", String(open));
      burger.classList.toggle("hidden", open);
      close.classList.toggle("hidden", !open);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
        burger.classList.remove("hidden");
        close.classList.add("hidden");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
