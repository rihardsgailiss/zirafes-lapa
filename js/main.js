(function () {
  var btn = document.querySelector(".site-header__menu-btn");
  var nav = document.getElementById("site-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("site-header__drawer--open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
})();

(function () {
  var item = document.querySelector(".site-header__item--product");
  if (!item) return;

  var closeTimer;
  var mq = window.matchMedia("(min-width: 797px)");
  var CLOSE_DELAY_MS = 220;

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function onEnter() {
    clearCloseTimer();
    item.classList.add("is-mega-hover");
  }

  function onLeave() {
    clearCloseTimer();
    closeTimer = setTimeout(function () {
      item.classList.remove("is-mega-hover");
      closeTimer = null;
    }, CLOSE_DELAY_MS);
  }

  function bindMegaHoverHold() {
    item.addEventListener("mouseenter", onEnter);
    item.addEventListener("mouseleave", onLeave);
  }

  function unbindMegaHoverHold() {
    item.removeEventListener("mouseenter", onEnter);
    item.removeEventListener("mouseleave", onLeave);
    clearCloseTimer();
    item.classList.remove("is-mega-hover");
  }

  function syncMegaHoverHold() {
    unbindMegaHoverHold();
    if (mq.matches) {
      bindMegaHoverHold();
    }
  }

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", syncMegaHoverHold);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(syncMegaHoverHold);
  }

  syncMegaHoverHold();
})();
