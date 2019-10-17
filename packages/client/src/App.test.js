import React from "react";
import {
  render,
  waitForElement,
  fireEvent,
  waitForElementToBeRemoved
} from "@testing-library/react";
import App from "./App";

describe("list", () => {
  it("renders without crashing", async () => {
    fetch.once(JSON.stringify([{ id: "1", name: "Harry Potter" }]));

    const { getByText } = render(<App />);
    // first render should show the title
    expect(getByText("Favorite Books")).toBeDefined();
    // after API call is resolved, it should display the book
    await waitForElement(() => getByText("Harry Potter"));
  });
});

describe("creating", () => {
  it("should be able to create a book", async () => {
    fetch
      .once(JSON.stringify([]))
      .once(JSON.stringify({ id: "1", name: "The Great Gatsby" }));

    const { container, getByText } = render(<App />);

    // we "type" in the value
    const input = container.querySelector("input");
    fireEvent.change(input, {
      target: {
        value: "The Great Gatsby"
      }
    });

    getByText("Submit").click();

    // we submit form, and wait for API response
    // we should now have in the DOM our Book
    // and it's delete and edit buttons
    await waitForElement(() => getByText("The Great Gatsby"));
    expect(getByText("Edit")).toBeDefined();
    expect(getByText("Delete")).toBeDefined();
  });
});

describe("editing", () => {
  it("should be able to edit a book", async () => {
    fetch
      .once(JSON.stringify([{ id: "1", name: "The Great Gatsby" }]))
      .once(JSON.stringify({ id: "1", name: "Harry Potter" }));

    const { getByTestId, getByText } = render(<App />);

    const editButton = await waitForElement(() => getByText("Edit"));
    editButton.click();

    const editInput = getByTestId("edit-input");
    fireEvent.change(editInput, {
      target: {
        value: "Harry Potter"
      }
    });

    getByText("Save").click();

    await waitForElement(() => getByText("Harry Potter"));
    expect(getByText("Edit")).toBeDefined();
    expect(getByText("Delete")).toBeDefined();
  });
});

describe("deleting", () => {
  it("should be able to delete", async () => {
    fetch
      .once(JSON.stringify([{ id: "1", name: "Harry Potter" }]))
      .once(JSON.stringify({}));
    const { getByText } = render(<App />);

    await waitForElement(() => getByText("Harry Potter"));

    getByText("Delete").click();
    getByText("Confirm?").click();

    await waitForElementToBeRemoved(() => getByText("Harry Potter"));
  });
});
