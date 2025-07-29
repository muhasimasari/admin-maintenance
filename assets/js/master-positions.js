"use strict";

$(function () {
  const tableElement = $(".datatables-positions-table");

  if (tableElement.length) {
    const dataTable = tableElement.DataTable({
      ajax: {
        // url: "https://inspiro.xacloud.com/admin-workflow/assets/json/master-data.json",
        url: "./assets/json/master-data.json",
        dataSrc: "data",
      },
      columns: [
        { data: "id",
          render: (data, type, row) => `
          `
        },
        { data: "position" },
        { data: "department" },
        {
          data: "status",
          render: (data, type, row) => {
            let colorClass = "#1A895A";
            if (data === "Active") {
              colorClass = "#1A895A";
            } else if (data === "Inactive") {
              colorClass = "#CA4046";
            }

            return `
              <div><span class="px-2 py-1 text-white mb-1 w-auto" style="background-color: ${colorClass}; border-radius: 6px;">${data}</span></div>
            `;
          },
        },
        {
          data: "id",
          title: "Actions",
          orderable: false,
          searchable: false,
          render: (data, type, row) => `
            <div class="d-flex align-items-center">
              <a href="./edit-position.html?id=${data}" class="btn btn-primary btn-sm me-2">
                <i class="mdi mdi-pencil-outline me-1"></i>Edit
              </a>
              <a href="javascript:void(0);" class="btn btn-danger btn-sm delete-record" data-id="${data}">
                <i class="mdi mdi-delete-outline"></i>Delete
              </a>
            </div>
          `,
        },
      ],
      bLengthChange: false,
      bInfo: true,
      order: [[0, "asc"]],
      dom: `
        <"row py-3 align-items-center justify-content-between"
          <"col-md-7 col-sm-12 order-sm-0"
            <"d-flex gap-2"
              <"download-buttons">
            >
          >
          <"col-md-5 col-sm-12 order-sm-1"
            <"d-md-flex d-sm-block align-items-center justify-content-end gap-3"
              f
              <"right d-flex gap-2">
            >
          >
        >
        t
        <"row mx-2"<"col-md-6"i><"col-md-6"p>>
      `,
      language: {
        sLengthMenu: "Show _MENU_",
        search: "",
        searchPlaceholder: "Search department name",
      },
      responsive: true,
    });

    // Append buttons to "left"
    $('.left').html(`
      <button class="btn btn-success px-3"><i class="mdi mdi-file-excel-outline me-1"></i>Download Template</button>
      <button class="btn btn-outline-secondary px-3"><i class="mdi mdi-download-outline me-1"></i>Download Department</button>
    `);

    // Append buttons to "right"
    $('.right').append(`
      <a href="./create-position.html" class="btn btn-primary w-100"><i class="mdi mdi-plus me-1"></i>Add</a>
    `);

    let recordIdToDelete = null;

    tableElement.on("click", ".delete-record", function () {
      recordIdToDelete = $(this).data("id");
      $("#deleteModal").modal("show");
    });

    $("#confirmDeleteBtn").on("click", function () {
      if (recordIdToDelete !== null) {
        dataTable
          .rows(function (idx, data, node) {
            return data.id === recordIdToDelete;
          })
          .remove()
          .draw();
        $("#deleteModal").modal("hide");
      }
    });
  }
});
