$(document).ready(function () {
  // Inisialisasi Select2 dengan placeholder dinamis
  $("#assetGroup, #assetCategory, #engineeringSkills, #vendorByName").select2({
    placeholder: function () {
      return $(this).data("placeholder");
    },
  });

  $('#categoryTask').select2({
    templateResult: formatOption,
    templateSelection: formatOption,
    width: '100%'
  });

  // Toggle form berdasarkan pilihan partType
  $('input[name="partType"]').change(function () {
    const isAdhoc = this.value === "adhoc";
    $("#adhoc-form").toggleClass("d-none", !isAdhoc);
    $("#registered-form").toggleClass("d-none", isAdhoc);
  });

  // Engineering Skills Select2 with custom chip display
  const $engineeringSelect = $("#engineeringSkills");
  const $selectedSkillsContainer = $("#selectedSkillsContainer");

  $engineeringSelect.select2({
    placeholder: $engineeringSelect.data("placeholder"),
    templateSelection: () => null,
  });

  function renderSelectedChips() {
    const selected = $engineeringSelect.val() || [];
    $selectedSkillsContainer.empty();

    selected.forEach((val) => {
      const chip = $(`
        <div class="badge rounded-pill bg-label-primary small" data-value="${val}">
          ${val} <span class="remove-btn">&times;</span>
        </div>
      `);

      chip.find(".remove-btn").on("click", function () {
        const updated = $engineeringSelect.val().filter((v) => v !== val);
        $engineeringSelect.val(updated).trigger("change");
      });

      $selectedSkillsContainer.append(chip);
    });
  }

  $engineeringSelect.on("change", renderSelectedChips);
  renderSelectedChips(); // Initial render

  
  // Vendor by Select2 with custom chip display
  const $vendorSelect = $("#vendorByName");
  const $selectedVendorContainer = $("#selectedVendorContainer");

  $vendorSelect.select2({
    placeholder: $vendorSelect.data("placeholder"),
    templateSelection: () => null,
  });

  function renderSelectedChipsVendor() {
    const selected = $vendorSelect.val() || [];
    $selectedVendorContainer.empty();

    selected.forEach((val) => {
      const chip = $(`
        <div class="badge rounded-pill bg-label-primary small" data-value="${val}">
          ${val} <span class="remove-btn">&times;</span>
        </div>
      `);

      chip.find(".remove-btn").on("click", function () {
        const updated = $vendorSelect.val().filter((v) => v !== val);
        $vendorSelect.val(updated).trigger("change");
      });

      $selectedVendorContainer.append(chip);
    });
  }

  function formatOption (opt) {
    if (!opt.id) return opt.text;

    var color = $(opt.element).data("color");
    if (!color) return opt.text;

    var $opt = $(
      '<span><span style="display:inline-block;width:15px;height:15px;border-radius:50%;background:' 
      + color + ';margin-right:8px;"></span>' + opt.text + '</span>'
    );
    return $opt;
  };

  $vendorSelect.on("change", renderSelectedChipsVendor);
  renderSelectedChipsVendor(); // Initial render
});

  // sinkronisasi input color dengan option yang dipilih
  $('#categoryTask').on('change', function() {
    var color = $(this).find(':selected').data('color');
    $('#colorPicker').val(color);
  });


// Hapus baris checklist
$(document).on("click", ".remove-checklist", function () {
  $(this).closest(".checklist-item").remove();
});

// Dummy data
const allMTCTasks = Array.from({ length: 500 }, (_, i) => ({
  id: `mtc-${i + 1}`,
  name: `MC-${String(i + 1).padStart(3, "0")} | Task ${i + 1}`,
}));

const allAssetParts = Array.from({ length: 300 }, (_, i) => ({
  id: `part-${i + 1}`,
  name: `Part ${i + 1} - ${["Filter", "Pump", "Motor", "Valve"][i % 4]}`,
}));

// Fungsi simulasi AJAX untuk Select2
function simulateAjax(source) {
  return function (params, success) {
    const term = (params.data.term || "").toLowerCase();
    const page = params.data.page || 1;
    const pageSize = 20;

    const filtered = source.filter((item) =>
      item.name.toLowerCase().includes(term)
    );
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

    setTimeout(() => {
      success({
        items: paginated,
        hasMore: page * pageSize < filtered.length,
      });
    }, 300);
  };
}

// Modal Select2 untuk clone MTC
$("#cloneInspectionModal").on("shown.bs.modal", function () {
  $("#mtcTaskList").select2({
    dropdownParent: $("#cloneInspectionModal"),
    placeholder: "Choose MTC Task",
    ajax: {
      transport: simulateAjax(allMTCTasks),
      processResults: function (data, params) {
        params.page = params.page || 1;
        return {
          results: data.items.map((item) => ({
            id: item.id,
            text: item.name,
          })),
          pagination: { more: data.hasMore },
        };
      },
    },
  });

  $("#mtcCategory").select2({
    dropdownParent: $("#cloneInspectionModal"),
    placeholder: "Select MTC Category",
    width: "100%",
  });

  $("#mtcType").select2({
    dropdownParent: $("#cloneInspectionModal"),
    placeholder: "Select MTC Type",
    width: "100%",
  });
});

const allAssetGroups = Array.from({ length: 1000 }, (_, i) => ({
  id: `group-${i + 1}`,
  name: `Asset Group ${i + 1}`,
}));

const allAssetCategories = Array.from({ length: 500 }, (_, i) => ({
  id: `cat-${i + 1}`,
  name: `Asset Category ${i + 1}`,
}));

function simulateAjax(dataArray) {
  return function (params, success) {
    const term = params.data.term?.toLowerCase() || "";
    const page = params.data.page || 1;
    const pageSize = 20;

    const filtered = dataArray.filter((item) =>
      item.name.toLowerCase().includes(term)
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    setTimeout(() => {
      success({
        items: paginated,
        hasMore: end < filtered.length,
      });
    }, 300);
  };
}

// Inisialisasi assetCategoryForm
$("#assetCategory-1").select2({
  placeholder: "Choose Asset Category",
  allowClear: true,
  ajax: {
    transport: simulateAjax(allAssetCategories),
    processResults: function (data, params) {
      params.page = params.page || 1;
      return {
        results: data.items.map((item) => ({
          id: item.id,
          text: item.name,
        })),
        pagination: {
          more: data.hasMore,
        },
      };
    },
  },
});

// Inisialisasi assetGroupForm
$("#assetGroup-1").select2({
  placeholder: "Choose Asset Group",
  allowClear: true,
  ajax: {
    transport: simulateAjax(allAssetGroups),
    processResults: function (data, params) {
      params.page = params.page || 1;
      return {
        results: data.items.map((item) => ({
          id: item.id,
          text: item.name,
        })),
        pagination: {
          more: data.hasMore,
        },
      };
    },
  },
});

// Inisialisasi Select2 untuk #partList
$("#addPartModal").on("shown.bs.modal", function () {
  $("#partList").select2({
    placeholder: $("#partList").data("placeholder"),
    allowClear: true,
    dropdownParent: $("#addPartModal"), // ⬅️ Penting agar dropdown tidak terpotong
    ajax: {
      transport: simulateAjax(allAssetParts),
      processResults: function (data, params) {
        params.page = params.page || 1;
        return {
          results: data.items.map((item) => ({
            id: item.id,
            text: item.name,
          })),
          pagination: {
            more: data.hasMore,
          },
        };
      },
    },
  });
});

$("#addPartModal").on("shown.bs.modal", function () {
  // Inisialisasi assetGroups
  $("#assetGroups").select2({
    dropdownParent: $("#addPartModal"),
    placeholder: "Choose Asset Group",
    ajax: {
      transport: function (params, success) {
        const term = params.data.term?.toLowerCase() || ""; // ✅ FIX DI SINI
        const page = params.data.page || 1;
        const pageSize = 20;

        const filtered = allAssetGroups.filter((item) =>
          item.name.toLowerCase().includes(term)
        );

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginated = filtered.slice(start, end);

        setTimeout(() => {
          success({
            items: paginated,
            hasMore: end < filtered.length,
          });
        }, 300);
      },
      processResults: function (data, params) {
        params.page = params.page || 1;
        return {
          results: data.items.map((item) => ({
            id: item.id,
            text: item.name,
          })),
          pagination: {
            more: data.hasMore,
          },
        };
      },
    },
  });

  // Inisialisasi assetCategories
  $("#assetCategories").select2({
    dropdownParent: $("#addPartModal"),
    placeholder: "Choose Asset Categories",
    ajax: {
      transport: function (params, success) {
        const term = params.data.term?.toLowerCase() || ""; // ✅ FIX DI SINI
        const page = params.data.page || 1;
        const pageSize = 20;

        const filtered = allAssetCategories.filter((item) =>
          item.name.toLowerCase().includes(term)
        );

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginated = filtered.slice(start, end);

        setTimeout(() => {
          success({
            items: paginated,
            hasMore: end < filtered.length,
          });
        }, 300);
      },
      processResults: function (data, params) {
        params.page = params.page || 1;
        return {
          results: data.items.map((item) => ({
            id: item.id,
            text: item.name,
          })),
          pagination: {
            more: data.hasMore,
          },
        };
      },
    },
  });
});

// Checkbox toggle semua baris
$("#allCheckbox").on("change", function () {
  const isChecked = $(this).is(":checked");
  $('#tableBody input[type="checkbox"]').prop("checked", isChecked);
});

// Cek status checkbox jika ada perubahan
$("#tableBody").on("change", 'input[type="checkbox"]', function () {
  const all = $('#tableBody input[type="checkbox"]').length;
  const checked = $('#tableBody input[type="checkbox"]:checked').length;
  $("#allCheckbox").prop("checked", all === checked);
});

function formatColor(option) {
  if (!option.id) return option.text;
  var color = $(option.element).data("color");
  var $option = $(`
    <span class="d-flex align-items-center">
      <span style="display:inline-block;width:24px;height:24px;border-radius:4px;background-color:${color};"></span>
      <span class="text-white">${option.text}</span>
    </span>
  `);
  return $option;
}

$("#colorFilter").select2({
  templateResult: formatColor,
  templateSelection: formatColor,
  width: "100%",
});

$("#categoryTask").select2({
  placeholder: $("#categoryTask").data("placeholder"),
  allowClear: false,
});

function checkFilterSelection() {
  const category = document.getElementById("mtcCategory").value;
  const type = document.getElementById("mtcType").value;
  const tableContainer = document.getElementById("tableContainer");

  if (category && type) {
    tableContainer.classList.remove("d-none");
  } else {
    tableContainer.classList.add("d-none");
  }
}

document.getElementById("intervalTab").addEventListener("change", () => {
  document.getElementById("intervalContent").classList.remove("d-none");
  document.getElementById("fixedContent").classList.add("d-none");
});

document.getElementById("fixedTab").addEventListener("change", () => {
  document.getElementById("intervalContent").classList.add("d-none");
  document.getElementById("fixedContent").classList.remove("d-none");
});

flatpickr("#assignmentDate", {
  dateFormat: "d-M-Y",
  defaultDate: "today",
});

// Switch content based on radio selection in Fixed Scheduled
document.getElementById("oneTime").addEventListener("change", () => {
  document.getElementById("oneTimeDate").classList.remove("d-none");
  document.getElementById("schedulingDates").classList.add("d-none");
});

document.getElementById("scheduling").addEventListener("change", () => {
  document.getElementById("oneTimeDate").classList.add("d-none");
  document.getElementById("schedulingDates").classList.remove("d-none");
});

// --- DOM Element References ---
const cronInputs = document.querySelectorAll(".cron-input");
const descriptionText = document.getElementById("description-text");
const scheduleButtons = document.querySelectorAll(".common-schedule-btn");

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --- Main Cron Parsing Logic ---
function cronToText() {
  const parts = Array.from(cronInputs).map((input) => input.value.trim());
  // We only care about day-of-month, month, and day-of-week for this implementation
  const [dayOfMonth, month, dayOfWeek] = parts;

  // Combine into a string for simple hardcoded checks
  const cronString = parts.join(" ");
  if (cronString === "* * *") return "Every day";
  if (cronString === "* * 0") return "Every Sunday";
  if (cronString === "1 * *") return "On the first day of every month";

  // Parse each part of the cron string individually
  const dayOfMonthDesc = parsePart(dayOfMonth, "day-of-month");
  const monthDesc = parsePart(month, "month", { names: MONTH_NAMES });
  const dayOfWeekDesc = parsePart(dayOfWeek, "day-of-week", {
    names: DAY_NAMES,
  });

  // Build the descriptive sentence from the parsed parts
  let conditions = [];
  if (dayOfMonthDesc) conditions.push(dayOfMonthDesc);
  if (dayOfWeekDesc) conditions.push(dayOfWeekDesc);
  if (monthDesc) {
    // Change "on" to "in" for months for better grammar (e.g., "in January")
    conditions.push(monthDesc.replace(/^on\s/, "in "));
  }

  if (conditions.length === 0) return "Every day";

  // Join the conditions and capitalize the first letter
  let sentence = conditions.join(" ");
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  return sentence;
}

/**
 * Parses a single part of a cron string (e.g., "1-5" or "* /2") into a human-readable string.
 * @param {string} part - The cron part string.
 * @param {string} unit - The unit of time (e.g., 'day-of-month', 'month').
 * @param {object} [options={}] - Additional options, like a map of names.
 * @returns {string} A human-readable description of the part.
 */
function parsePart(part, unit, options = {}) {
  // An asterisk means "every", so we return an empty string to ignore it in the final sentence.
  if (part === "*") return "";

  // Helper to format a list of items into a natural language list (e.g., "A, B, and C")
  const formatList = (items) => {
    if (items.length === 1) return items[0];
    if (items.length === 2) return items.join(" and ");
    return items.slice(0, -1).join(", ") + ", and " + items.slice(-1);
  };

  // Helper to get the name of a value if a name map is provided (e.g., 1 -> "Monday")
  const getName = (val) => {
    const num = parseInt(val, 10);
    if (options.names && options.names[num]) {
      return options.names[num];
    }
    return val;
  };

  const unitName = unit.replace(/-/g, " ");

  // Handle comma-separated values (e.g., "1,3,5")
  if (part.includes(",")) {
    const values = part
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
      .map(getName);

    const prefix = unit === "day-of-month" ? `${unitName} ` : "";
    return `on ${prefix}${formatList(values)}`;
  }
  // Handle ranges (e.g., "1-5")
  if (part.includes("-")) {
    const [start, end] = part.split("-").map((v) => v.trim());
    return `from ${unitName} ${getName(start)} through ${getName(end)}`;
  }
  // Handle step values (e.g., "*/2")
  if (part.includes("/")) {
    const [, step] = part.split("/").map((v) => v.trim());
    return `every ${step} ${unitName}s`;
  }

  // Handle a single value (e.g., "1")
  let singleValueText = getName(part);

  // If getName returned the same value, a name was not found.
  // In that case, we add the unit for clarity.
  if (singleValueText === part.trim()) {
    switch (unit) {
      case "day-of-month":
        singleValueText = `day ${part}`;
        break;
      case "month":
        singleValueText = `month ${part}`;
        break;
      case "day-of-week":
        singleValueText = `day ${part}`;
        break;
      default:
        // singleValueText is already `part`
        break;
    }
  }

  return `on ${singleValueText}`;
}

// --- UI Update Function ---
function updateDescription() {
  try {
    const text = cronToText();
    descriptionText.textContent = text;
  } catch (e) {
    descriptionText.textContent = "Invalid expression";
    console.error(e);
  }
}

// --- Event Listeners ---
cronInputs.forEach((input) => {
  input.addEventListener("input", updateDescription);
});

scheduleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const values = button.dataset.value.split(" ");
    cronInputs.forEach((input, index) => {
      input.value = values[index];
    });
    updateDescription();
  });
});

// --- Initial Call ---
updateDescription();

("use strict");
(function () {
  var t = document.querySelector("#color-picker-monolith");

  t &&
    pickr.create({
      el: t,
      theme: "monolith",
      default: "rgba(40, 208, 148, 1)",
      swatches: [
        "rgba(102, 108, 232, 1)",
        "rgba(40, 208, 148, 1)",
        "rgba(255, 73, 97, 1)",
        "rgba(255, 145, 73, 1)",
        "rgba(30, 159, 242, 1)",
      ],
      components: {
        preview: !0,
        opacity: !0,
        hue: !0,
        interaction: {
          hex: !0,
          rgba: !0,
          hsla: !0,
          hsva: !0,
          cmyk: !0,
          input: !0,
          clear: !0,
          save: !0,
        },
      },
    });
})();
