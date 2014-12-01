# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the router
config :phoenix, ReactjsPhoenix.Router,
  url: [host: "localhost"],
  http: [port: System.get_env("PORT")],
  https: false,
  secret_key_base: "yu7CeeVE0dmvjMxsXNIWuh09QqegX1khjpTZX9fAZIGy7HJeZW4WnHFEQisbPHVvPOAGmmfxwM0JD973QMuhEw==",
  catch_errors: true,
  debug_errors: false,
  error_controller: ReactjsPhoenix.PageController

# Session configuration
config :phoenix, ReactjsPhoenix.Router,
  session: [store: :cookie,
            key: "_reactjs_phoenix_key"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
