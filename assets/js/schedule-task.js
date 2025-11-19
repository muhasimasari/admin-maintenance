"use strict";
$(function () {
  var datePickers = ["#daterange1", "#daterange2"];
  datePickers.forEach(function (selector) {
    var e = $(selector);

    if (e.length) {
      e.daterangepicker({
        opens: "right",
        ranges: {
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
        },
        locale: {
          format: "MM-DD-YYYY",
          direction: "ltr",
        },
        buttonClasses: "btn btn-sm my-2 mx-2",
      });
    }
  });
});
