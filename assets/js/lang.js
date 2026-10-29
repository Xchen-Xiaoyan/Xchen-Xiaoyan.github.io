// Bilingual toggle: every text exists twice (.zh / .en); the <html data-lang> attribute picks one.
// Default follows the browser language; the choice is remembered across pages.
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
  });
})();
