function CtrlDiscrepancyReportList() {
  this.init = init

  function init() {
    initComponent()
  }

  function initComponent() {
    $(document).ready(function () {
      $('#target').select2({
        placeholder: $(this).data('placeholder'),
      });
      $('#severity').select2({
        placeholder: $(this).data('placeholder'),
      });
      $('#status').select2({
        placeholder: $(this).data('placeholder'),
      });
      $('#source').select2({
        placeholder: $(this).data('placeholder'),
      });

    });
  }
}

function CtrlDiscrepancyReportAdd() {
  this.init = init

  function init() {
    initComponent()
  }

  function initComponent() {
    $(document).ready(function () {

      function toggleTarget() {
        const value = $("#target").val();

        if (value === "asset") {
          $(".chooseAsset").show();
          $(".chooseLocation").hide();
        } else if (value === "location") {
          $(".chooseAsset").hide();
          $(".chooseLocation").show();
        }
      }

      // Jalankan saat pertama kali halaman dimuat
      toggleTarget();

      // Jalankan saat ada perubahan pada select
      $("#target").on("change", toggleTarget);

      $('#target').select2({
        placeholder: $(this).data('placeholder'),
      });
      $('#severity').select2({
        placeholder: $(this).data('placeholder'),
      });
      $('#status').select2({
        placeholder: $(this).data('placeholder'),
      });
      $('#source').select2({
        placeholder: $(this).data('placeholder'),
      });

      function formatColor(option) {
        if (!option.id) return option.text;
        var color = $(option.element).data('color');
        var $option = $(`
            <span>
              <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background-color:${color};margin-right:8px;"></span>
              ${option.text}
            </span>
          `);
        return $option;
      }

      $('#colorFilter').select2({
        templateResult: formatColor,
        templateSelection: formatColor,
        width: '100%',
      });

    });

    const buttons = document.querySelectorAll('#priorityToggle .btn');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Hapus warna dan 'active' dari semua tombol
        buttons.forEach(b => {
          b.classList.remove('active', 'btn-success', 'btn-warning', 'btn-danger', 'btn-dark');
          b.classList.add('btn-outline-secondary');
        });

        // Tambahkan warna sesuai data-priority
        const priority = this.getAttribute('data-priority');
        this.classList.remove('btn-outline-secondary');
        this.classList.add('active');

        if (priority === 'LOW') this.classList.add('btn-success');
        if (priority === 'MEDIUM') this.classList.add('btn-warning');
        if (priority === 'HIGH') this.classList.add('btn-danger');
        if (priority === 'CRITICAL') this.classList.add('btn-dark');
      });
    });
  }
}

