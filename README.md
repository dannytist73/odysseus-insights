# Odysseus Travel Insight

Odysseus Travel Insight is an AI-powered travel planning platform that helps users generate comprehensive travel insights, including budget analysis, weather recommendations, and personalized itineraries.

## Features

- 🤖 AI-powered travel recommendations
- 💰 Real-time currency conversion
- 🌤️ Weather analysis and packing suggestions
- 📅 Custom itinerary generation
- 🗺️ Local insights and tips
- 💡 Budget optimization

## Tech Stack

- Node.js
- Express.js
- EJS templating
- TailwindCSS
- Font Awesome icons
- GPT-4 API for insights
- RapidAPI for weather data

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/dannytist73/odysseus-insights.git
   cd odysseus-insights
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   RAPIDAPI_KEY=your_rapidapi_key
   EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
   WEATHERSTACK_API_KEY=your_weatherstack_api_key
   ```

4. Create a `config.js` file in the root directory:

   ```javascript
   export const config = {
     rapidApiKey: process.env.RAPIDAPI_KEY,
     exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY,
     weatherstackApiKey: process.env.WEATHERSTACK_API_KEY,
     port: process.env.PORT || 3000,
     env: process.env.NODE_ENV || "development",
   };
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## API Keys Required

To run this project, you'll need the following API keys:

1. **RapidAPI Key**: For accessing various travel-related APIs

   - Sign up at [RapidAPI](https://rapidapi.com)
   - Subscribe to required APIs
   - Copy your API key

2. **Exchange Rate API Key**: For currency conversion

   - Sign up at [ExchangeRate-API](https://www.exchangerate-api.com)
   - Get your API key

3. **Weatherstack API Key**: For weather data
   - Sign up at [Weatherstack](https://weatherstack.com)
   - Get your API key

## Environment Variables

Create a `.env` file with the following variables:

```plaintext
RAPIDAPI_KEY=your_rapidapi_key
EXCHANGE_RATE_API_KEY=your_exchange_rate_api_key
WEATHERSTACK_API_KEY=your_weatherstack_api_key
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy

### Environment Variables in Vercel

Add the following environment variables in your Vercel project settings:

- `RAPIDAPI_KEY`
- `EXCHANGE_RATE_API_KEY`
- `WEATHERSTACK_API_KEY`

## Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Submit a pull request

## Project Structure

```
odysseus-insights/
├── public/
│   ├── css/
│   ├── js/
│   └── images/
├── services/
│   ├── weatherService.js
│   ├── currencyService.js
│   └── accommodationService.js
├── routes/
│   └── voyageCompassRoutes.js
├── views/
│   ├── partials/
│   └── pages/
├── config.js
├── index.js
└── package.json
```

## Contact

dannytist - [@dannytist73](https://twitter.com/dannytist73)

Project Link: [https://github.com/dannytist73/odysseus-insights](https://github.com/dannytist73/odysseus-insights)

## Acknowledgments

- [OpenAI GPT-4](https://openai.com)
- [RapidAPI](https://rapidapi.com)
- [TailwindCSS](https://tailwindcss.com)
- [Font Awesome](https://fontawesome.com)
