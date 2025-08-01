// Simulasi ribuan data
const allAssetGroups = Array.from({ length: 1000 }, (_, i) => ({
  id: `group-${i + 1}`,
  name: `Asset Group ${i + 1}`,
}));

const allAssetCategories = Array.from({ length: 500 }, (_, i) => ({
  id: `cat-${i + 1}`,
  name: `Asset Category ${i + 1}`,
}));

$("#addMTCCodeModal").on("shown.bs.modal", function () {
  // Inisialisasi assetGroups
  $("#assetGroups").select2({
    dropdownParent: $("#addMTCCodeModal"),
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
    dropdownParent: $("#addMTCCodeModal"),
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
$("#assetCategoryForm").select2({
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
$("#assetGroupForm").select2({
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
