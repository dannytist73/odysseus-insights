/**
 * ! Currently disabled due to limited API rates
 */
import axios from "axios";
import { config } from "../config.js";

// Helper function to get coordinates from city name
async function getCityCoordinates(cityName) {
  try {
    const options = {
      method: "GET",
      url: "https://ai-weather-by-meteosource.p.rapidapi.com/find_places",
      params: {
        text: cityName,
        language: "en",
      },
      headers: {
        "X-RapidAPI-Key": config.rapidApiKey,
        "X-RapidAPI-Host": "ai-weather-by-meteosource.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    if (response.data && response.data.length > 0) {
      return {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
      };
    }
    throw new Error("Location not found");
  } catch (error) {
    console.error("Error getting coordinates:", error);
    throw error;
  }
}

export async function fetchWeatherForecast(destination, startDate, endDate) {
  try {
    // Get coordinates for the destination
    const coords = await getCityCoordinates(destination);

    // Format dates for API requests
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = [];

    // Fetch weather for each day
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split("T")[0];

      const options = {
        method: "GET",
        url: "https://ai-weather-by-meteosource.p.rapidapi.com/time_machine",
        params: {
          lat: coords.lat,
          lon: coords.lon,
          date: dateStr,
          units: "metric",
        },
        headers: {
          "X-RapidAPI-Key": config.rapidApiKey,
          "X-RapidAPI-Host": "ai-weather-by-meteosource.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);
      const dailyData = response.data;

      // Process daily weather data
      days.push({
        date: dateStr,
        temp: {
          day: Math.round(dailyData.temperature),
          min: Math.round(dailyData.temperature_min),
          max: Math.round(dailyData.temperature_max),
        },
        weather: {
          main: dailyData.summary,
          description: dailyData.summary,
          icon: getWeatherIcon(dailyData.icon),
        },
        humidity: dailyData.humidity,
        wind_speed: dailyData.wind.speed,
        wind_direction: dailyData.wind.dir,
        precipitation: dailyData.precipitation.total,
        feels_like: dailyData.feels_like,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Generate weather summary and recommendations
    const summary = generateWeatherSummary(days);

    return {
      daily: days,
      summary: summary,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}

function generateWeatherSummary(forecast) {
  const avgTemp =
    forecast.reduce((sum, day) => sum + day.temp.day, 0) / forecast.length;
  const conditions = forecast.map((day) => day.weather.main);
  const uniqueConditions = [...new Set(conditions)];

  // Generate recommendations based on weather conditions
  const recommendations = [];

  if (avgTemp > 25) {
    recommendations.push("Pack light, breathable clothing and sun protection");
  } else if (avgTemp < 15) {
    recommendations.push("Bring warm clothing and layers");
  }

  const rainyDays = forecast.filter((day) => day.precipitation > 0).length;
  if (rainyDays > 0) {
    recommendations.push("Pack an umbrella or raincoat");
  }

  const windyDays = forecast.filter((day) => day.wind_speed > 20).length;
  if (windyDays > 0) {
    recommendations.push("Expect some windy conditions");
  }

  return {
    averageTemp: Math.round(avgTemp),
    conditions: uniqueConditions,
    overview: `Average temperature will be ${Math.round(
      avgTemp
    )}°C with ${uniqueConditions.join(", ").toLowerCase()} conditions.`,
    recommendations: recommendations,
  };
}

function getWeatherIcon(iconCode) {
  // Map Meteosource icon codes to appropriate weather icons
  const iconMap = {
    clear_day: "fas fa-sun",
    cloudy: "fas fa-cloud",
    rain: "fas fa-cloud-rain",
    snow: "fas fa-snowflake",
    thunderstorm: "fas fa-bolt",
  };

  return iconMap[iconCode] || "fas fa-cloud";
}
