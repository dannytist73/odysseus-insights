// voyageCompassRoutes.js
import express from "express";
import axios from "axios";
import rateLimit from "express-rate-limit";
import NodeCache from "node-cache";

const router = express.Router();
const cache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 120,
});

const VALID_CURRENCIES = [
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

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// Helper function to validate and sanitize currency
function sanitizeCurrency(currency) {
  return VALID_CURRENCIES.includes(currency) ? currency : "PHP";
}

// Helper function to get exchange rates
// Disabled due to rate limit of free version
async function getExchangeRates(sourceCurrency, targetCurrency) {
  try {
    sourceCurrency = sanitizeCurrency(sourceCurrency);
    targetCurrency = sanitizeCurrency(targetCurrency);

    const cacheKey = `exchange-${sourceCurrency}-${targetCurrency}`;

    const cachedRates = cache.get(cacheKey);
    if (cachedRates) {
      return cachedRates;
    }

    // Fetch latest exchange rates
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.exchangeRateApiKey}/latest/${sourceCurrency}`
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
    cache.set(cacheKey, result, 3600);
    return result;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);

    // Fallback to default exchange rates
    return {
      source: "PHP",
      target: "PHP",
      rate: 1,
      lastUpdated: Date.now(),
    };
  }
}

router.get("/", (req, res) => {
  res.render("voyage-compass", {
    title: "Voyage Compass | Travel Insights",
    description: "Get AI-powered travel insights",
    path: "/voyage-compass",
  });
});

// AI Analysis
router.post("/calculate", limiter, async (req, res) => {
  req.setTimeout(120000);
  try {
    const {
      destination,
      startDate,
      endDate,
      budget,
      travelers,
      currency,
      luxuryHotel,
      midRangeHotel,
      budgetHostel,
      culturalSites,
      localCuisine,
      outdoorActivities,
      shopping,
      nightlife,
      relaxation,
      accessibility,
      familyFriendly,
      dietaryRestrictions,
      quietArea,
    } = req.body;

    // Input validation
    if (!destination || !startDate || !endDate || !budget || !travelers) {
      return res.status(400).json({
        error: "Missing Required Fields",
        message: "Please provide all required trip details",
      });
    }

    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    // Prepare AI prompt with enhanced structure
    const options = {
      method: "POST",
      url: "https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.rapidApiKey,
        "X-RapidAPI-Host":
          "cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com",
      },
      data: {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `You are a travel planning AI assistant specializing in destination insights and currency conversion. Create a comprehensive travel plan for ${destination} from ${startDate} to ${endDate} (${duration} days). The user has a budget of ${budget} ${currency}. First, determine the local currency of ${destination} and provide accurate currency conversion. Then create a detailed day-by-day travel plan. Return a valid and concise JSON response with this structure:
{
    "budget": {
        "userBudget": {
            "amount": "${budget}",
            "currency": "${currency}"
        },
        "localBudget": {
            "amount": "The budget converted to local currency (should be a number)",
            "currency": "local currency code",
            "exchangeRate": "1 ${currency} = X local currency (should be a number)"
        }
    },
     "weather": {
        "overview": {
            "season": "Current season during travel dates",
            "description": "Detailed weather description",
            "temperature": {
                "average": "Expected average in Celsius",
                "range": "Expected min-max range"
            }
        },
        "recommendations": {
            "packingList": ["Essential items to pack based on weather"],
            "activities": ["Weather-appropriate activities"],
            "precautions": ["Weather-related precautions if any"]
        }
    },
    "itinerary": {
        "dailyPlans": [
            // This array should have entries for each day of the trip (${duration} days)
            {
                "day": "Day number (1 to ${duration})",
                "activities": [
                    {
                        "time": "Suggested time (e.g., '9:00 AM')",
                        "activity": "Activity description",
                        "location": "Place name",
                        "cost": "Cost in local currency (number only, no currency symbol)",
                        "duration": "Duration (e.g., '2 hours')",
                        "tips": "Travel tips or notes",
                        "category": "Category of activity (food/culture/outdoor/etc)"
                    }
                ]
            }
        ],
        "totalCost": "Total cost in local currency (number only)"
    },
    "accommodation": {
        "recommendations": [
            {
                "name": "Accommodation name",
                "type": "Hotel/Hostel/etc",
                "priceRange": "Price per night in local currency",
                "location": "Area/neighborhood",
                "features": ["Key features"],
                "suitableFor": ["Type of travelers"],
                "nearbyAttractions": ["Notable nearby places"]
            }
        ]
    },
    "travelInsights": {
        "localTips": ["Cultural insights and local recommendations"],
        "transportationTips": ["How to get around"],
        "safetyTips": ["Safety considerations"],
        "budgetTips": ["Money-saving advice"],
        "bestTimes": {
            "explore": "Best times for sightseeing",
            "avoid": "Times/places to avoid"
        }
    },
    "mustSeeAttractions": [
        {
            "name": "Attraction name",
            "description": "Brief description",
            "cost": "Entry fee in local currency",
            "suggestedDuration": "How long to spend here",
            "bestTimeToVisit": "Optimal timing",
            "tips": "Visitor tips"
        }
    ]
}`,
          },
          {
            role: "user",
            content: `Generate a ${duration}-day travel itinerary for ${destination} from ${startDate} to ${endDate} 
            with a budget of ${budget} ${currency} for ${travelers} travelers.
            The itinerary should include activities for each day of the trip.

            Trip Preferences:
            ${luxuryHotel ? "- Luxury hotels preferred" : ""}
            ${midRangeHotel ? "- Mid-range hotels acceptable" : ""}
            ${budgetHostel ? "- Budget/hostel accommodations acceptable" : ""}
            ${culturalSites ? "- Interested in cultural sites" : ""}
            ${localCuisine ? "- Wants to explore local cuisine" : ""}
            ${outdoorActivities ? "- Interested in outdoor activities" : ""}
            ${shopping ? "- Shopping activities" : ""}
            ${nightlife ? "- Nightlife experiences" : ""}
            ${relaxation ? "- Relaxation focused" : ""}
            ${accessibility ? "- Needs accessibility considerations" : ""}
            ${familyFriendly ? "- Requires family-friendly options" : ""}
            ${dietaryRestrictions ? "- Has dietary restrictions" : ""}
            ${quietArea ? "- Prefers quiet areas" : ""}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 5000,
      },
    };

    const response = await axios.request(options);
    let content = response.data.choices[0].message.content;
    content = content.replace(/```json\n|\n```/g, "").trim();
    const insights = JSON.parse(content);

    // Combine all data
    const result = {
      tripDetails: {
        destination,
        duration,
        travelers,
        dates: {
          start: startDate,
          end: endDate,
        },
        budget: insights.budget,
      },
      ...insights,
    };

    res.json(result);
  } catch (error) {
    console.error("Error generating travel insights:", error);
    res.status(500).json({
      error: "Failed to generate travel insights",
      message: error.message || "An unexpected error occurred",
    });
  }
});

export default router;
