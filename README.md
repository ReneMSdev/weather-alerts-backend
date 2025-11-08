# 🌦️ Weather Alerts Backend

A TypeScript-based backend service for fetching, processing, and delivering weather alerts and conditions to registered devices. Built with Node.js, Express, Drizzle ORM, PostgreSQL, Redis, and scheduled background jobs.

---

## 🚀 Features

- Fetches real-time weather and alert data from the **National Weather Service (NWS) API**
- Stores device registrations and weather data using **PostgreSQL** and **Drizzle ORM**
- Sends push notifications via **Expo**
- Caches data and rate limits using **Redis**
- Runs scheduled tasks using **node-cron**
