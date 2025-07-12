# Binance Market Data Dashboard

Hi there, this is the exercice asked for by the interviewers at Flowdesk for a frontend position. It does give the ability to track currency pairs market data from Binance, and here's what it has :

- **Live market data**: Current price, 24h change, high/low, volume
- **Trade history**: Every trade that happened in the last 24 hours
- **Interactive charts**: Price movements, volume spikes, trade sizes
- **Clean UI**: Dark/light mode, responsive design


## Tech Stack

- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Recharts**
- **Axios**
- **i18next**
- **Vite**

## Getting Started

### Prerequisites
- Node.js 18+ (I used 20, but 18 should work)
- npm or yarn

### Quick Start
```bash
# Clone and install
git clone <the-repo>
cd flowdesk-binance-market-data
npm install

# Start the dev server
npm run dev

# Open http://localhost:5173
```

### Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Check for code issues

## What I'd Add

**1. Real-time Updates**: WebSocket connection to Binance for live price updates instead of manual refresh.

**2. Caching**: Redis or similar for caching API responses to reduce load on Binance.

## Key Points

**1. API Rate Limits**: Binance has rate limits, we have to take that into account.

**2. Data Transformation**: Binance's API returns data in a specific format, so I had to transform it to work with my charts and tables.

**3. Error States**: Handling network failures, API errors, and edge cases while keeping the UI responsive.

**4. Performance**: Large datasets (1000+ trades) can slow down the UI, so I implemented pagination and memoization.


## Questions for You

Feel free to ask about:
- Why I chose certain technical decisions
- How I'd scale this for production
- What I'd add next
- Performance optimizations I considered
- How I'd handle real-time updates
- Testing strategies I'd implement

Thanks for taking a look! 🚀
