/* Restauracja — main.js
   1) stan nagłówka po przewinięciu
   2) menu mobilne (hamburger + overlay)
*/
(function () {
  "use strict";

  /* ---------- 1. Nagłówek ---------- */
  var header = document.querySelector("[data-header]");
  var scrolled = false;

  function onScroll() {
    var past = window.scrollY > 40;
    if (past !== scrolled) {
      scrolled = past;
      header.classList.toggle("is-scrolled", past);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 2. Menu mobilne ---------- */
  var burger = document.querySelector("[data-burger]");
  var menu = document.querySelector("[data-mobile-menu]");
  var closeTimer = null;

  function openMenu() {
    clearTimeout(closeTimer);
    menu.hidden = false;
    void menu.offsetWidth;                 // reflow, by animacja zadziałała
    document.body.classList.add("menu-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Zamknij menu");
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Otwórz menu");
    closeTimer = setTimeout(function () { menu.hidden = true; }, 420);
  }

  function toggleMenu() {
    if (document.body.classList.contains("menu-open")) closeMenu();
    else openMenu();
  }

  if (burger && menu) {
    burger.addEventListener("click", toggleMenu);

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) closeMenu();
    });

    // zamknij, gdy wracamy na desktop
    window.matchMedia("(min-width: 1081px)").addEventListener("change", function (ev) {
      if (ev.matches && document.body.classList.contains("menu-open")) closeMenu();
    });
  }

  /* ---------- rok w stopce ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 3. Slider opinii ---------- */
  var qSlider = document.querySelector("[data-quote-slider]");
  if (qSlider) {
    var quotes = Array.prototype.slice.call(qSlider.querySelectorAll(".quote"));
    var qPrev = qSlider.querySelector("[data-quote-prev]");
    var qNext = qSlider.querySelector("[data-quote-next]");
    var qIndex = 0;
    var qTimer = null;

    function showQuote(i) {
      qIndex = (i + quotes.length) % quotes.length;
      quotes.forEach(function (q, n) { q.classList.toggle("is-active", n === qIndex); });
    }
    function nextQuote() { showQuote(qIndex + 1); }
    function startAuto() {
      stopAuto();
      if (quotes.length > 1) qTimer = setInterval(nextQuote, 7000);
    }
    function stopAuto() { if (qTimer) { clearInterval(qTimer); qTimer = null; } }

    if (quotes.length > 1) {
      qPrev.addEventListener("click", function () { showQuote(qIndex - 1); startAuto(); });
      qNext.addEventListener("click", function () { showQuote(qIndex + 1); startAuto(); });
      qSlider.addEventListener("mouseenter", stopAuto);
      qSlider.addEventListener("mouseleave", startAuto);
      startAuto();
    } else if (qPrev && qNext) {
      qPrev.hidden = true;
      qNext.hidden = true;
    }
  }

  /* ---------- 4. Odsłanianie sekcji przy scrollu ---------- */
  var revealables = document.querySelectorAll("[data-reveal]");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    revealables.forEach(function (el) { io.observe(el); });
  }
})();
