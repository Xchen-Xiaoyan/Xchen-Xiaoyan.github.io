// Bilingual toggle: every text exists twice (.zh / .en); the <html data-lang> attribute picks one.
// Default follows the browser language; the choice is remembered across pages.
// Also: nav shadow on scroll, active-section highlight, and fade-in of elements marked .reveal.
(function () {
  var saved = localStorage.getItem("lang");
  var lang = saved || ((navigator.language || "").toLowerCase().indexOf("zh") === 0 ? "zh" : "en");
  apply(lang);

  function apply(l) {
    document.documentElement.setAttribute("data-lang", l);
    document.documentElement.setAttribute("lang", l === "zh" ? "zh-CN" : "en");
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-toggle-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-lang") === "zh" ? "en" : "zh";
        localStorage.setItem("lang", next);
        apply(next);
      });
    });
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();

    var nav = document.querySelector(".nav");
    var onScroll = function () { if (nav) nav.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    // Highlight the nav link of the section currently in view.
    var links = {};
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = links[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Object.values(links).forEach(function (x) { x.classList.remove("active"); });
          a.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  });
})();
