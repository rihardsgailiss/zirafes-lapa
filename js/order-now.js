(function () {
  var monthly = document.getElementById("billing-monthly");
  var annual = document.getElementById("billing-annual");
  var priceEl = document.getElementById("order-checkout-price");
  var stickyPriceEl = document.getElementById("order-sticky-checkout-price");
  var stickyBar = document.getElementById("order-sticky-pricing");
  var orderHero = document.querySelector(".order-hero");
  var packageCamera = document.getElementById("order-package-camera");
  var packageStudio = document.getElementById("order-package-studio");
  var stickyTitleEl = document.getElementById("order-sticky-package-title");

  if (!monthly || !annual || !priceEl) return;

  var annualDiscount = 0.3;
  var baseMonthlyByPackage = { camera: 360, studio: 50 };
  var stickyTitleByPackage = {
    camera: "Giraffe PRO Camera + Content Studio",
    studio: "Content Studio only",
  };

  function getSelectedPackage() {
    if (packageStudio && packageStudio.checked) return "studio";
    return "camera";
  }

  function getBaseMonthly() {
    return baseMonthlyByPackage[getSelectedPackage()];
  }

  function formatMonthlyPrice(amount) {
    return "$" + amount + " / month";
  }

  function formatAnnualYearTotal(baseMonthly) {
    var discountedMonthly = Math.round(baseMonthly * (1 - annualDiscount));
    return "$" + discountedMonthly * 12 + " / year";
  }

  function syncPackageBodyClass() {
    if (!document.body.classList.contains("page-order-now")) return;
    if (getSelectedPackage() === "studio") {
      document.body.classList.add("order-package--studio");
    } else {
      document.body.classList.remove("order-package--studio");
    }
  }

  function syncStickyTitle() {
    if (!stickyTitleEl) return;
    stickyTitleEl.textContent = stickyTitleByPackage[getSelectedPackage()];
  }

  function updatePrice() {
    var base = getBaseMonthly();
    var label = annual.checked
      ? formatAnnualYearTotal(base)
      : formatMonthlyPrice(base);
    priceEl.textContent = label;
    if (stickyPriceEl) stickyPriceEl.textContent = label;
  }

  monthly.addEventListener("change", updatePrice);
  annual.addEventListener("change", updatePrice);

  function onPackageChange() {
    syncPackageBodyClass();
    syncStickyTitle();
    updatePrice();
    if (stickyBar) {
      updateStickyPromisesLineFit();
    }
  }

  if (packageCamera && packageStudio) {
    packageCamera.addEventListener("change", onPackageChange);
    packageStudio.addEventListener("change", onPackageChange);
    syncPackageBodyClass();
    syncStickyTitle();
  }

  updatePrice();

  if (!stickyBar || !orderHero) return;

  var stickyCheckout = stickyBar.querySelector(".order-sticky-pricing__btn");
  var stickyCard = stickyBar.querySelector(".order-sticky-pricing__card");
  var promisesDesktopMq = window.matchMedia("(min-width: 900px)");
  var PROMISES_GAP_PX = 24;

  function updateStickyPromisesLineFit() {
    var ul = stickyBar.querySelector(".order-sticky-pricing__promises");
    var textEl = stickyBar.querySelector(".order-sticky-pricing__text");
    if (!ul || !textEl) return;

    ul.classList.remove("order-sticky-pricing__promises--line-fit-hidden");

    window.requestAnimationFrame(function () {
      if (!promisesDesktopMq.matches) return;

      var all = ul.querySelectorAll(".order-sticky-pricing__promise");
      var visible = [];
      for (var i = 0; i < all.length; i++) {
        if (all[i].offsetParent !== null) visible.push(all[i]);
      }
      if (!visible.length) return;

      var sum = 0;
      for (var j = 0; j < visible.length; j++) {
        sum += visible[j].getBoundingClientRect().width;
      }
      sum += PROMISES_GAP_PX * Math.max(0, visible.length - 1);

      var available = textEl.clientWidth;
      if (sum > available - 1) {
        ul.classList.add("order-sticky-pricing__promises--line-fit-hidden");
      }
    });
  }

  function syncStickyVisibility() {
    var pastFold = orderHero.getBoundingClientRect().bottom <= 0;
    if (pastFold) {
      stickyBar.setAttribute("aria-hidden", "false");
      stickyBar.classList.add("order-sticky-pricing--visible");
      if (stickyCheckout) stickyCheckout.removeAttribute("tabindex");
      updateStickyPromisesLineFit();
    } else {
      stickyBar.classList.remove("order-sticky-pricing--visible");
      stickyBar.setAttribute("aria-hidden", "true");
      if (stickyCheckout) stickyCheckout.setAttribute("tabindex", "-1");
    }
  }

  window.addEventListener("scroll", syncStickyVisibility, { passive: true });
  window.addEventListener("resize", syncStickyVisibility, { passive: true });
  syncStickyVisibility();

  window.addEventListener("resize", updateStickyPromisesLineFit, { passive: true });
  if (typeof promisesDesktopMq.addEventListener === "function") {
    promisesDesktopMq.addEventListener("change", updateStickyPromisesLineFit);
  } else if (typeof promisesDesktopMq.addListener === "function") {
    promisesDesktopMq.addListener(updateStickyPromisesLineFit);
  }

  if (stickyCard && typeof ResizeObserver !== "undefined") {
    var ro = new ResizeObserver(function () {
      updateStickyPromisesLineFit();
    });
    ro.observe(stickyCard);
  }
})();
