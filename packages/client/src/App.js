import React from "react";
import Book from "./components/book";
import useDebounce from "./useDebounce";
import "./App.css";

const sleep = (ms = 500) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

function App() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedValue = useDebounce(searchTerm, 500);

  const [isLoading, setIsLoading] = React.useState(false);
  const [books, setBooks] = React.useState([]);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    const fetchBooks = async searchTerm => {
      setIsLoading(true);
      const result = await fetch(
        `http://localhost:3001/books?q=${debouncedValue}`
      );
      const json = await result.json();
      await sleep(800);
      setBooks(json);
      setIsLoading(false);
    };
    fetchBooks(debouncedValue);
  }, [debouncedValue]);

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
      <div>
        <div className="field">
          <label htmlFor="search">Search for a book</label>
        </div>
        <div className="field">
          <input
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            id="search"
          />
        </div>
      </div>
      {isLoading && <div>Loading...</div>}

      {!isLoading && (
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
      )}

      <form onSubmit={handleSubmit} className="new-form">
        <div className="field">
          <label htmlFor="create-input">Add a book</label>
        </div>
        <input
          data-testid="input"
          id="create-input"
          name="create-book"
          className="new-input"
          value={value}
          onChange={event => setValue(event.target.value)}
          placeholder="eg. The Great Gatsby"
        />
        <div className="field align-right">
          <button className="button primary-button" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
