document.addEventListener("DOMContentLoaded", function () {
  // ===================== 1. Static Popover with Slider =====================
  // const popoverTriggerEl = document.querySelector('[data-bs-toggle="popover"]');
  // if (popoverTriggerEl && typeof bootstrap.Popover !== "undefined") {
  //   const popoverContent = `
  //       <div class="popover-content-custom">
  //         <div class="mb-3">
  //           <label class="form-label fs-6 fw-semibold text-dark">Time Based</label>
  //           <div class="btn-group" role="group" aria-label="Time based radio group">
  //             <input type="radio" class="btn-check btn-check-custom" name="btnradio" id="btnradio1" checked autocomplete="off" />
  //             <label class="btn btn-sm btn-outline-primary btn-custom-primary" for="btnradio1">Next month</label>
  //             <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" />
  //             <label class="btn btn-sm btn-outline-primary" for="btnradio2">3 Months</label>
  //             <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" />
  //             <label class="btn btn-sm btn-outline-primary" for="btnradio3">6 Months</label>
  //             <input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off" />
  //             <label class="btn btn-sm btn-outline-primary" for="btnradio4">12 Months</label>
  //           </div>
  //         </div>
  // <div class="mb-4">
  //   <label class="form-label fs-6 fw-semibold text-dark">Usage/Cycle Based</label>
  //   <div class="d-flex align-items-center gap-2">
  //     <span class="fw-bold text-dark fs-6">0</span>
  //     <div id="slider-usage" class="flex-grow-1"></div>
  //   </div>
  // </div>
  //         <div class="text-end">
  //           <button id="applyConfigBtn" type="button" class="btn btn-sm btn-dark px-4 py-2">APPLY CONFIG</button>
  //         </div>
  //       </div>`;

  //   const popover = new bootstrap.Popover(popoverTriggerEl, {
  //     html: true,
  //     content: popoverContent,
  //     placement: "bottom",
  //     customClass: "projection-popover",
  //     sanitize: false,
  //   });

  //   popoverTriggerEl.addEventListener("shown.bs.popover", function () {
  //     const sliderBasic = document.getElementById("slider-usage");

  //     if (sliderBasic && typeof noUiSlider !== "undefined") {
  // noUiSlider.create(sliderBasic, {
  //   start: [50],
  //   connect: [true, false],
  //   tooltips: [wNumb({ decimals: 0, suffix: "%" })],
  //   range: {
  //     min: 0,
  //     max: 100,
  //   },
  // });
  //     }

  //     const applyBtn = document.getElementById("applyConfigBtn");
  //     if (applyBtn) {
  //       applyBtn.addEventListener("click", function () {
  //         const popoverInstance =
  //           bootstrap.Popover.getInstance(popoverTriggerEl);
  //         if (popoverInstance) popoverInstance.hide();
  //       });
  //     }
  //   });

  //   document.addEventListener("click", function (event) {
  //     const popoverEl = document.querySelector(".popover");
  //     const isClickInsidePopover =
  //       popoverEl && popoverEl.contains(event.target);
  //     const isClickOnTrigger = popoverTriggerEl.contains(event.target);

  //     if (!isClickInsidePopover && !isClickOnTrigger) {
  //       const popoverInstance = bootstrap.Popover.getInstance(popoverTriggerEl);
  //       if (popoverInstance) popoverInstance.hide();
  //     }
  //   });
  // }

  const checkAll = document.getElementById("check-all");
  const checkedAllClass = document.querySelectorAll(".checked-all");
  const bulkToolbar = document.getElementById("bulk-toolbar");
  const bulkCount = document.getElementById("bulk-count");

  // fungsi update toolbar
  function updateToolbar() {
    const selected = document.querySelectorAll(".checked-all:checked").length;

    if (selected > 0) {
      bulkToolbar.style.display = "flex";

      // isi angka otomatis ke dalam span
      document.getElementById("bulk-number").textContent = selected;
    } else {
      bulkToolbar.style.display = "none";
    }
  }

  // check/uncheck all
  checkAll.addEventListener("change", function () {
    checkedAllClass.forEach((cb) => (cb.checked = checkAll.checked));
    updateToolbar();
  });

  // kalau ada yang diubah manual
  checkedAllClass.forEach((cb) => {
    cb.addEventListener("change", function () {
      // kalau semua dicentang manual, centang juga "check all"
      checkAll.checked =
        document.querySelectorAll(".checked-all:checked").length ===
        checkboxes.length;
      updateToolbar();
    });
  });

  // init awal
  updateToolbar();

  // ===================== 2. Select2 Initialization =====================
  $(document).ready(function () {
    $("#skillSet").select2({
      placeholder: $(this).data("placeholder"),
      allowClear: true,
    });
  });

  // ===================== 3. Checkbox Row Highlight =====================
  const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const row = this.closest("tr");
      const tds = row.querySelectorAll("td");

      if (this.checked) {
        row.classList.add("selected-row");
        tds.forEach((td) => {
          td.style.backgroundColor = "#3c57a110";
          td.style.borderColor = "transparent";
        });
      } else {
        row.classList.remove("selected-row");
        tds.forEach((td) => {
          td.style.backgroundColor = "";
          td.style.borderColor = "";
        });
      }
    });
  });

  const selectAll = document.getElementById("allCheckbox");
  if (selectAll) {
    selectAll.addEventListener("change", function () {
      checkboxes.forEach((checkbox) => {
        // Lewati checkbox yang disabled
        if (checkbox.disabled) return;

        checkbox.checked = this.checked;

        const row = checkbox.closest("tr");
        const tds = row.querySelectorAll("td");

        if (this.checked) {
          row.classList.add("selected-row");
          tds.forEach((td) => {
            td.style.backgroundColor = "#3c57a110";
            td.style.borderColor = "transparent";
          });
        } else {
          row.classList.remove("selected-row");
          tds.forEach((td) => {
            td.style.backgroundColor = "";
            td.style.borderColor = "";
          });
        }
      });
    });
  }

  // ===================== 4. Flatpickr Date Initialization =====================
  flatpickr("#assignmentDate", {
    dateFormat: "d-M-Y",
    defaultDate: "today",
  });

  // ===================== 5. Dynamic Popover for Task Cards =====================
  const triggers = document.querySelectorAll(".popover-trigger");

  triggers.forEach((el) => {
    const id = el.getAttribute("data-id");
    const date = el.getAttribute("data-date");
    const user = el.getAttribute("data-user");

    const repeatSwitch = `
        <label class="switch switch-sm">
          <input type="checkbox" class="switch-input" checked>
          <span class="switch-toggle-slider">
            <span class="switch-on"></span>
            <span class="switch-off"></span>
          </span>
          <span class="switch-label">Repeat</span>
        </label>`;

    const deleteTask = `
      <button class="btn btn-sm btn-text-danger delete-task p-0" data-id="${id}">
      <i class="mdi mdi-20px mdi-trash-can-outline"></i>
    `;

    const editTask = `
      <button class="btn btn-sm btn-text-primary delete-task p-0" data-id="${id}">
        <i class="mdi mdi-20px mdi-pencil-outline"></i>
      </button>
    `;

    const content = `
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="fw-semibold fs-6 custom-text-dark">${id}</span>
          <span class="d-flex align-items-center gap-1">
            ${repeatSwitch}
            ${editTask}
            ${deleteTask}
          </span>
        </div>
        <hr class="my-2"/>
        <div class="mb-1 text-dark" style="font-size: 14px;">
          <i class="mdi mdi-calendar me-1"></i> ${date}
        </div>
        <div class="text-dark" style="font-size: 14px;">
          <i class="mdi mdi-account me-1"></i> ${user}
        </div>`;

    new bootstrap.Popover(el, {
      trigger: "click",
      placement: "left",
      html: true,
      content: content,
      container: "body",
      customClass: "roster-popover",
      sanitize: false,
    });
  });

  // ===================== 6. Popover Add Task =====================
  const addTaskButtons = document.querySelectorAll(".popover-add-task");

  addTaskButtons.forEach((btn) => {
    const taskId = btn.getAttribute("data-task-id");
    const taskUser = btn.getAttribute("data-task-user");
    const taskDate = btn.getAttribute("data-task-date");

    const repeatSwitch = `
      <label class="switch switch-sm">
        <input type="checkbox" class="switch-input" checked>
        <span class="switch-toggle-slider">
          <span class="switch-on"></span>
          <span class="switch-off"></span>
        </span>
        <span class="switch-label">Repeat</span>
      </label>
    `;

    const deleteTask = `
      <button class="btn btn-sm btn-text-dark delete-task p-0" data-id="${taskId}">
        <i class="mdi mdi-20px mdi-trash-can-outline"></i>
      </button>
    `;

    const editTask = `
      <button class="btn btn-sm btn-text-primary delete-task p-0" data-id="${taskId}">
        <i class="mdi mdi-20px mdi-pencil-outline"></i>
      </button>
    `;

    const content = `
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="fw-semibold fs-6 custom-text-dark">${taskId}</span>
        <span class="d-flex align-items-center gap-1">
          ${editTask}
          ${repeatSwitch}
          ${deleteTask}
        </span>
      </div>
      <hr class="my-2"/>
      <div class="mb-1 text-dark" style="font-size: 14px;">
        <i class="mdi mdi-calendar me-1"></i> ${taskDate}
      </div>
      <div class="text-dark" style="font-size: 14px;">
        <i class="mdi mdi-account me-1"></i> ${taskUser}
      </div>
    `;

    new bootstrap.Popover(btn, {
      trigger: "click",
      placement: "left",
      html: true,
      content: content,
      container: "body",
      sanitize: false,
      customClass: "roster-popover",
    });
  });

  // ===================== 7. Close all popovers on outside click =====================
  document.addEventListener("click", function (event) {
    const popovers = document.querySelectorAll(".popover");
    const isClickInsideAnyPopover = Array.from(popovers).some((pop) =>
      pop.contains(event.target)
    );

    const isClickOnTrigger = event.target.closest(
      ".popover-trigger, .popover-add-task"
    );

    if (!isClickInsideAnyPopover && !isClickOnTrigger) {
      const allTriggers = document.querySelectorAll(
        '.popover-trigger, .popover-add-task, [data-bs-toggle="popover"]'
      );
      allTriggers.forEach((el) => {
        const instance = bootstrap.Popover.getInstance(el);
        if (instance) instance.hide();
      });
    }
  });

  // ===================== 8. Collapse Add Vendors =====================
  const collapseEl = document.getElementById("vendorCollapse");
  const iconEl = document.getElementById("vendorIcon");

  collapseEl.addEventListener("show.bs.collapse", () => {
    iconEl.classList.remove("mdi-plus");
    iconEl.classList.add("mdi-minus");
  });

  collapseEl.addEventListener("hide.bs.collapse", () => {
    iconEl.classList.remove("mdi-minus");
    iconEl.classList.add("mdi-plus");
  });

  // ===================== 9. Engineer List =====================
  function initSelect2() {
    $("#engineerList").select2({
      placeholder: "Choose Engineer",
      allowClear: true,
      width: "100%",
    });
  }

  // Initial load
  $(document).ready(function () {
    initSelect2();

    $("#addEngineer").click(function () {
      const newRow = `
        <div class="row g-2 align-items-center mb-3 engineer-row">
          <div class="form-floating form-floating-outline col-11">
            <select class="form-select select2" style="width: 100%;">
              <option value="">Choose Engineer</option>
              <option value="eng1">Antoni Setiawan</option>
              <option value="eng1">Budi Kuncoro</option>
              <option value="eng1">John Doe</option>
              <option value="eng2">Jane Smith</option>
              <option value="eng3">Michael Johnson</option>
              <option value="eng4">Sarah Williams</option>
            </select>
          </div>
          <div class="col-1 text-end d-flex align-items-center">
            <button class="btn btn-text-danger p-0 btn-remove"><i class="mdi mdi-minus"></i></button>
          </div>
        </div>
      `;
      $("#engineerWrapper").append(newRow);
      initSelect2();
      toggleRemoveButtons();
    });

    $("#engineerWrapper").on("click", ".btn-remove", function () {
      $(this).closest(".engineer-row").remove();
      toggleRemoveButtons();
    });

    function toggleRemoveButtons() {
      const rows = $(".engineer-row");
      if (rows.length > 1) {
        rows.find(".btn-remove").removeClass("d-none");
      } else {
        rows.find(".btn-remove").addClass("d-none");
      }
    }
  });

  $(document).ready(function () {
    $("#skillSetForm").select2({
      placeholder: $("#skillSetForm").data("placeholder"),
      allowClear: true,
      minimumResultsForSearch: 0, // selalu tampilkan search box
    });
  });
});

const slider = document.getElementById("slider-usage");
const valueDisplay = document.getElementById("usage-value");

noUiSlider.create(slider, {
  start: 400, // Start at 40% of 1000
  connect: "lower",
  range: {
    min: 0,
    max: 1000,
  },
  // Configure the tooltip to show percentage
  tooltips: {
    to: function (value) {
      // Calculate percentage based on max range
      const percentage = (value / 1000) * 100;
      return Math.round(percentage) + "%";
    },
  },
});

document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("slider-usage");
  const tooltip = document.getElementById("slider-tooltip");
  const hiddenInput = document.getElementById("input-usage-value");
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const root = document.documentElement;

  const WARNING_THRESHOLD = 80;

  function updateSlider() {
    const val = slider.value;
    const min = slider.min ? slider.min : 0;
    const max = slider.max ? slider.max : 100;

    // 1. Update Input Hidden
    hiddenInput.value = val;

    // 2. Logic Warna & Text Warning
    let currentColorVar = "--slider-color";
    let trackColorVar = "--track-color";

    const styles = getComputedStyle(document.body);
    // Cek status warning
    if (val >= WARNING_THRESHOLD) {
      sliderWrapper.classList.add("slider-warning-state");
      // Saat warning, tooltip berubah
      tooltip.innerHTML = `${val}%`;
    } else {
      sliderWrapper.classList.remove("slider-warning-state");
      tooltip.innerHTML = `${val}%`;
    }
    const activeColor = val >= WARNING_THRESHOLD ? "#dc3545" : "#ea9b1c";
    const trackColor = "#e9ecef";
    const percentage = ((val - min) * 100) / (max - min);

    slider.style.background = `linear-gradient(to right, ${activeColor} 0%, ${activeColor} ${percentage}%, ${trackColor} ${percentage}%, ${trackColor} 100%)`;
    const thumbWidth = 24; // Sesuai CSS --thumb-size
  }

  // Event Listeners
  slider.addEventListener("input", updateSlider);

  // Inisialisasi awal
  updateSlider();
});
