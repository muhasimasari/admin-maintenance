"use strict";
new Quill("#full-editor", {
  bounds: "#full-editor",
  placeholder: "Add notes here...",
  modules: {
    formula: !0,
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link",],
      ["clean"],
    ],
  },
  theme: "snow",
});

"use strict";

$(function () {
  const tableElement = $(".datatables-milestone-table");

  if (tableElement.length) {
    const dataTable = tableElement.DataTable({
      ajax: {
        // url: "https://inspiro.xacloud.com/admin-workflow/assets/json/data-approval.json",
        url: "./assets/json/data-approval.json",
        dataSrc: "data",
      },
      columns: [
        { data: "step" },
        { 
          data: "approve_by",
          render: (data, type, row) => `
            <div>${row.approve_by}</div>
            <div class="d-flex align-items-center gap-2"><i class="mdi mdi-clock-time-four-outline"></i> ${row.approve_date}</div>
          `,
        },
        { data: "comments" },
        { 
          data: "status",
          render: (data, type, row) => {
            if (data === "Approved") {
              return `<i class="mdi mdi-check-circle text-success mdi-24px"></i>`;
            } else {
              return ``;
            }
          },
        },
      ],
      bLengthChange: false,
      bInfo: true,
      searching: false, // Nonaktifkan fitur pencarian
      order: [[0, "asc"]],
      dom: `<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>`,
      language: {
        sLengthMenu: "Show _MENU_",
        search: "",
        searchPlaceholder: "Search forms name or department",
      },
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


