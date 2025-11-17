- [ ] Add Redis Cashing - [ ] Cache weather responses by city_id to reduce API calls to NWS and geocode - [ ] Set TTL ex: 15 min so data stays fresh - Speeds up API responses also

- [ ] Implement Alerts / Notifications - [ ] Set up "alerts" table in db for user subscriptions - [ ] create cron jobs to check weather conditions and trigger notifications (push, email or SMS)

- [ ] Add Authentication / Users - [x] device id for guest users - [ ] update schema for "user_id" once auth is set up with Clerk

- [ ] Front End Integration - [ ] Connect Front end to consume the /weather/:city API - [ ] Display current weather, 7 day forecasts and Alerts

- [ ] Dockerize the Backend

- [ ] Create POST route for Front End to add new device
