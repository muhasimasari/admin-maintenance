$(document).ready(function () {
  // Inisialisasi Select2 dengan placeholder dinamis
  $("#assetGroup, #assetCategory, #engineeringSkills").select2({
    placeholder: function () {
      return $(this).data("placeholder");
    },
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
  allowClear: true,
  width: "100%",
});
