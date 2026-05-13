(function () {
  var TRIGGER = "[data-demo-booking-open]";
  var SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
  var WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  var root;
  var backdrop;
  var card;
  var confirmRoot;
  var confirmCard;
  var confirmBackdrop;
  var monthLabel;
  var prevBtn;
  var nextBtn;
  var gridEl;
  var slotsEl;
  var slotsHint;
  var nameInput;
  var emailInput;
  var commentInput;
  var errorEl;

  var viewYear;
  var viewMonth;
  var selectedDate = null;
  var selectedSlot = null;
  var escapeBound;
  var lastActive;

  function startOfToday() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function isBookableDate(d) {
    var dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var t0 = startOfToday();
    if (dayStart < t0) return false;
    var max = new Date(t0);
    max.setDate(max.getDate() + 60);
    if (dayStart > max) return false;
    var dow = dayStart.getDay();
    if (dow === 0 || dow === 6) return false;
    return true;
  }

  function monthKey(y, m) {
    return y * 12 + m;
  }

  function minViewKey() {
    var t = startOfToday();
    return monthKey(t.getFullYear(), t.getMonth());
  }

  function maxViewKey() {
    var t = startOfToday();
    return monthKey(t.getFullYear(), t.getMonth() + 3);
  }

  function setMonthNavDisabled() {
    var cur = monthKey(viewYear, viewMonth);
    prevBtn.disabled = cur <= minViewKey();
    nextBtn.disabled = cur >= maxViewKey();
  }

  function formatMonthYear(y, m) {
    return new Date(y, m, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  function renderCalendar() {
    monthLabel.textContent = formatMonthYear(viewYear, viewMonth);
    setMonthNavDisabled();

    var first = new Date(viewYear, viewMonth, 1);
    var startPad = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7;

    gridEl.innerHTML = "";
    var today = startOfToday();

    for (var i = 0; i < totalCells; i++) {
      var dayNum = i - startPad + 1;
      var cell = document.createElement("div");
      cell.className = "demo-booking__cell";

      if (dayNum < 1 || dayNum > daysInMonth) {
        cell.className += " demo-booking__cell--empty";
        cell.setAttribute("aria-hidden", "true");
        gridEl.appendChild(cell);
        continue;
      }

      var d = new Date(viewYear, viewMonth, dayNum);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "demo-booking__day";
      btn.textContent = String(dayNum);

      if (sameDay(d, today)) {
        btn.classList.add("demo-booking__day--today");
      }

      if (!isBookableDate(d)) {
        btn.classList.add("demo-booking__day--disabled");
        btn.disabled = true;
        btn.setAttribute("aria-disabled", "true");
      } else {
        if (selectedDate && sameDay(d, selectedDate)) {
          btn.classList.add("demo-booking__day--selected");
          btn.setAttribute("aria-pressed", "true");
        }
        btn.addEventListener("click", function (date) {
          return function () {
            selectedDate = date;
            selectedSlot = null;
            renderCalendar();
            renderSlots();
          };
        }(new Date(d.getTime())));
      }

      cell.appendChild(btn);
      gridEl.appendChild(cell);
    }
  }

  function renderSlots() {
    slotsEl.innerHTML = "";
    if (!selectedDate) {
      slotsHint.hidden = false;
      slotsHint.textContent = "Select a date to see available times.";
      return;
    }
    slotsHint.hidden = true;

    SLOTS.forEach(function (time) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "demo-booking__slot";
      b.textContent = time;
      b.setAttribute("aria-pressed", selectedSlot === time ? "true" : "false");
      if (selectedSlot === time) {
        b.classList.add("demo-booking__slot--selected");
      }
      b.addEventListener("click", function () {
        selectedSlot = time;
        renderSlots();
      });
      slotsEl.appendChild(b);
    });
  }

  function hideError() {
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function showError(msg) {
    errorEl.hidden = false;
    errorEl.textContent = msg;
  }

  function resetModal() {
    selectedDate = null;
    selectedSlot = null;
    var t = startOfToday();
    viewYear = t.getFullYear();
    viewMonth = t.getMonth();
    nameInput.value = "";
    emailInput.value = "";
    commentInput.value = "";
    hideError();
    renderCalendar();
    renderSlots();
  }

  function handleEscape(e) {
    if (e.key !== "Escape") return;
    if (confirmRoot && !confirmRoot.hidden) {
      e.preventDefault();
      closeConfirmModal();
      return;
    }
    if (root && !root.hidden) {
      e.preventDefault();
      closeModal();
    }
  }

  function bindEscape() {
    if (escapeBound) return;
    document.addEventListener("keydown", handleEscape);
    escapeBound = true;
  }

  function unbindEscape() {
    if (!escapeBound) return;
    document.removeEventListener("keydown", handleEscape);
    escapeBound = false;
  }

  function openModal() {
    if (!root) return;
    lastActive = document.activeElement;
    resetModal();
    root.hidden = false;
    document.documentElement.style.overflow = "hidden";
    card.setAttribute("tabindex", "-1");
    card.focus();
    bindEscape();
  }

  function closeModal() {
    if (!root || root.hidden) return;
    root.hidden = true;
    if (!confirmRoot || confirmRoot.hidden) {
      unbindEscape();
      document.documentElement.style.overflow = "";
      if (lastActive && typeof lastActive.focus === "function") {
        lastActive.focus();
      }
    }
  }

  function closeConfirmModal() {
    if (!confirmRoot || confirmRoot.hidden) return;
    confirmRoot.hidden = true;
    resetModal();
    unbindEscape();
    document.documentElement.style.overflow = "";
    if (lastActive && typeof lastActive.focus === "function") {
      lastActive.focus();
    }
  }

  function onSubmit() {
    hideError();
    if (!selectedDate) {
      showError("Please select an available date.");
      return;
    }
    if (!selectedSlot) {
      showError("Please select a time slot.");
      return;
    }
    var name = nameInput.value.trim();
    if (!name) {
      showError("Please enter your name.");
      nameInput.focus();
      return;
    }
    if (!emailInput.value.trim()) {
      showError("Please enter your email address.");
      emailInput.focus();
      return;
    }
    if (!emailInput.checkValidity()) {
      showError("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    root.hidden = true;
    confirmRoot.hidden = false;
    confirmCard.setAttribute("tabindex", "-1");
    confirmCard.focus();
    bindEscape();
  }

  function bindTriggers() {
    document.querySelectorAll(TRIGGER).forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    });
  }

  function inject() {
    if (document.getElementById("demo-booking")) return;

    var dowRow = WEEKDAYS.map(function (d) {
      return '<div class="demo-booking__dow">' + d + "</div>";
    }).join("");

    var wrap = document.createElement("div");
    wrap.id = "demo-booking";
    wrap.className = "demo-booking";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-labelledby", "demo-booking-title");
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="demo-booking__backdrop" data-demo-booking-close tabindex="-1"></div>' +
      '<div class="demo-booking__card">' +
      '<div class="demo-booking__header">' +
      '<h2 id="demo-booking-title" class="demo-booking__title t-h2">Book a demo</h2>' +
      '<button type="button" class="demo-booking__close" data-demo-booking-close aria-label="Close">&times;</button>' +
      "</div>" +
      '<div class="demo-booking__main" id="demo-booking-main-panel">' +
      '<div class="demo-booking__section">' +
      '<p class="demo-booking__label t-body" id="demo-booking-cal-label">Choose a date</p>' +
      '<div class="demo-booking__month-nav">' +
      '<button type="button" class="demo-booking__icon-btn" id="demo-booking-prev" aria-label="Previous month">&lsaquo;</button>' +
      '<span class="demo-booking__month-label t-body" id="demo-booking-month-label"></span>' +
      '<button type="button" class="demo-booking__icon-btn" id="demo-booking-next" aria-label="Next month">&rsaquo;</button>' +
      "</div>" +
      '<div class="demo-booking__dow-row">' +
      dowRow +
      "</div>" +
      '<div class="demo-booking__grid" id="demo-booking-grid" aria-labelledby="demo-booking-cal-label"></div>' +
      "</div>" +
      '<div class="demo-booking__section">' +
      '<p class="demo-booking__label t-body" id="demo-booking-slots-label">Available times</p>' +
      '<p class="demo-booking__hint t-body" id="demo-booking-slots-hint"></p>' +
      '<div class="demo-booking__slots" id="demo-booking-slots" role="group" aria-labelledby="demo-booking-slots-label"></div>' +
      "</div>" +
      '<div class="demo-booking__section">' +
      '<div class="demo-booking__field">' +
      '<label class="demo-booking__label t-body" for="demo-booking-name">Name</label>' +
      '<input class="demo-booking__input" id="demo-booking-name" name="name" type="text" autocomplete="name" required />' +
      "</div>" +
      '<div class="demo-booking__field">' +
      '<label class="demo-booking__label t-body" for="demo-booking-email">Email</label>' +
      '<input class="demo-booking__input" id="demo-booking-email" name="email" type="email" autocomplete="email" required />' +
      "</div>" +
      '<div class="demo-booking__field">' +
      '<label class="demo-booking__label t-body" for="demo-booking-comment">Comment <span class="demo-booking__optional">(optional)</span></label>' +
      '<textarea class="demo-booking__textarea" id="demo-booking-comment" name="comment" rows="3"></textarea>' +
      "</div>" +
      "</div>" +
      '<p class="demo-booking__error t-body" id="demo-booking-error" role="alert" hidden></p>' +
      '<button type="button" class="btn btn--solid btn--md demo-booking__book" id="demo-booking-book">Book</button>' +
      "</div>" +
      "</div>";

    document.body.appendChild(wrap);

    var confirm = document.createElement("div");
    confirm.id = "demo-booking-confirm";
    confirm.className = "demo-booking-confirm";
    confirm.setAttribute("role", "dialog");
    confirm.setAttribute("aria-modal", "true");
    confirm.setAttribute("aria-labelledby", "demo-booking-confirm-title");
    confirm.hidden = true;
    confirm.innerHTML =
      '<div class="demo-booking-confirm__backdrop" data-demo-booking-confirm-close tabindex="-1"></div>' +
      '<div class="demo-booking-confirm__card">' +
      '<div class="demo-booking-confirm__figure" aria-hidden="true"></div>' +
      '<h2 id="demo-booking-confirm-title" class="demo-booking-confirm__title t-h2">Thank you</h2>' +
      '<p class="demo-booking-confirm__text t-body" role="status">An invitation to your demo will be sent to your email shortly.</p>' +
      '<button type="button" class="btn btn--solid btn--md demo-booking-confirm__close" data-demo-booking-confirm-close>Close</button>' +
      "</div>";

    document.body.appendChild(confirm);

    root = wrap;
    backdrop = wrap.querySelector(".demo-booking__backdrop");
    card = wrap.querySelector(".demo-booking__card");
    confirmRoot = confirm;
    confirmCard = confirm.querySelector(".demo-booking-confirm__card");
    monthLabel = document.getElementById("demo-booking-month-label");
    prevBtn = document.getElementById("demo-booking-prev");
    nextBtn = document.getElementById("demo-booking-next");
    gridEl = document.getElementById("demo-booking-grid");
    slotsEl = document.getElementById("demo-booking-slots");
    slotsHint = document.getElementById("demo-booking-slots-hint");
    nameInput = document.getElementById("demo-booking-name");
    emailInput = document.getElementById("demo-booking-email");
    commentInput = document.getElementById("demo-booking-comment");
    errorEl = document.getElementById("demo-booking-error");

    var t = startOfToday();
    viewYear = t.getFullYear();
    viewMonth = t.getMonth();

    prevBtn.addEventListener("click", function () {
      if (prevBtn.disabled) return;
      if (viewMonth === 0) {
        viewMonth = 11;
        viewYear -= 1;
      } else {
        viewMonth -= 1;
      }
      renderCalendar();
    });

    nextBtn.addEventListener("click", function () {
      if (nextBtn.disabled) return;
      if (viewMonth === 11) {
        viewMonth = 0;
        viewYear += 1;
      } else {
        viewMonth += 1;
      }
      renderCalendar();
    });

    document.getElementById("demo-booking-book").addEventListener("click", onSubmit);

    wrap.querySelectorAll("[data-demo-booking-close]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        closeModal();
      });
    });

    confirm.querySelectorAll("[data-demo-booking-confirm-close]").forEach(function (el) {
      el.addEventListener("click", function () {
        closeConfirmModal();
      });
    });

    backdrop.addEventListener("click", function () {
      closeModal();
    });

    renderCalendar();
    renderSlots();
  }

  function init() {
    inject();
    bindTriggers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
