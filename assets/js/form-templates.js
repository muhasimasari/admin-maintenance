"use strict";

$(function () {
  const tableElement = $(".datatables-form-table");

  if (tableElement.length) {
    const dataTable = tableElement.DataTable({
      ajax: {
        // url: "https://inspiro.xacloud.com/admin-workflow/assets/json/forms-data.json",
        url: "./assets/json/forms-data.json",
        dataSrc: "data",
      },
      columns: [
        { data: "color",
          render: (data, type, row) => `
          <div class="position-relative wrapper-color">
            <span class="color-code-custom" style="background-color: ${row.color}">
          <div>
          `
         },
        { data: "form_name" },
        { data: "department" },
        { data: "description" },
        {
          data: "id",
          title: "Actions",
          orderable: false,
          searchable: false,
          render: (data, type, row) => `
            <div class="d-flex align-items-center">
              <a href="./preview-form.html" class="btn btn-outline-primary btn-sm me-2">
                <i class="mdi mdi-eye-outline me-1"></i>Preview
              </a>
              <a href="./edit-form.html?id=${data}" class="btn btn-primary btn-sm me-2">
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
          <"col-md-4 col-sm-12 order-sm-0"<"filter-container">>
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
        searchPlaceholder: "Search forms name or department",
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
            <i class="mdi mdi-plus me-1"></i>Create Template
          </button>`
        );

        $(".create-template-btn").append(createTemplateButton);

        createTemplateButton.on("click", function () {
          window.location.href = "create-template.html";
        });
      },
      responsive: true,
    });

    let recordIdToDelete = null;

    // Event for delete record button click
    tableElement.on("click", ".delete-record", function () {
      recordIdToDelete = $(this).data("id");
      // Show the modal
      $('#deleteModal').modal('show');
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
        $('#deleteModal').modal('hide');
      }
    });
  }
});
