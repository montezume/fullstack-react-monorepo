import React from "react";
import Book from "./components/book";
import Search from "./components/search";

import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [books, setBooks] = React.useState([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    fetch(`http://localhost:3001/books?q=${searchTerm}`)
      .then(res => res.json())
      .then(result => {
        setBooks(result);
      });
  }, [searchTerm]);

  const handleEdit = (id, newValue) => {
    const data = {
      name: newValue
    };

    fetch(`http://localhost:3001/books/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        setBooks(
          books.map(book => {
            if (book.id !== id) return book;
            return result;
          })
        );
      });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (value && value !== "") {
      const data = {
        name: value
      };
      fetch("http://localhost:3001/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(result => {
          setBooks(books.concat([result]));
          setValue("");
        });
    }
  };

  const handleDelete = id => {
    console.log("here?");
    fetch(`http://localhost:3001/books/${id}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(result => {
        setBooks(books.filter(book => book.id !== id));
      });
  };

  return (
    <div className="App">
      <h1>Favorite Books</h1>
      <p>Keep track of your favorites!</p>
      <form>
        <div>
          <label htmlFor="search">Search for a book</label>
        </div>
        <div>
          <Search
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            id="search"
          />
        </div>
      </form>
      <ul>
        {books.map(book => (
          <Book
            key={book.id}
            value={book.name}
            handleEdit={newValue => handleEdit(book.id, newValue)}
            handleDelete={() => handleDelete(book.id)}
          />
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="new-form">
        <div>
          <label htmlFor="createBook">Add a book</label>
        </div>
        <input
          data-testid="input"
          id="create-book"
          className="new-input"
          value={value}
          onChange={event => setValue(event.target.value)}
          placeholder="eg. The Great Gatsby"
        />
        <button className="button primary-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
