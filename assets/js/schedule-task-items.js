document.addEventListener("DOMContentLoaded", function () {
  const failRadios = document.querySelectorAll(
    'input.radio-fail[name="inspectionResult-1"]'
  );
  const passRadios = document.querySelectorAll(
    'input.radio-pass[name="inspectionResult-1"]'
  );
  const failDetails = document.getElementById("failDetails-1");
  const hideBtn = document.getElementById("hideDetailsBtn-1");
  const fileInput = document.getElementById("documentationUpload-1");
  const previewContainer = document.getElementById("previewContainer-1");
  const uploadBox = document.getElementById("uploadBox-1");
  const bgSuccess = document.getElementById("insp-item");

  const failDetailsCollapse = new bootstrap.Collapse(failDetails, {
    toggle: false,
  });

  function isAnyFailChecked() {
    return Array.from(failRadios).some((radio) => radio.checked);
  }

  function toggleFailDetails() {
    if (isAnyFailChecked()) {
      failDetailsCollapse.show();
      hideBtn.style.display = "block";
      bgSuccess.classList.remove("inspect-success");
    } else {
      failDetailsCollapse.hide();
      hideBtn.setAttribute("style", "display: none !important");
      bgSuccess.classList.add("inspect-success");
    }
  }

  failRadios.forEach((radio) =>
    radio.addEventListener("change", toggleFailDetails)
  );
  passRadios.forEach((radio) =>
    radio.addEventListener("change", toggleFailDetails)
  );

  // === Sync label tombol dengan collapse event ===
  failDetails.addEventListener("show.bs.collapse", () => {
    hideBtn.innerHTML = 'hide details <i class="mdi mdi-chevron-up"></i>';
  });
  failDetails.addEventListener("hide.bs.collapse", () => {
    hideBtn.innerHTML = 'show details <i class="mdi mdi-chevron-down"></i>';
  });

  hideBtn.addEventListener("click", function () {
    if (failDetails.classList.contains("show")) {
      failDetailsCollapse.hide();
    } else {
      failDetailsCollapse.show();
    }
  });

  // === file upload handler tetap sama ===
  fileInput.addEventListener("change", function () {
    const files = Array.from(fileInput.files);
    const currentCount =
      previewContainer.querySelectorAll(".image-preview").length;

    if (currentCount >= 3) {
      alert("Maksimal 3 file.");
      fileInput.value = "";
      return;
    }

    const allowedCount = 3 - currentCount;
    const filesToAdd = files.slice(0, allowedCount);

    filesToAdd.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const wrapper = document.createElement("div");
          wrapper.className = "image-preview position-relative";

          const img = document.createElement("img");
          img.src = e.target.result;
          img.className = "img-thumbnail";

          const del = document.createElement("button");
          del.className = "delete-btn";
          del.innerText = "DELETE";
          del.onclick = function () {
            previewContainer.removeChild(wrapper);
            updateUploadBoxVisibility();
          };

          wrapper.appendChild(img);
          wrapper.appendChild(del);
          previewContainer.appendChild(wrapper);
          updateUploadBoxVisibility();
        };
        reader.readAsDataURL(file);
      }
    });

    fileInput.value = "";
  });

  function updateUploadBoxVisibility() {
    const count = previewContainer.querySelectorAll(".image-preview").length;
    uploadBox.style.display = count >= 3 ? "none" : "flex";
  }

  // === select2 & flatpickr tetap sama ===
  $("#categorySelect").select2({ dropdownParent: $("#escalateModal") });
  $("#categorySelect1").select2({
    dropdownParent: $("#escalateNotStartedModal"),
  });
  $(
    "#rootCauseSelect, #rootCauseSelect2, #engineerSelect, #vendorSelect"
  ).select2({
    dropdownParent: $("#caModal"),
  });

  flatpickr("#startDate", {
    dateFormat: "Y-m-d",
    allowInput: true,
  });

  // === Universal Collapse Icon Rotator ===
  document.querySelectorAll(".collapse").forEach((collapseEl) => {
    const collapseInstance = new bootstrap.Collapse(collapseEl, {
      toggle: false,
    });

    const targetId = "#" + collapseEl.id;
    const icons = document.querySelectorAll(
      `.custom-toggle-icon[data-bs-target="${targetId}"], 
       [data-bs-target="${targetId}"] .custom-toggle-icon`
    );

    collapseEl.addEventListener("show.bs.collapse", () => {
      icons.forEach((icon) => icon.classList.add("rotate"));
    });
    collapseEl.addEventListener("hide.bs.collapse", () => {
      icons.forEach((icon) => icon.classList.remove("rotate"));
    });
  });
});

$(document).ready(function () {
  $("#engineerSelect").select2({
    placeholder: "Select Engineer",
    allowClear: true,
  });

  $("#vendorSelect").select2({
    placeholder: "Select Vendor",
    allowClear: true,
  });
});
