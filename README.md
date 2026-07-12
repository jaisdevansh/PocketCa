<div align="center">
  <img src="https://img.icons8.com/color/150/000000/wallet--v1.png" alt="PocketCA Logo" width="100"/>
  <h1>PocketCA</h1>
  <p>Your Personal AI-Powered Financial Assistant 💸✨</p>

  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
    <img alt="React Native" src="https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB" />
    <img alt="Fastify" src="https://img.shields.io/badge/fastify-000000?style=flat&logo=fastify&logoColor=white" />
  </p>
</div>

<br />

PocketCA is an intelligent personal finance tracking application designed to help you effortlessly manage your wealth. Built as a monorepo containing a modern React Native (Expo) mobile application and a high-performance Fastify backend, PocketCA provides real-time financial tracking, budget management, goal setting, and AI-driven insights to help you make smarter financial decisions.

## ✨ Features

- **🤖 AI Financial Coach:** Get intelligent, personalized insights and recommendations powered by Google GenAI and Groq.
- **📊 Smart Budgeting:** Track your monthly expenses, categorize transactions, and visualize where your money goes.
- **🎯 Financial Goals:** Set savings goals and track your progress with beautiful progress charts.
- **📅 Bill Management:** Keep track of your upcoming bills and recurring payments so you never miss a due date.
- **📱 Beautiful UI:** Fluid animations, glassmorphism effects, and a sleek dark/light mode experience built with Expo UI.
- **⚡ Lightning Fast:** High-performance backend using Fastify, Drizzle ORM, Redis, and PostgreSQL.

## 🛠 Tech Stack

### Mobile (Frontend)
- **Framework:** React Native & Expo Router
- **State Management:** Zustand & MMKV (High-performance local storage)
- **Data Fetching:** React Query (@tanstack/react-query)
- **Styling:** Tailwind CSS / Native styling with beautiful Glass Effects
- **UI Components:** Bottom Sheet, FlashList, Lucide React Native Icons

### Backend (API)
- **Framework:** Fastify (Node.js)
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Caching & Queues:** Redis & BullMQ
- **Authentication:** Fastify JWT & Argon2
- **AI Integrations:** Google GenAI & Groq SDK
- **Documentation:** Scalar/Swagger Open API

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v18 or higher)
- PostgreSQL
- Redis
- Expo CLI (for mobile)
- pnpm or npm

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables by copying the example file:
   ```bash
   cp .env.example .env
   ```
4. Push the database schema:
   ```bash
   npm run db:generate
   npm run db:push
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Mobile Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the Expo development server:
   ```bash
   npm start
   ```

## 📂 Project Structure

```text
PocketCA/
├── backend/          # Fastify API Server
│   ├── src/          # API Source Code (Routes, Plugins, Workers)
│   ├── docs/         # API Documentation
│   └── package.json
└── mobile/           # React Native Expo Application
    ├── src/          # Mobile Source Code (App, Features, Shared Components)
    ├── assets/       # App Images & Icons
    └── package.json
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/jaisdevansh/PocketCa/issues).

## 📝 License

This project is licensed under the MIT License.
