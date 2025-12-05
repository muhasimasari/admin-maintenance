// ==========================================================
// DATA STORE
// ==========================================================
let costData = {
  labor: [],
  vendor: [],
  adhoc: [],
  registered: [],
};

// Modal element cache
let itemModalInstance = null; // Will be initialized on DOMContentLoaded
const modalForm = document.getElementById("modal-form");

// ==========================================================
// INITIALIZATION
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the Bootstrap Modal
  itemModalInstance = new bootstrap.Modal(
    document.getElementById("item-modal")
  );

  // Add initial demo data
  costData.labor.push({
    itemNum: "I-2024-01-11-0001",
    item: "Oil Change Service",
    currency: "IDR",
    rate: 1,
    cost: 100000,
    qty: 1,
  });

  costData.vendor.push({
    itemNum: "I-2024-01-11-0002",
    item: "ABC Workshop",
    currency: "IDR",
    rate: 1,
    cost: 250000,
    qty: 1,
  });

  costData.adhoc.push({
    itemNum: "I-2024-01-11-0003",
    item: "Shell Helix HX-8 Gallon",
    currency: "IDR",
    rate: 1,
    cost: 350000,
    qty: 1,
  });

  costData.registered.push({
    asset: "Oil Filter",
    itemNum: "I-2024-01-11-0004",
    currency: "IDR",
    rate: 1,
    cost: 50000,
    qty: 1,
  });

  costData.registered.push({
    asset: "Klip Body",
    itemNum: "I-2024-01-11-0005",
    currency: "IDR",
    rate: 1,
    cost: 5000,
    qty: 50,
  });

  // Initial render
  renderListsAndCalculateTotal();
});

// ==========================================================
// MODAL FUNCTIONS
// ==========================================================

/**
 * Opens the modal to add or edit an item.
 * @param {string} section - 'labor', 'vendor', 'adhoc', 'registered'
 * @param {number|null} index - The index of the item to edit, or null to add.
 */
function openModal(section, index = null) {
  modalForm.reset(); // Clear previous data

  // Store section and index
  document.getElementById("modal-edit-section").value = section;
  document.getElementById("modal-edit-index").value =
    index === null ? "" : index;

  // Get field wrappers
  const fieldItem = document.getElementById("modal-field-item");
  const fieldQty = document.getElementById("modal-field-qty");
  const fieldAsset = document.getElementById("modal-field-asset");
  const fieldItemNum = document.getElementById("modal-field-item-num");
  const costLabel = document.getElementById("modal-cost-label");

  // Configure modal for section
  fieldItem.style.display = "none";
  fieldQty.style.display = "none";
  fieldAsset.style.display = "none";
  fieldItemNum.style.display = "none";
  costLabel.textContent = "Cost";

  if (section === "labor" || section === "vendor") {
    fieldItem.style.display = "block";
  } else if (section === "adhoc") {
    fieldItem.style.display = "block";
    fieldQty.style.display = "block";
    costLabel.textContent = "Unit Cost";
  } else if (section === "registered") {
    fieldAsset.style.display = "block";
    fieldItemNum.style.display = "block";
    costLabel.textContent = "Unit Cost";
  }

  // Set title and load data if editing
  const title =
    (index === null ? "Add" : "Edit") +
    " " +
    section.charAt(0).toUpperCase() +
    section.slice(1);
  document.getElementById("modal-title-label").textContent = title;

  if (index !== null) {
    // Edit mode: Load data into form
    const item = costData[section][index];
    if (item.item) document.getElementById("modal-item").value = item.item;
    if (item.asset) document.getElementById("modal-asset").value = item.asset;
    if (item.itemNum)
      document.getElementById("modal-item-num").value = item.itemNum;
    if (item.qty) document.getElementById("modal-qty").value = item.qty;
    if (item.currency)
      document.getElementById("modal-currency").value = item.currency;
    if (item.rate) document.getElementById("modal-rate").value = item.rate;
    if (item.cost) document.getElementById("modal-cost").value = item.cost;
  } else {
    // Add mode: ensure rate is 1 for IDR default
    document.getElementById("modal-rate").value = 1;
  }

  // PERUBAHAN: Panggil updateModalRate untuk mengatur visibilitas Rate field saat modal dibuka
  updateModalRate(document.getElementById("modal-currency"));

  // Show modal
  itemModalInstance.show();
}

/**
 * Closes the modal. (Called by saveItem)
 */
function closeModal() {
  itemModalInstance.hide();
}

/**
 * Saves the item from the modal to the data store.
 */
function saveItem() {
  const section = document.getElementById("modal-edit-section").value;
  const indexStr = document.getElementById("modal-edit-index").value;
  const index = indexStr === "" ? null : parseInt(indexStr);

  // Collect data from form
  const itemData = {
    item: document.getElementById("modal-item").value,
    asset: document.getElementById("modal-asset").value,
    itemNum: document.getElementById("modal-item-num").value,
    qty: parseFloat(document.getElementById("modal-qty").value) || 1,
    currency: document.getElementById("modal-currency").value,
    rate: parseFloat(document.getElementById("modal-rate").value) || 1,
    cost: parseFloat(document.getElementById("modal-cost").value) || 0,
  };

  // FIX 3: Removed large block of invalid text that was here.

  if (index === null) {
    // Add new item
    costData[section].push(itemData);
  } else {
    // Update existing item
    costData[section][index] = itemData;
  }

  renderListsAndCalculateTotal();
  closeModal();
}

/**
 * Updates the modal's rate input when currency changes.
 */
function updateModalRate(selectElement) {
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const rate = selectedOption.getAttribute("data-rate");
  const rateInput = document.getElementById("modal-rate");
  const rateFieldWrapper = document.getElementById("modal-field-rate");

  // PERUBAHAN: Sembunyikan rate field jika IDR, tampilkan jika mata uang lain
  if (selectElement.value === "IDR") {
    rateInput.value = 1;
    rateFieldWrapper.style.display = "none";
  } else {
    rateInput.value = rate || 1;
    rateFieldWrapper.style.display = "block";
  }
}

// ==========================================================
// DATA RENDERING AND CALCULATION
// ==========================================================

/**
 * Removes an item from the data store and re-renders.
 * @param {string} section - 'labor', 'vendor', 'adhoc', 'registered'
 * @param {number} index - The index of the item to remove.
 */
function removeItem(section, index) {
  // Optional: Add a confirmation dialog here
  // if (confirm('Are you sure you want to remove this item?')) {
  costData[section].splice(index, 1);
  renderListsAndCalculateTotal();
  // }
}

/**
 * Formats a number into IDR currency format (using en-US locale)
 */
function formatCurrency(value) {
  if (isNaN(value)) value = 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Renders all lists from the costData and calculates all totals.
 * This is the main function to update the UI.
 */
function renderListsAndCalculateTotal() {
  let grandTotal = 0;

  ["labor", "vendor", "adhoc", "registered"].forEach((section) => {
    const container = document.getElementById(`${section}-items`);
    container.innerHTML = ""; // Clear existing list
    let sectionTotal = 0;

    // MODIFIED: Check for empty state
    if (costData[section].length === 0) {
      container.innerHTML = `
        <li class="list-group-item">
          <div class="text-center text-muted py-3 border-2 border-dashed border-gray-200 rounded-lg">
            <p class="mb-0">No items added for this section.</p>
          </div>
        </li>
      `;
    } else {
      costData[section].forEach((item, index) => {
        const itemTotalCost =
          (item.cost || 0) * (item.qty || 1) * (item.rate || 1);
        sectionTotal += itemTotalCost;

        // Create the display HTML for the item
        const itemHtml = createItemDisplayHtml(
          section,
          item,
          index,
          itemTotalCost
        );
        container.insertAdjacentHTML("beforeend", itemHtml);
      });
    }

    // Update subtotal
    document.getElementById(`${section}-subtotal`).textContent =
      formatCurrency(sectionTotal);
    grandTotal += sectionTotal;
  });

  // Update grand total
  document.getElementById("total-cost").textContent =
    formatCurrency(grandTotal);
}

/**
 * Helper function to create the display HTML for a single item.
 * MODIFIED: To output Bootstrap-compatible HTML (list-group-item)
 */
function createItemDisplayHtml(section, item, index, itemTotalCost) {
  let primaryInfo = "";

  // --- PERUBAHAN: Logika secondary info disederhanakan ---
  let secondaryInfoParts = [];
  if (section === "adhoc" || section === "registered") {
    // PERUBAHAN 5: Label diubah menjadi "Qty Used"
    secondaryInfoParts.push(`Qty Used: ${item.qty}`);
  }

  let secondaryInfo = "";
  if (section === "registered") {
    // PERUBAHAN 3: Menghapus item.itemNum dari info sekunder
    secondaryInfo = `${secondaryInfoParts.join(" | ")}`;
  } else {
    secondaryInfo = secondaryInfoParts.join(" | ");
  }

  // PERUBAHAN 4: Menghapus cek item.itemNum dari logika fallback
  if (secondaryInfo.trim() === "") {
    if (section === "registered") {
      // secondaryInfo = `<small class="d-block text-muted mt-1">(${item.itemNum})</small>`;
      secondaryInfo = ""; // Dikosongkan karena itemNum sudah pindah
    } else {
      secondaryInfo = ""; // Kosongkan jika tidak ada info
    }
  } else {
    secondaryInfo = `<small class="d-block text-muted mt-1">${secondaryInfo}</small>`;
  }
  // --- Akhir Perubahan Secondary Info ---

  if (section === "labor" || section === "vendor") {
    primaryInfo = `<span class="fw-semibold text-black-custom">${item.item} (${item.itemNum})</span>`;
  } else if (section === "adhoc") {
    primaryInfo = `<span class="fw-semibold text-black-custom">${item.item} (${item.itemNum})</span>`;
  } else if (section === "registered") {
    // PERUBAHAN 5: Menambahkan item.itemNum ke info utama
    primaryInfo = `<span class="fw-semibold text-black-custom">${item.asset} (${item.itemNum})</span>`;
  }

  // --- PERUBAHAN: Logika tampilan harga (Cost Display) ---
  let costDisplayHtml = "";
  const originalTotalCost = (item.cost || 0) * (item.qty || 1);

  if (item.currency === "IDR" || !item.currency) {
    // Jika IDR, tampilkan hanya harga IDR
    costDisplayHtml = `<span class="fw-bold fs-6 text-black-custom">${formatCurrency(
      itemTotalCost
    )}</span>`;
  } else {
    const originalCostFormatted = new Intl.NumberFormat("en-US", {
      currency: item.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(originalTotalCost);

    costDisplayHtml = `
      <div class="d-flex gap-2 justify-content-between align-items-center">
        <span class="d-flex flex-column text-black-custom me-3 text-start" style="font-size: 0.9rem;" title="Original Cost">
          <span class="fw-semibold fs-6">${
            item.currency
          } ${originalCostFormatted}</span>
          <small class="text-muted">Rate: ${
            item.currency
          } @ ${new Intl.NumberFormat("en-US").format(item.rate)}</small>
        </span>
        <span class="fw-semibold fs-6 text-black-custom" title="Calculated IDR Cost">
          ${formatCurrency(itemTotalCost)}
        </span>
      </div>
    `;
  }
  // --- Akhir Perubahan Cost Display ---

  // MODIFIED: Replaced entire HTML structure with Bootstrap layout
  return `
    <li class="list-group-item d-flex flex-wrap align-items-center py-3 bg-label-primary rounded-2 mb-3">
      <!-- Info (Primary & Secondary) -->
      <div class="col-12 col-md-6 mb-2 mb-md-0">
        ${primaryInfo}
        ${secondaryInfo} <!-- Menggunakan secondary info baru -->
      </div>
      
      <!-- Total Cost (Formatted) -->
      <div class="col-12 col-md-3 text-start text-md-end">
        ${costDisplayHtml} <!-- Menggunakan cost display baru -->
      </div>
      
      <!-- Actions (Buttons with Icons) -->
      <div class="col-6 col-md-3 d-flex justify-content-end align-items-center list-item-actions">
        <button type="button" title="Edit Item" onclick="openModal('${section}', ${index})" class="btn btn-text-primary px-2 text-capitalize">
          Edit
        </button>
        <button type="button" title="Remove Item" onclick="removeItem('${section}', ${index})" class="btn btn-text-danger px-2 text-capitalize">
          Remove
        </button>
      </div>
    </li>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  flatpickr(".flatpickr-date", {
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "j F Y", // Format tampilan: 22 November 2025
    allowInput: true,
  });
});

$(document).ready(function () {
  // Inisialisasi Select2 dengan tema bootstrap-5
  $("#engineer").select2({
    width: "100%",
  });
  $("#vendor").select2({
    width: "100%",
  });
  $("#rootCauseCategory").select2({
    width: "100%",
  });
});

const btnResolved = document.getElementById("btn-resolved");
const btnNotResolved = document.getElementById("btn-not-resolved");

// Definisi Objek Warna dalam JS (Pengganti CSS Classes)
const styles = {
  success: {
    backgroundColor: "#d1e7dd",
    color: "#0f5132",
    borderColor: "#badbcc",
  },
  danger: {
    backgroundColor: "#f8d7da",
    color: "#842029",
    borderColor: "#f5c2c7",
  },
  secondary: {
    // Warna Abu-abu (Inactive)
    backgroundColor: "#e9ecef",
    color: "#6c757d",
    borderColor: "#dee2e6",
  },
};

// Fungsi Helper untuk menerapkan style
function applyStyle(element, styleName) {
  const style = styles[styleName];
  element.style.backgroundColor = style.backgroundColor;
  element.style.color = style.color;
  element.style.borderColor = style.borderColor;
}

// 1. Set Initial State saat Load (Resolved Aktif, Not Resolved Inaktif)
applyStyle(btnResolved, "success");
applyStyle(btnNotResolved, "secondary");

// 2. Event Listener Click untuk Resolved
btnResolved.addEventListener("click", function () {
  applyStyle(btnResolved, "success"); // Set diri sendiri jadi Hijau
  applyStyle(btnNotResolved, "secondary"); // Set tombol lain jadi Abu
});

// 3. Event Listener Click untuk Not Resolved
btnNotResolved.addEventListener("click", function () {
  applyStyle(btnNotResolved, "danger"); // Set diri sendiri jadi Merah
  applyStyle(btnResolved, "secondary"); // Set tombol lain jadi Abu
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Flatpickr
  flatpickr("#datePicker1", {
    dateFormat: "d-m-Y",
    wrap: true,
    allowInput: true,
    static: true,
  });
  $(".select2-basic").select2({
    width: "100%",
    placeholder: "Select Option",
    allowClear: true,
    dropdownParent: $("#caModal"), // Important: Attach to modal to avoid scrolling issues/z-index issues
  });
});
