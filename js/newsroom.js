(function () {
  var root = document.querySelector("[data-newsroom]");
  if (!root) return;

  var buttons = root.querySelectorAll("[data-news-filter]");
  var cards = root.querySelectorAll("[data-news-category]");

  function setActive(filter) {
    buttons.forEach(function (btn) {
      var isOn = btn.getAttribute("data-news-filter") === filter;
      btn.setAttribute("aria-pressed", isOn ? "true" : "false");
    });
    cards.forEach(function (card) {
      var cat = card.getAttribute("data-news-category");
      var show = filter === "all" || cat === filter;
      card.hidden = !show;
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-news-filter");
      if (filter) setActive(filter);
    });
  });
})();
