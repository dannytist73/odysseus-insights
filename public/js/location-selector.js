// public/js/location-selector.js
document.addEventListener("DOMContentLoaded", function () {
  const originSelect = document.getElementById("originSelect");
  const destinationSelect = document.getElementById("destinationSelect");

  // Add loading states to selects
  function setSelectLoadingState(select) {
    select.disabled = true;
    select.innerHTML = '<option value="">Loading locations...</option>';
    // Add loading animation to the select
    select.parentElement.classList.add("select-loading");
  }

  // Remove loading states
  function removeSelectLoadingState(select) {
    select.disabled = false;
    select.parentElement.classList.remove("select-loading");
  }

  // Initialize loading states
  setSelectLoadingState(originSelect);
  setSelectLoadingState(destinationSelect);

  async function fetchLocations() {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");

      if (!response.ok) {
        throw new Error("Failed to fetch locations");
      }

      const countries = await response.json();

      // Sort countries by name
      const sortedCountries = countries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );

      // Populate both selects
      [originSelect, destinationSelect].forEach((select) => {
        select.innerHTML = '<option value="">Select a location</option>';

        sortedCountries.forEach((country) => {
          const option = document.createElement("option");
          option.value = country.cca2;
          // Add currency code as a data attribute
          option.dataset.currency = country.currencies
            ? Object.keys(country.currencies)[0]
            : "USD";
          option.textContent = country.name.common;
          select.appendChild(option);
        });

        removeSelectLoadingState(select);
      });

      // Enable the selects
      originSelect.disabled = false;
      destinationSelect.disabled = false;
    } catch (error) {
      console.error("Error fetching locations:", error);
      [originSelect, destinationSelect].forEach((select) => {
        select.innerHTML = '<option value="">Error loading locations</option>';
        removeSelectLoadingState(select);
      });
    }
  }

  // Add CSS for loading animation
  const style = document.createElement("style");
  style.textContent = `
      .select-loading {
        position: relative;
      }
      
      .select-loading::after {
        content: "";
        position: absolute;
        right: 2.5rem;
        top: 50%;
        transform: translateY(-50%);
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #7FFFD4;
        animation: select-spin 0.8s linear infinite;
      }
      
      @keyframes select-spin {
        to {
          transform: translateY(-50%) rotate(360deg);
        }
      }
    `;

  document.head.appendChild(style);

  // Add change event listeners to handle currency updates
  originSelect.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const currency = selectedOption.dataset.currency;
    // Update source currency in the form
    const sourceCurrencyInput = document.createElement("input");
    sourceCurrencyInput.type = "hidden";
    sourceCurrencyInput.name = "sourceCurrency";
    sourceCurrencyInput.value = currency;
    this.form.appendChild(sourceCurrencyInput);
  });

  destinationSelect.addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    const currency = selectedOption.dataset.currency;
    // Update target currency in the form
    const targetCurrencyInput = document.createElement("input");
    targetCurrencyInput.type = "hidden";
    targetCurrencyInput.name = "targetCurrency";
    targetCurrencyInput.value = currency;
    this.form.appendChild(targetCurrencyInput);
  });

  // Initialize
  fetchLocations();
});
