# 🧱 Weather Alerts Backend – Project Architecture

This document provides a **high-level overview** of the structure, purpose, and responsibilities of each TypeScript file in the project. Use it as a guide while building out the Weather Alerts MVP.

---

## 📁 `src/`

### `index.ts`

- **Purpose**: Application entry point. Starts the Express server and loads environment variables.
- **To Do**: Finalize server initialization logic and port config.

### `app.ts`

- **Purpose**: Configure and export the Express app. Set up middleware (e.g., `express.json()`), and mount route handlers.
- **To Do**: Add global middleware like CORS, error handlers, and request logging if needed.

---

## 📁 `src/config/`

### `env.ts`

- **Purpose**: Central place to load and validate environment variables using `dotenv`.
- **To Do**: Create helper functions for typed access to environment variables.

### `db.ts`

- **Purpose**: Configure and initialize PostgreSQL (or SQLite) connection using `pg` or Drizzle ORM.
- **To Do**: Export a reusable DB client instance.

### `redis.ts` _(Optional)_

- **Purpose**: Configure Redis client using `ioredis` for caching or background tasks.
- **To Do**: Export a connected Redis instance and add basic error logging.

---

## 📁 `src/routes/`

### `weather.routes.ts`

- **Purpose**: REST endpoint definitions for fetching weather data.
- **To Do**: Define at least:
  - `GET /weather/:city`
  - `GET /weather/alerts`

### `device.routes.ts`

- **Purpose**: API routes for storing or managing device identifiers for push notifications.
- **To Do**: Create endpoints like:
  - `POST /device` (store device token)
  - `DELETE /device/:id` (remove device)

### `alerts.routes.ts`

- **Purpose**: Manage subscriptions or check weather alert status.
- **To Do**: Define:
  - `GET /alerts/:deviceId`
  - `POST /alerts/subscriptions`

---

## 📁 `src/controllers/`

### `weather.controller.ts`

- **Purpose**: Connects weather routes to NWS service logic. Handles request/response formatting.
- **To Do**: Call `nws.service.ts` and return JSON output.

### `device.controller.ts`

- **Purpose**: Handles device token storage, updates, and validation.
- **To Do**: Use Drizzle ORM to persist data to the `devices` table.

### `alert.controller.ts`

- **Purpose**: Retrieves or sets alert rules per device/user.
- **To Do**: Add logic for interacting with alert settings table.

---

## 📁 `src/services/`

### `nws.service.ts`

- **Purpose**: Fetch weather and alert data from the National Weather Service API.
- **To Do**: Implement fetching + optional caching using Redis.

### `push.service.ts` _(Optional)_

- **Purpose**: Send push notifications via Firebase or Expo backend.
- **To Do**: Integrate with FCM or Expo push system and expose `sendAlert` methods.

### `geo.service.ts`

- **Purpose**: Convert city names → coordinates or vice versa via geolocation API.
- **To Do**: Use external API like Mapbox or OpenStreetMap.

---

## 📁 `src/cron/`

### `weatherSync.ts`

- **Purpose**: Background job to fetch and cache hourly weather data.
- **To Do**: Use `node-cron` to run every hour, update DB or Redis.

### `alertCheck.ts`

- **Purpose**: Background job to check for active weather alerts and notify devices.
- **To Do**: Compare DB/cache weather data, then call `push.service.ts`.

---

## 📁 `src/db/`

### `schema.ts`

- **Purpose**: Drizzle ORM schema definitions (tables, columns, relations).
- **To Do**: Define `devices`, `alerts`, and `city_weather` schemas.

### `client.ts`

- **Purpose**: Exports a configured Drizzle client instance for queries.
- **To Do**: Setup with the connection string from `env.ts`.

---
