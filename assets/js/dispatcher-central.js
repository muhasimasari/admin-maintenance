document.addEventListener("DOMContentLoaded", function () {
  // ===================== 1. Static Popover with Slider =====================
  const popoverTriggerEl = document.querySelector('[data-bs-toggle="popover"]');
  if (popoverTriggerEl && typeof bootstrap.Popover !== "undefined") {
    const popoverContent = `
        <div class="popover-content-custom">
          <div class="mb-3">
            <label class="form-label fs-6 fw-semibold text-dark">Time Based</label>
            <div class="btn-group" role="group" aria-label="Time based radio group">
              <input type="radio" class="btn-check btn-check-custom" name="btnradio" id="btnradio1" checked autocomplete="off" />
              <label class="btn btn-sm btn-outline-primary btn-custom-primary" for="btnradio1">Next month</label>
              <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" />
              <label class="btn btn-sm btn-outline-primary" for="btnradio2">3 Months</label>
              <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" />
              <label class="btn btn-sm btn-outline-primary" for="btnradio3">6 Months</label>
              <input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off" />
              <label class="btn btn-sm btn-outline-primary" for="btnradio4">12 Months</label>
            </div>
          </div>
          <div class="mb-4">
            <label class="form-label fs-6 fw-semibold text-dark">Usage/Cycle Based</label>
            <div class="d-flex align-items-center gap-2">
              <span class="fw-bold text-dark fs-6">0</span>
              <div id="slider-usage" class="flex-grow-1"></div>
            </div>
          </div>
          <div class="text-end">
            <button id="applyConfigBtn" type="button" class="btn btn-sm btn-dark px-4 py-2">APPLY CONFIG</button>
          </div>
        </div>`;

    const popover = new bootstrap.Popover(popoverTriggerEl, {
      html: true,
      content: popoverContent,
      placement: "bottom",
      customClass: "projection-popover",
      sanitize: false,
    });

    popoverTriggerEl.addEventListener("shown.bs.popover", function () {
      const sliderBasic = document.getElementById("slider-usage");

      if (sliderBasic && typeof noUiSlider !== "undefined") {
        noUiSlider.create(sliderBasic, {
          start: [50],
          connect: [true, false],
          tooltips: [wNumb({ decimals: 0, suffix: "%" })],
          range: {
            min: 0,
            max: 100,
          },
        });
      }

      const applyBtn = document.getElementById("applyConfigBtn");
      if (applyBtn) {
        applyBtn.addEventListener("click", function () {
          const popoverInstance =
            bootstrap.Popover.getInstance(popoverTriggerEl);
          if (popoverInstance) popoverInstance.hide();
        });
      }
    });

    document.addEventListener("click", function (event) {
      const popoverEl = document.querySelector(".popover");
      const isClickInsidePopover =
        popoverEl && popoverEl.contains(event.target);
      const isClickOnTrigger = popoverTriggerEl.contains(event.target);

      if (!isClickInsidePopover && !isClickOnTrigger) {
        const popoverInstance = bootstrap.Popover.getInstance(popoverTriggerEl);
        if (popoverInstance) popoverInstance.hide();
      }
    });
  }

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
      <button class="btn btn-sm btn-text-dark delete-task p-0" data-id="${id}">
      <i class="mdi mdi-20px mdi-trash-can-outline"></i>
    `

    const content = `
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="fw-semibold fs-6 custom-text-dark">${id}</span>
          <span class="d-flex align-items-center gap-1">
            ${repeatSwitch}
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
  const addTaskButtons = document.querySelectorAll('.popover-add-task');

  addTaskButtons.forEach(btn => {
    const taskId = btn.getAttribute('data-task-id');
    const taskUser = btn.getAttribute('data-task-user');
    const taskDate = btn.getAttribute('data-task-date');

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
    `

    const content = `
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="fw-semibold fs-6 custom-text-dark">${taskId}</span>
        <span class="d-flex align-items-center gap-1">
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
      trigger: 'click',
      placement: 'left',
      html: true,
      content: content,
      container: 'body',
      sanitize: false,
      customClass: "roster-popover",
    });
  });

  // ===================== 7. Close all popovers on outside click =====================
  document.addEventListener('click', function (event) {
    // Cek apakah klik di dalam popover
    const popovers = document.querySelectorAll('.popover');
    const isClickInsideAnyPopover = Array.from(popovers).some(pop => pop.contains(event.target));

    // Cek apakah klik di dalam elemen trigger (MC popover / add task)
    const isClickOnTrigger = event.target.closest('.popover-trigger, .popover-add-task');

    if (!isClickInsideAnyPopover && !isClickOnTrigger) {
      // Tutup semua popover aktif
      const allTriggers = document.querySelectorAll('.popover-trigger, .popover-add-task, [data-bs-toggle="popover"]');
      allTriggers.forEach(el => {
        const instance = bootstrap.Popover.getInstance(el);
        if (instance) instance.hide();
      });
    }
  });
});
