# 🚀 21 Days, 21 MERN Stack Projects

Welcome to my 21-Day MERN Stack challenge! To celebrate turning 21, I am building and completing one focused, single-feature full-stack application every single day. This challenge is designed to sharpen my rapid prototyping skills, master API integrations, and reinforce core full-stack principles.

## 📊 Challenge Tracker

| Day | Project Name | Core Concepts / Tech Stack | Status | Live / Code Link |
| :--- | :--- | :--- | :--- | :--- |
| **01** | Gratitude Journal | CRUD, MongoDB Schema, Express Routing | ✅ Complete | [Code](./Day01-Gratitude-Journal) |
| **02** | Bookmark Manager | Array manipulation in Mongoose, Tag Filters | ✅ Complete | [Code](./Day02-Bookmark-Manager) |
| **03** | Split-the-Bill Calc | Complex State, History Logging | ✅ Complete | [Code](./Day03-Split-the-Bill) |
| **04** | Kanban To-Do | Status Updates, `findByIdAndUpdate` | ✅ Complete | [Code](./Day04-Kanban-Todo) |
| **05** | Sticky Notes Board | Coordinate mapping, Frontend grid state | ✅ Complete | [Code](./Day05-Sticky-Notes) |
| **06** | Expense Logger | MongoDB Aggregations (`$sum`), Date filtering | ✅ Complete | [Code](./Day06-Expense-Logger) |
| **07** | Quick Poll App | Atomic increments using `$inc`, Live bars | ✅ Complete | [Code](./Day07-Quick-Poll) |
| **08** | Auth Template | JWT, HTTP-Only Cookies, `bcryptjs` | ✅ Complete | [Code](./Day08-Auth-Template) |
| **09** | Weather Dashboard | Axios backend fetching, Relational Schemas | ✅ Complete | [Code](./Day09-Weather-Dash) |
| **10** | Recipe Box | Third-party API (Spoonacular), `.env` safety | ✅ Complete | [Code](./Day10-Recipe-Box) |
| **11** | Daily Quote Picker | Unsplash API integration, UI Layouts | ✅ Complete | [Code](./Day11-Quote-Picker) |
| **12** | GitHub Profile Inspector | GitHub API handling, Custom notes storage | ✅ Complete | [Code](./Day12-Github-Inspector) |
| **13** | Crypto Watchlist | CoinGecko API, Periodic frontend polling | ✅ Complete | [Code](./Day13-Crypto-Watchlist) |
| **14** | Movie Review App | OMDB API, Nested schema arrays (Reviews) | ✅ Complete | [Code](./Day14-Movie-Reviews) |
| **15** | Markdown Previewer | Markdown-to-HTML parser, Text saving | ✅ Complete | [Code](./Day15-Markdown-Preview) |
| **16** | Interview Flashcards | CSS 3D transforms, tracking review scores | ✅ Complete | [Code](./Day16-Flashcards) |
| **17** | Lo-Fi Soundboard | HTML5 Audio API, audio state control | ✅ Complete | [Code](./Day17-Soundboard) |
| **18** | Habit Tracker Grid | Boolean matrix tracking, Date object checking | ✅ Complete | [Code](./Day18-Habit-Tracker) |
| **19** | Simple Chat Room | Socket.io integration, Real-time state | ✅ Complete | [Code](./Day19-Chat-Room) |
| **20** | Pixel Art Canvas & Gallery | Flood-fill algorithm, 2D Grid Paint state | ✅ Complete | [Code](./Day20-Pixel-Art) |
| **21** | Portfolio Hub | Metadata aggregator, Master dashboard schema | ✅ Complete | [Code](./Day21-Portfolio-Hub) |

---

## 🛠️ Global Project Folder Structure

Each day follows a predictable, atomic folder pattern to keep development organized and fast:

```text
DayXX-Project-Name/
├── backend/
│   ├── config/db.js
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
└── frontend/
    ├── src/
    ├── package.json
    └── tailwind.config.js
```

## 🎨 Pastel Theme

All projects share a soft pastel design system via Tailwind custom colors: `pastel-pink`, `pastel-lavender`, `pastel-mint`, `pastel-peach`, `pastel-sky`, and `pastel-lemon`.

## 🚀 Quick Start (Any Project)

```bash
# Terminal 1 - Backend
cd DayXX-Project-Name/backend
npm install
npm run dev

# Terminal 2 - Frontend
cd DayXX-Project-Name/frontend
npm install
npm run dev
```

**Requirements:** Node.js 18+, MongoDB running locally (`mongodb://127.0.0.1:27017`).

## 🔑 API Keys (Optional)

Some projects use external APIs. Add keys to the respective `backend/.env`:

| Project | Env Variable | Get Key |
| :--- | :--- | :--- |
| Day 09 | `OPENWEATHER_API_KEY` | [OpenWeatherMap](https://openweathermap.org/api) |
| Day 10 | `SPOONACULAR_API_KEY` | [Spoonacular](https://spoonacular.com/food-api) |
| Day 11 | `UNSPLASH_ACCESS_KEY` | [Unsplash](https://unsplash.com/developers) |
| Day 14 | `OMDB_API_KEY` | [OMDB](https://www.omdbapi.com/apikey.aspx) |

Projects without keys use mock/fallback data so they still run.
