document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("voyageForm");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const resultsSection = document.getElementById("results");

  // Budget input handling
  const budgetInput = document.querySelector('input[name="budget"]');

  if (budgetInput) {
    budgetInput.addEventListener("keypress", function (e) {
      // Allow only numbers (0-9) and decimal point
      if (!((e.charCode >= 48 && e.charCode <= 57) || e.charCode === 46)) {
        e.preventDefault();
        return false;
      }

      // only one decimal point allowed
      if (e.charCode === 46 && this.value.includes(".")) {
        e.preventDefault();
        return false;
      }
    });

    // Clean input on paste
    budgetInput.addEventListener("paste", function (e) {
      e.preventDefault();
      const pastedText = (e.clipboardData || window.clipboardData).getData(
        "text"
      );
      const cleanedText = pastedText.replace(/[^\d.]/g, "");

      // Handle decimal points
      const parts = cleanedText.split(".");
      if (parts.length > 1) {
        this.value = parts[0] + "." + parts.slice(1).join("").slice(0, 2);
      } else {
        this.value = cleanedText;
      }
    });

    // Format number while typing
    budgetInput.addEventListener("input", function (e) {
      let value = this.value.replace(/[^\d.]/g, "");

      const parts = value.split(".");
      if (parts.length > 2) {
        value = parts[0] + "." + parts.slice(1).join("");
      }

      if (parts.length > 1) {
        value = parts[0] + "." + parts[1].slice(0, 2);
      }

      this.value = value;
    });
  }

  function formatCurrency(amount, currencyCode) {
    if (!amount || isNaN(amount)) return "Free";

    // Get the currency symbol from our currency-selector.js
    const currencySymbols = JSON.parse(
      localStorage.getItem("currencySymbols") || "{}"
    );
    const symbol = currencySymbols[currencyCode] || currencyCode;

    try {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      // Replace the currency code with our stored symbol
      return formatter.format(amount).replace(currencyCode, symbol);
    } catch (error) {
      console.error("Currency formatting error:", error);
      return `${symbol}${amount.toFixed(2)}`;
    }
  }

  function getCurrencyCode(currency) {
    if (typeof currency === "object" && currency !== null) {
      return currency.code || "PHP";
    }
    return currency;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    loadingOverlay.classList.remove("hidden");

    const formData = new FormData(form);
    const data = {
      ...Object.fromEntries(formData.entries()),
      currency: document.getElementById("selectedCurrency").value,
    };

    try {
      const response = await fetch("/voyage-compass/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();

      //console.log("Raw Response:", responseText); // for debugging

      let results;
      try {
        results = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parsing Error:", parseError);
        throw new Error(`Invalid response format: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(results.message || "Failed to calculate trip details");
      }

      //const results = await response.json();

      if (!response.ok) {
        throw new Error(results.message || "Failed to calculate trip details");
      }

      // Format budget displays consistently
      if (results.budget) {
        results.budget.userBudget.formattedAmount = formatCurrency(
          results.budget.userBudget.amount,
          results.budget.userBudget.currency
        );

        results.budget.localBudget.formattedAmount = formatCurrency(
          results.budget.localBudget.amount,
          results.budget.localBudget.currency
        );
      }

      displayResults(results);
      resultsSection.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error:", error);
      showError(error.message);
    } finally {
      loadingOverlay.classList.add("hidden");
    }
  });

  function displayBudgetOverview(budget) {
    return `
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8">
        <h3 class="text-[#7FFFD4] text-2xl font-semibold mb-6">Budget Overview</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white/5 rounded-lg p-6">
            <h4 class="text-white text-lg font-medium mb-4">Your Budget</h4>
            <p class="text-2xl text-[#7FFFD4] font-semibold">
              ${budget.userBudget.formattedAmount}
            </p>
          </div>
          <div class="bg-white/5 rounded-lg p-6">
            <h4 class="text-white text-lg font-medium mb-4">Local Budget</h4>
            <p class="text-2xl text-[#7FFFD4] font-semibold">
              ${budget.localBudget.formattedAmount}
            </p>
            <p class="text-white/60 text-sm mt-2">
              Exchange Rate: 1 ${budget.userBudget.currency} = 
              ${Number(budget.localBudget.exchangeRate).toFixed(2)} 
              ${budget.localBudget.currency}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // voyage-compass.js
  function displayResults(results) {
    const budgetSection = displayBudgetOverview(results.budget);

    const resultHTML = `
    <div class="space-y-8 animate-fade-in">
        <!-- Budget Information -->
        ${budgetSection}
        
        <!-- Weather Section -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 class="text-[#7FFFD4] text-2xl font-semibold mb-6">Weather & Packing Insights</h3>
            <div class="bg-white/5 rounded-lg p-6 mb-6">
                <div class="text-white space-y-2">
                    <p class="text-lg">${
                      results.weather.overview.description
                    }</p>
                    <p>Average Temperature: ${
                      results.weather.overview.temperature.average
                    }</p>
                    <p>Temperature Range: ${
                      results.weather.overview.temperature.range
                    }</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Packing List -->
                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-[#7FFFD4] text-lg font-semibold mb-4">What to Pack</h4>
                    <ul class="space-y-2">
                        ${results.weather.recommendations.packingList
                          .map(
                            (item) => `
                            <li class="flex items-start space-x-2">
                                <i class="fas fa-check text-emerald-400 mt-1"></i>
                                <span class="text-white/80">${item}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>

                <!-- Weather Activities -->
                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-[#7FFFD4] text-lg font-semibold mb-4">Recommended Activities</h4>
                    <ul class="space-y-2">
                        ${results.weather.recommendations.activities
                          .map(
                            (item) => `
                            <li class="flex items-start space-x-2">
                                <i class="fas fa-star text-yellow-400 mt-1"></i>
                                <span class="text-white/80">${item}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>

                <!-- Precautions -->
                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-[#7FFFD4] text-lg font-semibold mb-4">Weather Precautions</h4>
                    <ul class="space-y-2">
                        ${results.weather.recommendations.precautions
                          .map(
                            (item) => `
                            <li class="flex items-start space-x-2">
                                <i class="fas fa-exclamation-triangle text-amber-400 mt-1"></i>
                                <span class="text-white/80">${item}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        </div>

         <!-- Daily Itinerary -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 class="text-[#7FFFD4] text-2xl font-semibold mb-6">Your Daily Itinerary</h3>
            <div class="space-y-6">
                ${results.itinerary.dailyPlans
                  .map(
                    (day) => `
                    <div class="bg-white/5 rounded-lg p-6">
                        <h4 class="text-white text-xl font-semibold mb-4">Day ${
                          day.day
                        }</h4>
                        <div class="space-y-4">
                            ${day.activities
                              .map(
                                (activity) => `
                                <div class="bg-white/5 rounded-lg p-4">
                                    <div class="flex justify-between items-start">
                                        <div>
                                            <span class="text-[#7FFFD4]">${
                                              activity.time
                                            }</span>
                                            <h5 class="text-white text-lg font-medium">${
                                              activity.activity
                                            }</h5>
                                            <p class="text-white/70">${
                                              activity.location
                                            }</p>
                                        </div>
                                        <div class="text-right">
                                            <span class="text-white/80">${
                                              activity.duration
                                            }</span>
                                            <p class="text-[#7FFFD4]">
                                                ${
                                                  activity.cost === "Free"
                                                    ? "Free"
                                                    : formatCurrency(
                                                        activity.cost,
                                                        results.budget
                                                          .localBudget.currency
                                                      )
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <p class="text-white/60 mt-2">${
                                      activity.tips
                                    }</p>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="mt-6 p-4 bg-white/5 rounded-lg">
                <p class="text-white text-lg">Total Activities Cost: 
                    <span class="text-[#7FFFD4]">
                        ${formatCurrency(
                          results.itinerary.totalCost,
                          results.budget.localBudget.currency
                        )}
                    </span>
                </p>
            </div>
        </div>

        <!-- Accommodation Section -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 class="text-[#7FFFD4] text-2xl font-semibold mb-6">Recommended Accommodations</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${results.accommodation.recommendations
                  .map(
                    (acc) => `
                    <div class="bg-white/5 rounded-lg p-6">
                        <h4 class="text-white text-xl font-semibold mb-2">${
                          acc.name
                        }</h4>
                        <p class="text-[#7FFFD4] mb-2">${acc.priceRange}</p>
                        <p class="text-white/70 mb-4">${acc.location}</p>
                        <div class="space-y-4">
                            <div>
                                <h5 class="text-white font-medium mb-2">Features</h5>
                                <div class="flex flex-wrap gap-2">
                                    ${acc.features
                                      .map(
                                        (feature) => `
                                        <span class="bg-white/10 text-white/90 px-2 py-1 rounded text-sm">
                                            ${feature}
                                        </span>
                                    `
                                      )
                                      .join("")}
                                </div>
                            </div>
                            <div>
                                <h5 class="text-white font-medium mb-2">Nearby</h5>
                                <p class="text-white/70">${acc.nearbyAttractions.join(
                                  ", "
                                )}</p>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>

        <!-- Travel Tips -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 class="text-[#7FFFD4] text-2xl font-semibold mb-6">Local Insights & Tips</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-white text-lg font-semibold mb-4">Local Tips</h4>
                    <ul class="space-y-2">
                        ${results.travelInsights.localTips
                          .map(
                            (tip) => `
                            <li class="flex items-start space-x-2">
                                <i class="fas fa-info-circle text-[#7FFFD4] mt-1"></i>
                                <span class="text-white/80">${tip}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
                
                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-white text-lg font-semibold mb-4">Transportation</h4>
                    <ul class="space-y-2">
                        ${results.travelInsights.transportationTips
                          .map(
                            (tip) => `
                            <li class="flex items-start space-x-2">
                                <i class="fas fa-bus text-[#7FFFD4] mt-1"></i>
                                <span class="text-white/80">${tip}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Must-See Attractions -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 class="text-[#7FFFD4] text-2xl font-semibold mb-6">Must-See Attractions</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${results.mustSeeAttractions
                  .map(
                    (attraction) => `
                    <div class="bg-white/5 rounded-lg p-6">
                        <h4 class="text-white text-xl font-semibold mb-2">${
                          attraction.name
                        }</h4>
                        <p class="text-white/70 mb-4">${
                          attraction.description
                        }</p>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-white/60">Entry Fee:</span>
                                <span class="text-[#7FFFD4]">
                                    ${formatCurrency(
                                      attraction.cost,
                                      results.budget.localBudget.currency
                                    )}
                                </span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-white/60">Duration:</span>
                                <span class="text-white">${
                                  attraction.suggestedDuration
                                }</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-white/60">Best Time:</span>
                                <span class="text-white">${
                                  attraction.bestTimeToVisit
                                }</span>
                            </div>
                            <div class="mt-4">
                                <p class="text-white/70 text-sm">${
                                  attraction.tips
                                }</p>
                            </div>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>

        <!-- Safety and Budget Tips -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 class="text-[#7FFFD4] text-2xl font-semibold mb-6">Additional Travel Tips</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Safety Tips -->
                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-white text-lg font-semibold mb-4">
                        <i class="fas fa-shield-alt mr-2 text-[#7FFFD4]"></i>
                        Safety Considerations
                    </h4>
                    <ul class="space-y-2">
                        ${results.travelInsights.safetyTips
                          .map(
                            (tip) => `
                            <li class="flex items-start space-x-2">
                                <i class="fas fa-check text-emerald-400 mt-1"></i>
                                <span class="text-white/80">${tip}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>

                <!-- Budget Tips -->
                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-white text-lg font-semibold mb-4">
                        <i class="fas fa-piggy-bank mr-2 text-[#7FFFD4]"></i>
                        Budget Tips
                    </h4>
                    <ul class="space-y-2">
                        ${results.travelInsights.budgetTips
                          .map(
                            (tip) => `
                            <li class="flex items-start space-x-2">
                                <i class="fas fa-check text-emerald-400 mt-1"></i>
                                <span class="text-white/80">${tip}</span>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        </div>

        <!-- Best Times -->
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 class="text-[#7FFFD4] text-2xl font-semibold mb-6">Timing Recommendations</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-white text-lg font-semibold mb-4">
                        <i class="fas fa-clock mr-2 text-[#7FFFD4]"></i>
                        Best Times to Explore
                    </h4>
                    <p class="text-white/80">${
                      results.travelInsights.bestTimes.explore
                    }</p>
                </div>

                <div class="bg-white/5 rounded-lg p-6">
                    <h4 class="text-white text-lg font-semibold mb-4">
                        <i class="fas fa-exclamation-circle mr-2 text-[#7FFFD4]"></i>
                        Times to Avoid
                    </h4>
                    <p class="text-white/80">${
                      results.travelInsights.bestTimes.avoid
                    }</p>
                </div>
            </div>
        </div>
    </div>`;

    resultsSection.innerHTML = resultHTML;
    resultsSection.classList.remove("hidden");

    // Smooth scroll to results
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }

  function showError(message) {
    resultsSection.innerHTML = `
        <div class="bg-red-500/10 backdrop-blur-sm rounded-xl p-8 text-center animate-fade-in">
            <i class="fas fa-exclamation-circle text-4xl text-red-500 mb-4"></i>
            <h3 class="text-white text-xl font-semibold mb-2">Oops! Something went wrong</h3>
            <p class="text-white/80">${message}</p>
            <button 
                onclick="location.reload()" 
                class="mt-6 bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
                Try Again
            </button>
        </div>
    `;
    resultsSection.classList.remove("hidden");
  }
});
