import React from "react";

const Search = props => {
  return (
    <input
      id={props.id}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  );
};

export default Search;
