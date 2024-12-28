/**
 * Currently disabled due to limited rates in free API. But can be used in the future if it scales.
 */
import axios from "axios";
import NodeCache from "node-cache";

// Cache exchange rates for 1 hour to avoid hitting API limits
const rateCache = new NodeCache({ stdTTL: 3600 });

export async function getExchangeRates(sourceCurrency, targetCurrency) {
  try {
    // Validate currencies
    const validCurrencies = [
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "AUD",
      "CAD",
      "CHF",
      "CNY",
      "INR",
      "PHP",
      "SGD",
      "HKD",
      "SAR",
      "AED",
      "BRL",
      "MXN",
      "RUB",
      "ZAR",
      "KRW",
      "THB",
      "IDR",
      "MYR",
      "AFN",
      "ALL",
      "DZD",
      "AOA",
      "ARS",
      "AMD",
      "AWG",
      "AZN",
      "BSD",
      "BHD",
      "BDT",
      "BBD",
      "BYN",
      "BZD",
      "BMD",
      "BTN",
      "BOB",
      "BAM",
      "BWP",
      "NOK",
      "BGN",
      "BIF",
      "CVE",
      "KHR",
      "XAF",
      "XOF",
      "XPF",
      "CLP",
      "COP",
      "KMF",
      "CDF",
      "CRC",
      "HRK",
      "CUP",
      "CZK",
      "DKK",
      "DJF",
      "DOP",
      "EGP",
      "SVC",
      "ERN",
      "SZL",
      "ETB",
      "FJD",
      "GMD",
      "GEL",
      "GHS",
      "GIP",
      "GTQ",
      "GNF",
      "GYD",
      "HTG",
      "HNL",
      "HUF",
      "ISK",
      "IRR",
      "IQD",
      "ILS",
      "JMD",
      "JOD",
      "KZT",
      "KES",
      "KWD",
      "KGS",
      "LAK",
      "LBP",
      "LSL",
      "LRD",
      "LYD",
      "MOP",
      "MKD",
      "MGA",
      "MWK",
      "MVR",
      "MRU",
      "MUR",
      "MNT",
      "MAD",
      "MZN",
      "MMK",
      "NAD",
      "NPR",
      "ANG",
      "NZD",
      "NIO",
      "NGN",
      "OMR",
      "PKR",
      "PGK",
      "PYG",
      "PEN",
      "QAR",
      "RON",
      "RWF",
      "WST",
      "STN",
      "SHP",
      "SLL",
      "SOS",
      "SSP",
      "LKR",
      "SDG",
      "SRD",
      "SEK",
      "SYP",
      "TWD",
      "TJS",
      "TZS",
      "TOP",
      "TTD",
      "TND",
      "TMT",
      "UGX",
      "UAH",
      "UYU",
      "UZS",
      "VUV",
      "VES",
      "VND",
      "YER",
      "ZMW",
      "ZWL",
    ];

    sourceCurrency = validCurrencies.includes(sourceCurrency)
      ? sourceCurrency
      : "USD";
    targetCurrency = validCurrencies.includes(targetCurrency)
      ? targetCurrency
      : "USD";

    // Check cache first
    const cacheKey = `${sourceCurrency}-${targetCurrency}`;
    const cachedRates = rateCache.get(cacheKey);
    if (cachedRates) {
      return cachedRates;
    }

    // Fetch from API
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${config.exchangeRateApiKey}/latest/${sourceCurrency}`
    );

    // Extract conversion rate
    const conversionRate = response.data.conversion_rates[targetCurrency] || 1;

    const result = {
      source: sourceCurrency,
      target: targetCurrency,
      rate: conversionRate,
      lastUpdated: response.data.time_last_update_unix,
    };

    // Cache the result
    rateCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);

    // Fallback to PHP if anything goes wrong
    return {
      source: "PHP",
      target: "PHP",
      rate: 1,
      lastUpdated: Date.now(),
    };
  }
}
