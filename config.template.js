// Rename this file to config.js and add your API keys
export const config = {
  rapidApiKey: process.env.RAPIDAPI_KEY || "your_rapidapi_key",
  exchangeRateApiKey:
    process.env.EXCHANGE_RATE_API_KEY || "your_exchange_rate_api_key",
  weatherstackApiKey:
    process.env.WEATHERSTACK_API_KEY || "your_weatherstack_api_key",
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
};
