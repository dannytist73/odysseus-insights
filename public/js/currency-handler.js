// public/js/currency-handler.js
document.addEventListener("DOMContentLoaded", function () {
  const countrySelect = document.getElementById("initialCountrySelect");
  const currencySymbol = document.querySelector(".currency-symbol");
  const budgetInput = document.querySelector('input[name="budget"]');
  const form = document.getElementById("voyageForm");

  // Predefined currency symbols for fallback
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

  // Add hidden inputs for currency data
  let sourceCurrencyInput = document.createElement("input");
  sourceCurrencyInput.type = "hidden";
  sourceCurrencyInput.name = "sourceCurrency";
  form.appendChild(sourceCurrencyInput);

  let targetCurrencyInput = document.createElement("input");
  targetCurrencyInput.type = "hidden";
  targetCurrencyInput.name = "targetCurrency";
  form.appendChild(targetCurrencyInput);

  // Fetch countries and currencies from REST Countries API
  async function fetchCountriesAndCurrencies() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countries = await response.json();

      // Sort countries by name
      countries.sort((a, b) => a.name.common.localeCompare(b.name.common));

      // Clear existing options except the placeholder
      while (countrySelect.options.length > 1) {
        countrySelect.remove(1);
      }

      // Populate country select
      for (const country of countries) {
        if (country.currencies) {
          const currencyCode = Object.keys(country.currencies)[0];
          const currencyInfo = country.currencies[currencyCode];

          const option = document.createElement("option");
          option.value = country.cca2;
          option.textContent = country.name.common;
          option.dataset.currency = currencyCode;
          option.dataset.symbol =
            currencyInfo.symbol ||
            currencySymbols[currencyCode] ||
            currencyCode;
          countrySelect.appendChild(option);
        }
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      // Show error in the select
      const errorOption = document.createElement("option");
      errorOption.textContent = "Error loading countries";
      errorOption.disabled = true;
      countrySelect.appendChild(errorOption);
    }
  }

  // Get exchange rates from a service
  async function getExchangeRates(sourceCurrency, targetCurrency) {
    try {
      const response = await fetch(
        `/voyage-compass/exchange-rate?source=${sourceCurrency}&target=${targetCurrency}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return { rate: 1 };
    }
  }

  // Handle country selection
  countrySelect.addEventListener("change", async function () {
    const selectedOption = this.options[this.selectedIndex];
    if (selectedOption.dataset.currency) {
      const sourceCurrency = selectedOption.dataset.currency;
      const symbol = selectedOption.dataset.symbol;

      // Update currency symbol display
      currencySymbol.textContent = symbol;

      // Update hidden currency inputs
      sourceCurrencyInput.value = sourceCurrency;
    }
  });

  // Handle budget input formatting
  budgetInput.addEventListener("input", function (e) {
    // Remove all non-numeric characters except decimal point
    let value = this.value.replace(/[^\d.]/g, "");

    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to two decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      value = parseFloat(value).toFixed(2);
    }

    // Update the input value
    this.value = value;
  });

  // Initialize countries and currencies
  fetchCountriesAndCurrencies();
});
