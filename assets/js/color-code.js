"use strict";

$(function () {
  const tableElement = $(".datatables-color-table");

  if (tableElement.length) {
    const dataTable = tableElement.DataTable({
      ajax: {
        // url: "https://inspiro.xacloud.com/admin-workflow/assets/json/forms-data.json",
        url: "./assets/json/forms-data.json",
        dataSrc: "data",
      },
      columns: [
        {
          data: "color",
          render: (data, type, row) => `
          <div class="">
            <span class="color-code" style="background-color: ${row.color}">
          <div>
          `,
        },
        { data: "color" },
        { data: "color_desc" },
        {
          data: "status",
          render: (data, type, row) => `
            <label class="switch">
              <input type="checkbox" class="switch-input">
              <span class="switch-toggle-slider">
              <span class="switch-on"></span>
              <span class="switch-off"></span>
              </span>
            </label>
          `,
        },
        {
          data: "id",
          title: "Actions",
          orderable: false,
          searchable: false,
          render: (data, type, row) => `
            <div class="d-flex align-items-center">
              <a href="./edit-color.html?id=${data}" class="btn btn-primary btn-sm me-2">
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
          <"col-md-4 col-sm-12 order-sm-0">
          <"col-md-8 col-sm-12 order-sm-1"
            <"d-md-flex d-sm-block align-items-center justify-content-end gap-3" 
              f
              <"create-template-btn">
            >
          >
        >
        t
        <"row mx-2"<"col-md-6"i><"col-md-6"p>>
      `,
      language: {
        sLengthMenu: "Show _MENU_",
        search: "",
        searchPlaceholder: "Search color",
      },
      initComplete: function () {
        const departmentFilterContainer = $(
          `<div class="col-auto">
              <label for="departmentFilter" class="form-label mb-0">Department:</label>
          </div>
          <div class="col">
            <select id="departmentFilter" class="form-select">
              <option value="">All Departments</option>
            </select>
          </div>`
        );
        $(".filter-container").append(departmentFilterContainer);

        departmentFilterContainer
          .find("#departmentFilter")
          .on("change", function () {
            const value = $(this).val();
            dataTable.column(2).search(value).draw();
          });

        this.api()
          .column(2)
          .data()
          .unique()
          .sort()
          .each(function (d) {
            departmentFilterContainer
              .find("#departmentFilter")
              .append(`<option value="${d}">${d}</option>`);
          });

        const createTemplateButton = $(
          `<button class="btn btn-primary w-100">
            <i class="mdi mdi-plus me-1"></i>Add
          </button>`
        );

        $(".create-template-btn").append(createTemplateButton);

        createTemplateButton.on("click", function () {
          window.location.href = "create-color.html";
        });
      },
      responsive: true,
    });

    let recordIdToDelete = null;

    // Event for delete record button click
    tableElement.on("click", ".delete-record", function () {
      recordIdToDelete = $(this).data("id");
      // Show the modal
      $("#deleteModal").modal("show");
    });

    // Event for confirming deletion
    $("#confirmDeleteBtn").on("click", function () {
      if (recordIdToDelete !== null) {
        dataTable
          .rows(function (idx, data, node) {
            return data.id === recordIdToDelete;
          })
          .remove()
          .draw();
        // Close the modal after deletion
        $("#deleteModal").modal("hide");
      }
    });
  }
});
