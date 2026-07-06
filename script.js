// ===== Bigly Selling Price Calculator =====
// Hidden constant: packaging/extra cost, always added to Price Per Package
const PACKAGING_COST = 2; // ₹ fixed, not shown on screen

const DEFAULTS = {
  transport: 5,
  profitPercent: 15,
};

function getVal(id) {
  const el = document.getElementById(id);
  const val = parseFloat(el.value);
  return isNaN(val) ? 0 : val;
}

function hasVal(id) {
  const el = document.getElementById(id);
  return el.value.trim() !== "" && !isNaN(parseFloat(el.value)) && parseFloat(el.value) > 0;
}

function fmtRs(n) {
  if (!isFinite(n)) return "—";
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function calculate() {
  const pricePerKg = getVal("pricePerKg");
  const quantity = getVal("quantity");
  const wasteGram = getVal("waste");
  const transport = getVal("transport");
  const packingSizeGram = getVal("packingSize");
  const profitPercent = getVal("profitPercent");
  const marketProfitPercent = getVal("marketProfitPercent");

  const mrpProvided = hasVal("mrp");
  const mrp = getVal("mrp");

  // gram -> kg conversion
  const wasteKg = wasteGram / 1000;
  const packingSizeKg = packingSizeGram / 1000;

  const netQuantity = quantity - wasteKg;

  if (netQuantity <= 0 || quantity <= 0) {
    setResults(null);
    alert("Quantity, Waste se zyada honi chahiye. Values check karo.");
    return;
  }

  const netPurchasingPrice = ((pricePerKg * quantity) + transport) / netQuantity; // ₹ per kg
  const pricePerPackage = netPurchasingPrice * packingSizeKg;
  const netCPPP = pricePerPackage + PACKAGING_COST;

  const sellingPrice = netCPPP + (netCPPP * profitPercent / 100);
  const marketPrice = netCPPP + (netCPPP * marketProfitPercent / 100);

  const basePrice = mrpProvided ? mrp : marketPrice;
  const basePriceLabel = mrpProvided ? "MRP" : "Market Price";

  const discount = basePrice - sellingPrice;
  const discountPercent = basePrice > 0 ? (discount / basePrice) * 100 : 0;

  setResults({
    basePriceLabel,
    basePrice,
    discount,
    discountPercent,
    unit: packingSizeGram ? packingSizeGram + " g" : "—",
    sellingPrice,
  });
}

function setResults(data) {
  const basePriceLabelEl = document.getElementById("basePriceLabel");
  const basePriceValueEl = document.getElementById("basePriceValue");
  const discountValueEl = document.getElementById("discountValue");
  const discountPercentValueEl = document.getElementById("discountPercentValue");
  const unitValueEl = document.getElementById("unitValue");
  const sellingPriceValueEl = document.getElementById("sellingPriceValue");

  if (!data) {
    basePriceLabelEl.textContent = "MRP / Market Price";
    basePriceValueEl.textContent = "—";
    discountValueEl.textContent = "—";
    discountPercentValueEl.textContent = "—";
    unitValueEl.textContent = "—";
    sellingPriceValueEl.textContent = "—";
    return;
  }

  basePriceLabelEl.textContent = data.basePriceLabel;
  basePriceValueEl.textContent = fmtRs(data.basePrice);
  discountValueEl.textContent = fmtRs(data.discount);
  discountPercentValueEl.textContent = data.discountPercent.toLocaleString("en-IN", { maximumFractionDigits: 2 }) + "%";
  unitValueEl.textContent = data.unit;
  sellingPriceValueEl.textContent = fmtRs(data.sellingPrice);
}

function resetForm() {
  document.getElementById("pricePerKg").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("waste").value = "";
  document.getElementById("transport").value = DEFAULTS.transport;
  document.getElementById("packingSize").value = "";
  document.getElementById("profitPercent").value = DEFAULTS.profitPercent;
  document.getElementById("mrp").value = "";
  document.getElementById("marketProfitPercent").value = "";
  setResults(null);
}

document.getElementById("calculateBtn").addEventListener("click", calculate);
document.getElementById("resetBtn").addEventListener("click", resetForm);
