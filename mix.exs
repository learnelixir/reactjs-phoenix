defmodule ReactjsPhoenix.Mixfile do
  use Mix.Project

  def project do
    [app: :reactjs_phoenix,
     version: "0.0.1",
     elixir: "~> 1.0",
     elixirc_paths: ["lib", "web"],
     compilers: [:phoenix] ++ Mix.compilers,
     deps: deps]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    [mod: {ReactjsPhoenix, []},
     applications: [:phoenix, :cowboy, :logger, :postgrex, :ecto]]
  end

  # Specifies your project dependencies
  #
  # Type `mix help deps` for examples and options
  defp deps do
    [{:phoenix, "0.5.0"},
     {:postgrex, "~> 0.5"},
     {:ecto, "~> 0.2"},
     {:inflex, "~> 0.2"},
     {:cowboy, "~> 1.0"}]
  end
end
