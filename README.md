# Starting the server

### Redis
Requires redis for `ActionCable` should sit at `:6379`, see `cable.yml`

### Sidekiq
Sidekiq checks for new alerts and sends them to the websockets

