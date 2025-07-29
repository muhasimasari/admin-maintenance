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
            <a class="fw-bold" href="./detail-approval-form.html"><u>${row.req_code}</u></a>
          `,
        },
        { data: "form_name" },
        { data: "deadline" },
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
            <div class="d-flex align-items-center">
              <a href="javascript:void(0);" class="btn btn-danger btn-sm me-2" data-bs-toggle="modal" data-bs-target="#declineModal">
                Decline <i class="mdi mdi-close ms-1"></i>
              </a>
              <a href="javascript:void(0);" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#approveModal">
                Approve<i class="mdi mdi-check ms-1"></i>
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
          <"col-md-8 col-sm-12 order-sm-0"<"filter-container">>
          <"col-md-4 col-sm-12 order-sm-1"
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
        const statusFilterContainer = $(`
          <div class="col-auto">
              <label for="statusFilter" class="form-label mb-0">Status:</label>
          </div>
          <div class="col">
            <select id="statusFilter" class="form-select">
              <option value="">All Status</option>
            </select>
          </div>
        `);

        const colorFilterContainer = $(`
          <div class="col-auto">
            <label for="colorFilter" class="form-label mb-0">Form Color:</label>
          </div>
          <div class="col">
            <select id="colorFilter" class="form-select">
              <option value="">All Colors</option>
            </select>
          </div>
        `);

        $(".filter-container").append(
          statusFilterContainer,
          colorFilterContainer
        );

        // Handle status filter change
        statusFilterContainer.find("#statusFilter").on("change", function () {
          const value = $(this).val();
          dataTable.column(5).search(value).draw();
        });

        // Handle color filter change
        colorFilterContainer.find("#colorFilter").on("change", function () {
          const value = $(this).val();
          dataTable.column(0).search(value).draw(); // Column 0 holds the color
        });

        // Populate the status filter options
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

        // Initialize Select2 on the color filter dropdown
        colorFilterContainer.find("#colorFilter").select2({
          minimumResultsForSearch: Infinity, // Disable search input
          templateResult: function (data) {
            if (!data.id) {
              return data.text;
            }

            // Create the option with an icon
            const option = $('<span><i class="mdi mdi-circle" style="color: ' + data.id + ';"></i> ' + data.text + '</span>');
            return option;
          },
          templateSelection: function (data) {
            return data.text; // This is the selected value
          }
        });

        const uniqueColors = [];
        this.api()
          .column(0)
          .data()
          .each(function (color) {
            if (!uniqueColors.includes(color)) {
              uniqueColors.push(color);
            }
          });

        uniqueColors.forEach(function (color) {
          colorFilterContainer.find("#colorFilter").append(`
            <option value="${color}">${color}</option>
          `);
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

    // JavaScript functions to show modals
    function showDeclineModal(itemId) {
      // You can customize the modal's action based on itemId if necessary
      $('#declineModal').modal('show');

      // Attach event for decline confirmation
      $('#confirmDecline').off('click').on('click', function() {
        // Handle decline action (e.g., sending a request to server)
        console.log('Declined item with ID:', itemId);
        $('#declineModal').modal('hide');
      });
    }

    function showApproveModal(itemId) {
      // You can customize the modal's action based on itemId if necessary
      $('#approveModal').modal('show');

      // Attach event for approve confirmation
      $('#confirmApprove').off('click').on('click', function() {
        // Handle approve action (e.g., sending a request to server)
        console.log('Approved item with ID:', itemId);
        $('#approveModal').modal('hide');
      });
    }
  }
});
