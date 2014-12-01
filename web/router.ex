defmodule ReactjsPhoenix.Router do
  use Phoenix.Router

  scope "/" do
    # Use the default browser stack.
    pipe_through :browser

    get "/", ReactjsPhoenix.PageController, :index
    get "/books/*path", ReactjsPhoenix.PageController, :index
  end

  scope "/api" do
    pipe_through :browser

    resources "books", ReactjsPhoenix.BooksController
  end
end
