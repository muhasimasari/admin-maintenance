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
        {
          data: "color",
          render: (data, type, row) => `
          <div class="">
            <span class="color-code" style="background-color: ${row.color}">
          <div>
          `,
        },
        {
          data: "req_code",
          render: (data, type, row) => `
            <a class="fw-bold" href="./detail-request-form.html"><u>${row.req_code}</u></a>
          `,
        },
        { data: "form_name" },
        { data: "aging_day" },
        {
          data: "req_by",
          render: (data, type, row) => `
            <div>${row.req_by}</div>
            <div>${row.request_date}</div>
            `,
        },
        {
          data: "status",
          render: (data, type, row) => {
            let colorClass = "#EA9612";
            if (data === "Approved") {
              colorClass = "#1A895A";
            } else if (data === "Waiting") {
              colorClass = "#EA9612";
            } else if (data === "Decline") {
              colorClass = "#CA4046";
            }
            return `
                <div class="d-md-flex flex-column gap-1 d-none">
                  <div><span class="px-2 py-1 text-white mb-1 w-auto" style="background-color: ${colorClass}; font-size: 12px; border-radius: 6px;">${data}</span></div>
                  <div style="font-size: 12px;">Layer 1 of 2</div>
                  <div class="d-flex align-items-center gap-2" style="font-size: 12px;">Delilah Santoso<span class="${row.status === 'Decline' ? 'mdi mdi-close-circle text-danger' : 'mdi mdi-check-circle text-success'}"></span></div>
                  <div class="d-flex align-items-center gap-2" style="font-size: 12px;">Andika Sumarendra<span class="${row.status === 'Approved' ? 'mdi mdi-check-circle text-success' : ''}"></span></div>
                </div>
                <div class="d-flex gap-3 d-md-none">
                  <div><span class="px-2 py-1 rounded-pill text-white mb-1 w-auto" style="background-color: ${colorClass};">${data}</span></div>
                  <div>
                    <div>Layer 1 of 2</div>
                    <div class="d-flex align-items-center gap-2">Delilah Santoso<span class="${row.status === 'Decline' ? 'mdi mdi-close-circle text-danger' : 'mdi mdi-check-circle text-success'}"></span></div>
                    <div class="d-flex align-items-center gap-2">Andika Sumarendra<span class="${row.status === 'Approved' ? 'mdi mdi-check-circle text-success' : ''}"></span></div>
                  </div>
                </div>
              `;
          },
        },
        {
          data: "id",
          title: "Actions",
          orderable: false,
          searchable: false,
          render: (data, type, row) => `
            <div class="d-md-inline-block d-none text-nowrap">
              <button class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                <i class="mdi mdi-dots-vertical mdi-20px"></i>
              </button>
              <div class="dropdown-menu dropdown-menu-end m-0">
                <a href="./edit-request-form.html" class="dropdown-item text-primary">
                    <i class="mdi mdi-pencil-outline me-2"></i>
                    <span>Edit</span>
                </a>
                <a href="javascript:;" class="dropdown-item delete-record text-danger" data-id="${data}">
                    <i class="mdi mdi-delete-outline me-2"></i>
                    <span>Delete</span>
                </a>
              </div>
            </div>
            <div class="d-flex align-items-center d-md-none">
              <a href="./edit-request-form.html?id=${data}" class="btn btn-primary btn-sm me-2">
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
        searchPlaceholder: "Search forms name or request code",
      },
      initComplete: function () {
        const statusFilterContainer = $(
          `<div class="col-auto">
              <label for="statusFilter" class="form-label mb-0">Status:</label>
          </div>
          <div class="col">
            <select id="statusFilter" class="form-select">
              <option value="">All Status</option>
            </select>
          </div>`
        );
        $(".filter-container").append(statusFilterContainer);

        statusFilterContainer.find("#statusFilter").on("change", function () {
          const value = $(this).val();
          dataTable.column(5).search(value).draw();
        });

        this.api()
          .column(5)
          .data()
          .unique()
          .sort()
          .each(function (d) {
            statusFilterContainer
              .find("#statusFilter")
              .append(`<option value="${d}">${d}</option>`);
          });

        const createTemplateButton = $(`
            <button class="btn btn-primary w-100">
              <i class="mdi mdi-plus me-1"></i>Create Form Request
            </button>
          `);

        $(".create-template-btn").append(createTemplateButton);

        createTemplateButton.on("click", function () {
          $("#chooseTemplateModal").modal("show");
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
