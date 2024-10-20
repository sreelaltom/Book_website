import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addBook = async () => {
    const bookData = {
      title,
      release_year: releaseYear,
    };
    try {
      const response = await fetch("http://127.0.0.1:8000/api/books/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();
      setBooks((prev) => [...prev, data]);
      setTitle('')
      setReleaseYear(0)
    } catch (err) {
      console.log(err);
    }
  };

  const updateTitle = async (pk, release_year) => {
    const bookData = {
      title: newTitle,
      release_year,
    };

    if (!pk) {
      console.error("Book ID is undefined");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const data = await response.json();
      setBooks((prev) =>
        prev.map((book) => (book.id === pk ? data : book))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const deleteBook = async (pk) => {
    if (!pk) {
      console.error("Book ID is undefined");
      return;
    }

    try {
      await fetch(`http://127.0.0.1:8000/api/books/${pk}`, {
        method: "DELETE",
      });
      setBooks((prev) => prev.filter((book) => book.id !== pk));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="site-header">
  <h1 className="siteh1_1">Book </h1>
  <h1 className="siteh1_2">Website</h1>
</div>

      <div>
        <input
          type="text"
          placeholder="Book Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release Year..."
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
        />
        <button className="add"onClick={addBook}>Add Book</button>
      </div>
      {books.map((book) => (
        <div key={book.id}>
          <div className="btitle"><p className="titleT">Title: </p><p className="titleC"> {book.title}</p></div>
          <div className="byear"><p className="yearT">Release Year: </p><p className="yearC"> {book.release_year}</p></div>
          <input
            type="text"
            placeholder="New Title..."
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="update" onClick={() => updateTitle(book.id, book.release_year)}>
            Change Title
          </button>
          <button className="delete" onClick={() => deleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}

export default App;
