document.addEventListener("DOMContentLoaded", function () {
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
    CHF: "CHF",
    CNY: "¥",
    INR: "₹",
    PHP: "₱",
    SGD: "S$",
    HKD: "HK$",
    SAR: "﷼",
    AED: "د.إ",
    BRL: "R$",
    MXN: "Mex$",
    RUB: "₽",
    ZAR: "R",
    KRW: "₩",
    THB: "฿",
    IDR: "Rp",
    MYR: "RM",
    AFN: "؋",
    ALL: "L",
    DZD: "د.ج",
    AOA: "Kz",
    ARS: "$",
    AMD: "֏",
    AWG: "ƒ",
    AZN: "₼",
    BSD: "B$",
    BHD: ".د.ب",
    BDT: "৳",
    BBD: "Bds$",
    BYN: "Br",
    BZD: "BZ$",
    BMD: "$",
    BTN: "Nu.",
    BOB: "Bs.",
    BAM: "KM",
    BWP: "P",
    NOK: "kr",
    BGN: "лв",
    BIF: "FBu",
    CVE: "$",
    KHR: "៛",
    XAF: "FCFA",
    XOF: "CFA",
    XPF: "₣",
    CLP: "$",
    COP: "$",
    KMF: "CF",
    CDF: "FC",
    CRC: "₡",
    HRK: "kn",
    CUP: "₱",
    CZK: "Kč",
    DKK: "kr",
    DJF: "Fdj",
    DOP: "RD$",
    EGP: "£",
    SVC: "$",
    ERN: "Nfk",
    SZL: "E",
    ETB: "Br",
    FJD: "$",
    GMD: "D",
    GEL: "₾",
    GHS: "₵",
    GIP: "£",
    GTQ: "Q",
    GNF: "FG",
    GYD: "$",
    HTG: "G",
    HNL: "L",
    HUF: "Ft",
    ISK: "kr",
    IRR: "﷼",
    IQD: "ع.د",
    ILS: "₪",
    JMD: "J$",
    JOD: "د.ا",
    KZT: "₸",
    KES: "KSh",
    KWD: "د.ك",
    KGS: "лв",
    LAK: "₭",
    LBP: "ل.ل",
    LSL: "M",
    LRD: "$",
    LYD: "ل.د",
    MOP: "MOP$",
    MKD: "ден",
    MGA: "Ar",
    MWK: "MK",
    MVR: "Rf",
    MRU: "UM",
    MUR: "₨",
    MNT: "₮",
    MAD: "د.م.",
    MZN: "MT",
    MMK: "K",
    NAD: "$",
    NPR: "₨",
    ANG: "ƒ",
    NZD: "NZ$",
    NIO: "C$",
    NGN: "₦",
    OMR: "﷼",
    PKR: "₨",
    PGK: "K",
    PYG: "₲",
    PEN: "S/",
    QAR: "﷼",
    RON: "lei",
    RWF: "FRw",
    WST: "T",
    STN: "Db",
    SHP: "£",
    SLL: "Le",
    SOS: "Sh.So.",
    SSP: "£",
    LKR: "Rs",
    SDG: "£",
    SRD: "$",
    SEK: "kr",
    SYP: "£",
    TWD: "NT$",
    TJS: "ЅM",
    TZS: "TSh",
    TOP: "T$",
    TTD: "TT$",
    TND: "د.ت",
    TMT: "T",
    UGX: "USh",
    UAH: "₴",
    UYU: "$U",
    UZS: "soʻm",
    VUV: "VT",
    VES: "Bs.S",
    VND: "₫",
    YER: "﷼",
    ZMW: "K",
    ZWL: "$",
  };

  // Store currency symbols in localStorage for use across files
  localStorage.setItem("currencySymbols", JSON.stringify(currencySymbols));

  const currencyModal = document.getElementById("currencyModal");
  const changeCurrencyBtn = document.getElementById("changeCurrency");
  const cancelCurrencyBtn = document.getElementById("cancelCurrency");
  const confirmCurrencyBtn = document.getElementById("confirmCurrency");
  const currencySelect = document.getElementById("currencySelect");
  const currencySymbol = document.getElementById("currencySymbol");
  const selectedCurrencyInput = document.getElementById("selectedCurrency");

  function hideModal() {
    currencyModal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function showModal() {
    currencyModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  // Update currency display and storage
  function updateCurrency(currency) {
    currencySymbol.textContent = currencySymbols[currency] || currency;
    selectedCurrencyInput.value = currency;
    localStorage.setItem("userCurrency", currency);
    localStorage.setItem(
      "userCurrencySymbol",
      currencySymbols[currency] || currency
    );
  }

  // Initialize currency
  function initializeCurrency() {
    const savedCurrency = localStorage.getItem("userCurrency") || "USD";
    currencySelect.value = savedCurrency;
    updateCurrency(savedCurrency);
  }

  // Event Listeners
  changeCurrencyBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showModal();
  });

  confirmCurrencyBtn?.addEventListener("click", () => {
    const selectedCurrency = currencySelect.value;
    updateCurrency(selectedCurrency);
    hideModal();
  });

  cancelCurrencyBtn?.addEventListener("click", hideModal);

  // Close modal on background click
  currencyModal?.addEventListener("click", (e) => {
    if (e.target === currencyModal) hideModal();
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !currencyModal.classList.contains("hidden")) {
      hideModal();
    }
  });

  // Form submission check
  document.getElementById("voyageForm")?.addEventListener("submit", (e) => {
    if (!selectedCurrencyInput.value) {
      e.preventDefault();
      alert("Please select a currency first");
      showModal();
    }
  });

  // Initialize when page loads
  initializeCurrency();
});
