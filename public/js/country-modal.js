// public/js/country-modal.js
document.addEventListener("DOMContentLoaded", function () {
  const countryModal = document.getElementById("countryModal");
  const initialCountrySelect = document.getElementById("initialCountrySelect");
  const confirmCountryBtn = document.getElementById("confirmCountry");
  const changeCountryBtn = document.getElementById("changeCountryBtn"); // Add this line
  const loadingSpinner = document.querySelector(".loading-spinner");
  let currencyData = {};

  function showLoadingState() {
    if (initialCountrySelect) {
      initialCountrySelect.disabled = true;
      initialCountrySelect.innerHTML =
        '<option value="">Loading countries...</option>';
    }
    if (confirmCountryBtn) {
      confirmCountryBtn.disabled = true;
    }
    if (loadingSpinner) {
      loadingSpinner.classList.remove("hidden");
    }
  }

  function hideLoadingState() {
    if (loadingSpinner) {
      loadingSpinner.classList.add("hidden");
    }
    if (initialCountrySelect) {
      initialCountrySelect.disabled = false;
    }
  }

  function showModal() {
    if (countryModal) {
      // Force display flex and initial opacity
      countryModal.style.display = "flex";
      countryModal.style.opacity = "0";

      // Force reflow
      void countryModal.offsetHeight;

      // Add visible class for transition
      countryModal.classList.add("modal-visible");
      countryModal.style.opacity = "1";
    }
  }

  function hideModal() {
    if (countryModal) {
      countryModal.style.opacity = "0";
      countryModal.classList.remove("modal-visible");
      setTimeout(() => {
        countryModal.style.display = "none";
      }, 300);
    }
  }

  function initializeModal() {
    const savedCountry = localStorage.getItem("userCountry");
    const savedCurrency = localStorage.getItem("userCurrency");

    if (savedCountry && savedCurrency) {
      hideModal();
      updateCurrencySymbol(JSON.parse(savedCurrency));
    } else {
      showLoadingState();
      showModal();
      fetchCountries();
    }
  }

  function updateCurrencySymbol(currency) {
    const currencySymbols = document.querySelectorAll(".currency-symbol");
    currencySymbols.forEach((span) => {
      if (span) span.textContent = currency.symbol;
    });
  }

  async function fetchCountries() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) throw new Error("Failed to fetch countries");

      const countries = await response.json();

      // Sort countries by name
      const sortedCountries = countries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );

      // Store currency data
      sortedCountries.forEach((country) => {
        if (country.currencies) {
          const currencyCode = Object.keys(country.currencies)[0];
          const currencyInfo = country.currencies[currencyCode];
          currencyData[country.cca2] = {
            code: currencyCode,
            symbol: currencyInfo.symbol || currencyCode,
            name: currencyInfo.name,
          };
        }
      });

      // Populate select
      if (initialCountrySelect) {
        initialCountrySelect.innerHTML =
          '<option value="">Select your country</option>';
        sortedCountries.forEach((country) => {
          const option = document.createElement("option");
          option.value = country.cca2;
          option.textContent = country.name.common;
          initialCountrySelect.appendChild(option);
        });
        hideLoadingState();
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      if (initialCountrySelect) {
        initialCountrySelect.innerHTML =
          '<option value="">Error loading countries. Please refresh.</option>';
        hideLoadingState();
      }
    }
  }

  // Event Listeners
  if (initialCountrySelect) {
    initialCountrySelect.addEventListener("change", function () {
      if (confirmCountryBtn) {
        confirmCountryBtn.disabled = !this.value;
      }
    });
  }

  if (confirmCountryBtn) {
    confirmCountryBtn.addEventListener("click", function () {
      const selectedCountry = initialCountrySelect.value;
      if (selectedCountry && currencyData[selectedCountry]) {
        const currency = currencyData[selectedCountry];
        updateCurrencySymbol(currency);
        localStorage.setItem("userCountry", selectedCountry);
        localStorage.setItem("userCurrency", JSON.stringify(currency));
        hideModal();
      }
    });
  }

  // Add change country button listener
  if (changeCountryBtn) {
    changeCountryBtn.addEventListener("click", function () {
      // Reset everything
      localStorage.removeItem("userCountry");
      localStorage.removeItem("userCurrency");

      if (initialCountrySelect) {
        initialCountrySelect.value = "";
        if (confirmCountryBtn) {
          confirmCountryBtn.disabled = true;
        }
      }

      showLoadingState();
      showModal();
      fetchCountries();
    });
  }

  // Initialize on page load
  if (countryModal) {
    // Add necessary styles
    const style = document.createElement("style");
    style.textContent = `
      #countryModal {
        transition: opacity 0.3s ease-in-out;
      }
      .modal-visible {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);

    // Initialize the modal
    initializeModal();
  }
});
