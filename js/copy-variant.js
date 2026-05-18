(function () {
  var STORAGE = "giraffe360_locale_prefs";
  var VCODE = "vincent-v1";

  var originalsText = Object.create(null);
  var originalsHref = Object.create(null);
  var snapped = false;

  function getLang() {
    try {
      var raw = localStorage.getItem(STORAGE);
      if (raw) {
        var p = JSON.parse(raw);
        if (p && typeof p.lang === "string") return p.lang;
      }
    } catch (e) {}
    return "en";
  }

  function snapshot() {
    if (snapped) return;
    snapped = true;
    Array.prototype.forEach.call(document.querySelectorAll("[data-copy-id]"), function (el) {
      var id = el.getAttribute("data-copy-id");
      if (!id || originalsText[id] !== undefined) return;
      originalsText[id] = el.textContent;
      if (el.tagName === "A" && el.hasAttribute("href")) {
        originalsHref[id] = el.getAttribute("href");
      }
    });
  }

  function setVariantAttr(lang) {
    if (lang === VCODE) {
      document.documentElement.setAttribute("data-copy-variant", VCODE);
    } else {
      document.documentElement.removeAttribute("data-copy-variant");
    }
  }

  function applyEntry(el, id, entry) {
    var text;
    var href;
    if (entry != null && typeof entry === "object" && !Array.isArray(entry)) {
      text = entry.text;
      href = entry.href;
    } else {
      text = entry;
    }
    if (text != null) el.textContent = text;
    if (href != null && el.tagName === "A") el.setAttribute("href", href);
  }

  function apply() {
    snapshot();
    var lang = getLang();
    var dict = window.GIRAFFE360_VINCENT_COPY || {};
    setVariantAttr(lang);

    Array.prototype.forEach.call(document.querySelectorAll("[data-copy-id]"), function (el) {
      var id = el.getAttribute("data-copy-id");
      if (!id) return;
      if (lang === VCODE) {
        if (Object.prototype.hasOwnProperty.call(dict, id)) {
          applyEntry(el, id, dict[id]);
        }
      } else {
        if (Object.prototype.hasOwnProperty.call(originalsText, id)) {
          el.textContent = originalsText[id];
        }
        if (el.tagName === "A" && Object.prototype.hasOwnProperty.call(originalsHref, id)) {
          el.setAttribute("href", originalsHref[id]);
        }
      }
    });
  }

  function onLocale() {
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }

  window.addEventListener("giraffe360:locale", onLocale);
})();
