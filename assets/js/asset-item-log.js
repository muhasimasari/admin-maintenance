function CtrlAssetLogs() {
    this.init = init


    function init() {
        initComponent()
    }

    //
    function initComponent() {
        $(document).ready(function (e) {
            const selectDate = document.querySelectorAll(
                "#dtpDateBegin, #dtpDateEnd"
            );

            selectDate.forEach(function (element) {
                element.flatpickr({
                    monthSelectorType: "static"
                });
            });

            $("#cmbType").change(function () {
                if ($("#cmbType").val() == 1) {
                    $("#divTbMtc2").show();
                    $("#divTbMtc1").hide();
                } else {
                    $("#divTbMtc2").hide();
                    $("#divTbMtc1").show();
                }
            });

            
        })
    }
}