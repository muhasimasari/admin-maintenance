document.addEventListener("DOMContentLoaded", function () {
  const failRadios = document.querySelectorAll('input.radio-fail[name="inspectionResult-1"]');
  const passRadios = document.querySelectorAll('input.radio-pass[name="inspectionResult-1"]');
  const failDetails = document.getElementById("failDetails-1");
  const hideBtn = document.getElementById("hideDetailsBtn-1");
  const fileInput = document.getElementById("documentationUpload-1");
  const previewContainer = document.getElementById("previewContainer-1");
  const uploadBox = document.getElementById("uploadBox-1");
  const bgSuccess = document.getElementById("insp-item");

  let isManuallyHidden = false;
  const bsCollapse = new bootstrap.Collapse(failDetails, { toggle: false });

  function isAnyFailChecked() {
    return Array.from(failRadios).some(radio => radio.checked);
  }

  function toggleFailDetails() {
    if (isAnyFailChecked()) {
      bsCollapse.show();
      hideBtn.style.display = "block";
      hideBtn.innerHTML = 'hide details <i class="mdi mdi-chevron-up"></i>';
      isManuallyHidden = false;
      bgSuccess.classList.remove("inspect-success");
    } else {
      bsCollapse.hide();
      hideBtn.setAttribute("style", "display: none !important");
      isManuallyHidden = false;
      bgSuccess.classList.add("inspect-success");
    }
  }

  failRadios.forEach(radio => {
    radio.addEventListener("change", toggleFailDetails);
  });

  passRadios.forEach(radio => {
    radio.addEventListener("change", toggleFailDetails);
  });

  hideBtn.addEventListener("click", function () {
    if (failDetails.classList.contains("show")) {
      bsCollapse.hide();
      hideBtn.innerHTML = 'show details <i class="mdi mdi-chevron-down"></i>';
      isManuallyHidden = true;
    } else {
      bsCollapse.show();
      hideBtn.innerHTML = 'hide details <i class="mdi mdi-chevron-up"></i>';
      isManuallyHidden = false;
    }
  });

  fileInput.addEventListener("change", function () {
    const files = Array.from(fileInput.files);
    const currentCount = previewContainer.querySelectorAll(".image-preview").length;

    if (currentCount >= 3) {
      alert("Maksimal 3 file.");
      fileInput.value = "";
      return;
    }

    const allowedCount = 3 - currentCount;
    const filesToAdd = files.slice(0, allowedCount);

    filesToAdd.forEach(file => {
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

  $(document).ready(function() {
    $('#categorySelect').select2({
      dropdownParent: $('#escalateModal') // Required to make search and dropdown work inside a modal
    });
  });
});
