defmodule ReactjsPhoenix.Book do
  use Ecto.Model
  validate book, name: present()

  schema "books" do
    field :name, :string
		field :description, :string
		field :author, :string
  end 
end  
