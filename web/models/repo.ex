defmodule ReactjsPhoenix.Repo do
  use Ecto.Repo, adapter: Ecto.Adapters.Postgres

  def conf do
    parse_url "ecto://james:@localhost/reactjs_books"
  end 

  def priv do
    app_dir(:reactjs_phoenix, "priv/repo")
  end 
end
