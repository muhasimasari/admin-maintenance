document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi awal Select2
  $(".select2").select2({
    dropdownParent: $('#MTCTask')
  });

  // -----------------------
  // Inline Editing Functionality
  // -----------------------
  function enableEdit(cellElement, initialValue, fieldType) {
    cellElement.dataset.originalContent = cellElement.innerHTML;
    cellElement.innerHTML = "";

    const input = document.createElement("input");
    input.className = "input-field form-control form-control-sm";
    input.value = initialValue.trim();

    if (fieldType === "start-date") {
      input.type = "date";
    } else if (fieldType === "usage-km") {
      input.type = "number";
      input.step = "0.001";
    }

    const saveButton = document.createElement("button");
    saveButton.className =
      "btn btn-sm shadow-none custom-bg-text-success ms-1 p-0";
    saveButton.innerHTML = '<i class="mdi mdi-check"></i>';
    saveButton.title = "Save";

    const saveAllButton = document.createElement("button");
    saveAllButton.className = "btn btn-sm shadow-none bg-text-primary ms-1 p-0";
    saveAllButton.innerHTML = '<i class="mdi mdi-check-all"></i>';
    saveAllButton.title = "Save";

    const cancelButton = document.createElement("button");
    cancelButton.className =
      "btn btn-sm shadow-none custom-bg-text-danger ms-1 p-0";
    cancelButton.innerHTML = '<i class="mdi mdi-close"></i>';
    cancelButton.title = "Cancel";

    const wrapper = document.createElement("div");
    wrapper.className = "d-flex gap-2 items-center";
    wrapper.appendChild(input);
    wrapper.appendChild(saveButton);
    wrapper.appendChild(saveAllButton);
    wrapper.appendChild(cancelButton);
    cellElement.appendChild(wrapper);

    input.focus();

    saveButton.addEventListener("click", () => {
      let newValue = input.value;
      if (fieldType === "start-date" && newValue) {
        const date = new Date(newValue);
        newValue = date
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, " ");
      }

      cellElement.innerHTML = `<span class="value-display">${newValue}</span>
          <button class="btn btn-sm shadow-none btn-text-primary px-0 py-0 ms-2 edit-button" data-field="${fieldType}">
            <i class="mdi mdi-20px mdi-pencil"></i>
          </button>`;
      attachEditListeners();
    });

    cancelButton.addEventListener("click", () => {
      cellElement.innerHTML = cellElement.dataset.originalContent;
      attachEditListeners();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveButton.click();
      } else if (e.key === "Escape") {
        cancelButton.click();
      }
    });
  }

  function attachEditListeners() {
    document.querySelectorAll(".edit-button").forEach((button) => {
      const oldButton = button.cloneNode(true);
      button.parentNode.replaceChild(oldButton, button);

      oldButton.addEventListener("click", (event) => {
        const cell = event.target.closest("td");
        const valueDisplay = cell.querySelector(".value-display");
        const initialValue = valueDisplay ? valueDisplay.textContent : "";
        const fieldType = oldButton.dataset.field;
        enableEdit(cell, initialValue, fieldType);
      });
    });
  }

  attachEditListeners();
});
