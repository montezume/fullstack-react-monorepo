import React from "react";
import "./book.css";

const Book = props => {
  const [value, setValue] = React.useState(props.value);
  const [editMode, setEditMode] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  const handleEdit = () => {
    props.handleEdit(value);
    toggleEditMode();
  };

  const handleCancel = () => {
    setValue(props.value);
    toggleEditMode();
  };

  const handleDelete = () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setConfirmed(false);
    props.handleDelete();
  };

  const toggleEditMode = () => setEditMode(!editMode);

  const children = editMode ? (
    <form
      onSubmit={event => {
        event.preventDefault();
        handleEdit();
      }}
    >
      <input
        aria-label="Enter new book title"
        data-testid="edit-input"
        value={value}
        className="item-input"
        onChange={event => setValue(event.target.value)}
        type="text"
      />
      <div className="button-container">
        <button className="button secondary-button" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="button primary-button">
          Save
        </button>
      </div>
    </form>
  ) : (
    <React.Fragment>
      <span className="item-text">{value}</span>
      <div className="left button-container">
        <button className="button edit-button" onClick={toggleEditMode}>
          Edit
        </button>
        <button
          className="button edit-button"
          onClick={handleDelete}
          style={confirmed ? { color: "red" } : {}}
        >
          {!confirmed ? "Delete" : "Confirm?"}
        </button>
      </div>
    </React.Fragment>
  );

  return <li className="item-container">{children}</li>;
};

export default Book;
