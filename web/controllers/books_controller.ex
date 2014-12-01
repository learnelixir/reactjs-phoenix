defmodule ReactjsPhoenix.BooksController do
  use Phoenix.Controller
  alias Poison, as: JSON
  alias ReactjsPhoenix.Repo
  alias ReactjsPhoenix.Book
  import Ecto.Query
  plug :action
 
  def index(conn, _params) do
    books = Repo.all(Book) 
    json conn, JSON.encode!(Repo.all(Book))
  end

  def create(conn, %{"book" => params}) do
    atomized_keys_params = atomize_keys(params)
    book = Map.merge(%Book{}, atomized_keys_params)
    case Book.validate(book) do
      [] ->
        book = Repo.insert(book)
        json conn, JSON.encode!(book)
      errors ->
        json conn, JSON.encode!(errors)
    end
  end

  def show(conn, %{"id" => id}) do
    id = String.to_integer(id)
    book = Repo.one(Book |> where([book], book.id == ^id))
    json conn, JSON.encode!(book)
  end

  def update(conn, %{"id" => id, "book" => params}) do
    case Repo.get(Book, String.to_integer(id)) do
      book when is_map(book) ->
        atomized_keys_params = atomize_keys(params)
        book = Map.merge(book, atomized_keys_params)
        case Book.validate(book) do
          [] -> 
            Repo.update(book)
            json conn, JSON.encode!(book)
          errors ->
            json conn, JSON.encode!(errors)
        end
      _ ->
        json conn, JSON.encode!(%{"error" => "no such book"})
    end
  end

  def destroy(conn, %{"id" => id}) do
    case Repo.get(Book, String.to_integer(id)) do
      book when is_map(book) ->
        Repo.delete(book)
        json conn, JSON.encode!(%{"result" => "ok"})
      _ ->
        json conn, JSON.encode!(%{"result" => "failed"})
    end
  end

  defp atomize_keys(struct) do
    Enum.reduce struct, %{}, fn({k, v}, map) -> Map.put(map, String.to_atom(k), v) end
  end
end
