(function () {
  var STORAGE_PREFS = "giraffe360_locale_prefs";
  /** Same tab: no repeat 4s auto-open when moving to another page without a full reload. Cleared on refresh so the intro can run again. */
  var SESSION_SITE_INTRO = "giraffe360_locale_site_intro_shown";

  var LANGS = [
    { code: "en", label: "English" },
    { code: "de", label: "German" },
    { code: "lv", label: "Latvian" },
  ];

  var DEFAULT_COUNTRY = "Latvia";
  var DEFAULT_LANG = "en";
  var AUTO_OPEN_MS = 4000;
  var SEARCH_RESET_MS = 900;

  var countries = window.WORLD_COUNTRIES && window.WORLD_COUNTRIES.length ? window.WORLD_COUNTRIES.slice() : [DEFAULT_COUNTRY];

  var root = document.getElementById("locale-picker");
  var footerTrigger = document.getElementById("footer-locale-trigger");
  var footerCountry = document.getElementById("footer-locale-country");
  var footerLang = document.getElementById("footer-locale-lang");
  var countryBtn = document.getElementById("locale-picker-country-btn");
  var countryValue = document.getElementById("locale-picker-country-value");
  var countryList = document.getElementById("locale-picker-country-list");
  var langBtn = document.getElementById("locale-picker-lang-btn");
  var langValue = document.getElementById("locale-picker-lang-value");
  var langList = document.getElementById("locale-picker-lang-list");
  var confirmBtn = document.getElementById("locale-picker-confirm");

  if (!root || !footerTrigger || !countryBtn || !countryList || !langBtn || !langList || !confirmBtn) return;

  function hasSiteIntroBeenHandled() {
    try {
      return sessionStorage.getItem(SESSION_SITE_INTRO) === "1";
    } catch (e) {
      return false;
    }
  }

  function markSiteIntroHandled() {
    try {
      sessionStorage.setItem(SESSION_SITE_INTRO, "1");
    } catch (e) {}
  }

  function clearSiteIntroIfReload() {
    try {
      var entries = performance.getEntriesByType && performance.getEntriesByType("navigation");
      if (entries && entries.length && entries[0].type === "reload") {
        sessionStorage.removeItem(SESSION_SITE_INTRO);
        return;
      }
    } catch (e) {}
    try {
      if (typeof performance.navigation !== "undefined" && performance.navigation.type === 1) {
        sessionStorage.removeItem(SESSION_SITE_INTRO);
      }
    } catch (e2) {}
  }

  var draftCountry = DEFAULT_COUNTRY;
  var draftLang = DEFAULT_LANG;
  var countryOpen = false;
  var langOpen = false;
  var countryFiltered = countries;
  var countryActive = 0;
  var countrySearchBuf = "";
  var countrySearchTimer = null;
  var resizeBound = false;

  function syncDropdownPlacement(listbox, anchorBtn) {
    if (!listbox || listbox.hidden || !anchorBtn) return;
    listbox.style.maxHeight = "";
    var r = anchorBtn.getBoundingClientRect();
    var margin = 8;
    var gap = 4;
    var spaceBelow = window.innerHeight - r.bottom - margin;
    var spaceAbove = r.top - margin;
    var h = listbox.offsetHeight;
    var fitsBelow = spaceBelow >= h;
    var fitsAbove = spaceAbove >= h;
    var openAbove =
      (fitsAbove && !fitsBelow) || (!fitsBelow && !fitsAbove && spaceAbove > spaceBelow);
    listbox.classList.toggle("locale-picker__listbox--above", openAbove);
    if (openAbove) {
      var cap = Math.max(96, spaceAbove - gap);
      listbox.style.maxHeight = cap + "px";
    } else if (spaceBelow < h) {
      listbox.style.maxHeight = Math.max(96, spaceBelow - gap) + "px";
    }
  }

  function scheduleDropdownPlacement(listbox, anchorBtn) {
    requestAnimationFrame(function () {
      syncDropdownPlacement(listbox, anchorBtn);
    });
  }

  function onDropdownResize() {
    if (countryOpen) syncDropdownPlacement(countryList, countryBtn);
    if (langOpen) syncDropdownPlacement(langList, langBtn);
  }

  function bindDropdownResize() {
    if (resizeBound) return;
    window.addEventListener("resize", onDropdownResize);
    resizeBound = true;
  }

  function unbindDropdownResize() {
    if (countryOpen || langOpen) return;
    if (!resizeBound) return;
    window.removeEventListener("resize", onDropdownResize);
    resizeBound = false;
  }

  function loadPrefs() {
    try {
      var raw = localStorage.getItem(STORAGE_PREFS);
      if (raw) {
        var p = JSON.parse(raw);
        if (p && typeof p.country === "string" && typeof p.lang === "string") return p;
      }
    } catch (e) {}
    return { country: DEFAULT_COUNTRY, lang: DEFAULT_LANG };
  }

  function savePrefs(p) {
    try {
      localStorage.setItem(STORAGE_PREFS, JSON.stringify(p));
    } catch (e) {}
  }

  function langLabel(code) {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === code) return LANGS[i].label;
    }
    return LANGS[0].label;
  }

  function normalizeCountry(name) {
    if (!name) return DEFAULT_COUNTRY;
    for (var i = 0; i < countries.length; i++) {
      if (countries[i] === name) return name;
    }
    return DEFAULT_COUNTRY;
  }

  function normalizeLang(code) {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === code) return code;
    }
    return DEFAULT_LANG;
  }

  function applyPrefsToFooter(p) {
    footerCountry.textContent = p.country;
    footerLang.textContent = langLabel(p.lang);
  }

  function syncDraftFromPrefs() {
    var p = loadPrefs();
    draftCountry = normalizeCountry(p.country);
    draftLang = normalizeLang(p.lang);
    countryValue.textContent = draftCountry;
    langValue.textContent = langLabel(draftLang);
  }

  function filterCountries(buf) {
    var b = (buf || "").toLowerCase();
    if (!b) return countries.slice();
    var pref = [];
    var rest = [];
    for (var i = 0; i < countries.length; i++) {
      var n = countries[i];
      var lc = n.toLowerCase();
      if (lc.indexOf(b) === 0) pref.push(n);
      else if (lc.indexOf(b) !== -1) rest.push(n);
    }
    return pref.concat(rest);
  }

  function bumpCountrySearchTimer() {
    if (countrySearchTimer) clearTimeout(countrySearchTimer);
    countrySearchTimer = setTimeout(function () {
      countrySearchBuf = "";
      countrySearchTimer = null;
      if (countryOpen) {
        countryFiltered = filterCountries("");
        var ix = countryFiltered.indexOf(draftCountry);
        countryActive = ix >= 0 ? ix : 0;
        paintCountryOptions();
      }
    }, SEARCH_RESET_MS);
  }

  function scrollOptionToCenter(container, child) {
    if (!container || !child) return;
    var elTop = child.offsetTop;
    var elH = child.offsetHeight;
    var viewH = container.clientHeight;
    var target = elTop - viewH / 2 + elH / 2;
    container.scrollTop = Math.max(0, Math.min(target, container.scrollHeight - viewH));
  }

  function paintCountryOptions() {
    countryList.innerHTML = "";
    var frag = document.createDocumentFragment();
    for (var i = 0; i < countryFiltered.length; i++) {
      (function (name, idx) {
        var opt = document.createElement("div");
        opt.className = "locale-picker__option" + (idx === countryActive ? " locale-picker__option--active" : "");
        opt.setAttribute("role", "option");
        opt.id = "locale-co-" + idx;
        opt.setAttribute("aria-selected", idx === countryActive ? "true" : "false");
        opt.textContent = name;
        opt.addEventListener("mousedown", function (e) {
          e.preventDefault();
        });
        opt.addEventListener("click", function () {
          selectCountry(name);
        });
        frag.appendChild(opt);
      })(countryFiltered[i], i);
    }
    countryList.appendChild(frag);
    var activeEl = countryList.querySelector(".locale-picker__option--active");
    if (activeEl) {
      scrollOptionToCenter(countryList, activeEl);
      countryList.setAttribute("aria-activedescendant", activeEl.id);
    } else {
      countryList.removeAttribute("aria-activedescendant");
    }
    if (countryOpen) scheduleDropdownPlacement(countryList, countryBtn);
  }

  function selectCountry(name) {
    draftCountry = name;
    countryValue.textContent = draftCountry;
    closeCountryList();
  }

  function openCountryList() {
    closeLangList();
    countryOpen = true;
    countryBtn.setAttribute("aria-expanded", "true");
    countryList.hidden = false;
    countrySearchBuf = "";
    countryFiltered = filterCountries("");
    countryActive = countryFiltered.indexOf(draftCountry);
    if (countryActive < 0) countryActive = 0;
    paintCountryOptions();
    scheduleDropdownPlacement(countryList, countryBtn);
    bindDropdownResize();
    document.addEventListener("keydown", onCountryKey, true);
    document.addEventListener("mousedown", onDocPointerClose, true);
  }

  function closeCountryList() {
    if (!countryOpen) return;
    countryOpen = false;
    countryBtn.setAttribute("aria-expanded", "false");
    countryList.classList.remove("locale-picker__listbox--above");
    countryList.style.maxHeight = "";
    countryList.hidden = true;
    countryList.innerHTML = "";
    if (countrySearchTimer) {
      clearTimeout(countrySearchTimer);
      countrySearchTimer = null;
    }
    countrySearchBuf = "";
    document.removeEventListener("keydown", onCountryKey, true);
    document.removeEventListener("mousedown", onDocPointerClose, true);
    unbindDropdownResize();
  }

  function onCountryKey(e) {
    if (!countryOpen) return;
    var k = e.key;
    if (k === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeCountryList();
      countryBtn.focus({ preventScroll: true });
      return;
    }
    if (k === "ArrowDown") {
      e.preventDefault();
      if (countryFiltered.length)
        countryActive = Math.min(countryFiltered.length - 1, countryActive + 1);
      paintCountryOptions();
      return;
    }
    if (k === "ArrowUp") {
      e.preventDefault();
      if (countryFiltered.length) countryActive = Math.max(0, countryActive - 1);
      paintCountryOptions();
      return;
    }
    if (k === "Enter") {
      e.preventDefault();
      if (countryFiltered.length && countryActive >= 0) {
        selectCountry(countryFiltered[countryActive]);
      }
      return;
    }
    if ((k.length === 1 || k === " ") && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      countrySearchBuf += k;
      countryFiltered = filterCountries(countrySearchBuf);
      countryActive = 0;
      paintCountryOptions();
      bumpCountrySearchTimer();
    }
  }

  function paintLangOptions() {
    langList.innerHTML = "";
    var frag = document.createDocumentFragment();
    for (var i = 0; i < LANGS.length; i++) {
      (function (L, idx) {
        var active = L.code === draftLang;
        var opt = document.createElement("div");
        opt.className = "locale-picker__option" + (active ? " locale-picker__option--active" : "");
        opt.setAttribute("role", "option");
        opt.setAttribute("aria-selected", active ? "true" : "false");
        opt.textContent = L.label;
        opt.addEventListener("mousedown", function (e) {
          e.preventDefault();
        });
        opt.addEventListener("click", function () {
          draftLang = L.code;
          langValue.textContent = L.label;
          closeLangList();
        });
        frag.appendChild(opt);
      })(LANGS[i], i);
    }
    langList.appendChild(frag);
    if (langOpen) scheduleDropdownPlacement(langList, langBtn);
  }

  function openLangList() {
    closeCountryList();
    langOpen = true;
    langBtn.setAttribute("aria-expanded", "true");
    langList.hidden = false;
    paintLangOptions();
    scheduleDropdownPlacement(langList, langBtn);
    bindDropdownResize();
    document.addEventListener("keydown", onLangKey, true);
    document.addEventListener("mousedown", onDocPointerClose, true);
  }

  function closeLangList() {
    if (!langOpen) return;
    langOpen = false;
    langBtn.setAttribute("aria-expanded", "false");
    langList.classList.remove("locale-picker__listbox--above");
    langList.style.maxHeight = "";
    langList.hidden = true;
    langList.innerHTML = "";
    document.removeEventListener("keydown", onLangKey, true);
    document.removeEventListener("mousedown", onDocPointerClose, true);
    unbindDropdownResize();
  }

  function onLangKey(e) {
    if (!langOpen) return;
    var k = e.key;
    if (k === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      closeLangList();
      langBtn.focus({ preventScroll: true });
    }
  }

  function onDocPointerClose(e) {
    var t = e.target;
    if (countryOpen) {
      if (countryBtn.contains(t) || t === countryList || countryList.contains(t)) return;
      closeCountryList();
    }
    if (langOpen) {
      if (langBtn.contains(t) || t === langList || langList.contains(t)) return;
      closeLangList();
    }
  }

  function openPanel() {
    markSiteIntroHandled();
    syncDraftFromPrefs();
    root.hidden = false;
    footerTrigger.setAttribute("aria-expanded", "true");
    closeCountryList();
    closeLangList();
    countryBtn.focus({ preventScroll: true });
  }

  function closePanel() {
    root.hidden = true;
    footerTrigger.setAttribute("aria-expanded", "false");
    closeCountryList();
    closeLangList();
  }

  function onRootEscape(e) {
    if (e.key !== "Escape" || root.hidden) return;
    if (countryOpen || langOpen) return;
    e.preventDefault();
    closePanel();
    footerTrigger.focus({ preventScroll: true });
  }

  countryBtn.addEventListener("click", function () {
    if (countryOpen) closeCountryList();
    else openCountryList();
  });

  langBtn.addEventListener("click", function () {
    if (langOpen) closeLangList();
    else openLangList();
  });

  confirmBtn.addEventListener("click", function () {
    var p = { country: normalizeCountry(draftCountry), lang: normalizeLang(draftLang) };
    savePrefs(p);
    applyPrefsToFooter(p);
    closePanel();
    footerTrigger.focus({ preventScroll: true });
  });

  root.addEventListener("keydown", onRootEscape);

  footerTrigger.addEventListener("click", function () {
    if (!root.hidden) {
      closePanel();
      return;
    }
    openPanel();
  });

  var p0 = loadPrefs();
  p0.country = normalizeCountry(p0.country);
  p0.lang = normalizeLang(p0.lang);
  applyPrefsToFooter(p0);

  clearSiteIntroIfReload();

  if (!hasSiteIntroBeenHandled()) {
    setTimeout(function () {
      if (!root.hidden) return;
      if (hasSiteIntroBeenHandled()) return;
      openPanel();
    }, AUTO_OPEN_MS);
  }
})();
