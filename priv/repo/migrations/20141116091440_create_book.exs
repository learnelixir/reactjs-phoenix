defmodule ReactjsPhoenix.Migrations.Book do
  use Ecto.Migration

  def up do
    "CREATE TABLE books(                       
				id serial primary key,
				name varchar(255),
				description text,
				author varchar(255))"
  end

  def down do
    "DROP TABLE books"
  end
end
