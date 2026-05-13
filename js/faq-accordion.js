(function () {
  var root = document.querySelector("[data-faq-accordion]");
  if (!root) return;

  var items = Array.prototype.slice.call(root.querySelectorAll(".faq__item"));

  function setOpen(item, open) {
    var btn = item.querySelector(".faq__toggle");
    var panel = item.querySelector(".faq__panel");
    var plus = item.querySelector(".faq__toggle-icon--plus");
    var minus = item.querySelector(".faq__toggle-icon--minus");
    if (!btn || !panel) return;

    btn.setAttribute("aria-expanded", open ? "true" : "false");
    panel.hidden = !open;
    if (plus) plus.hidden = open;
    if (minus) minus.hidden = !open;
  }

  function closeOthers(except) {
    items.forEach(function (item) {
      if (item !== except) setOpen(item, false);
    });
  }

  items.forEach(function (item) {
    var btn = item.querySelector(".faq__toggle");
    if (!btn) return;

    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      if (expanded) {
        setOpen(item, false);
      } else {
        closeOthers(item);
        setOpen(item, true);
      }
    });
  });
})();
