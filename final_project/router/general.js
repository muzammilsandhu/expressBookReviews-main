const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (users.hasOwnProperty(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users[username] = { username, password };

  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    res.send(JSON.stringify({ books }, null, 4));
  } catch (error) {
    console.error("Error fetching book list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    res.send(books[isbn]);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  try {
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        if (books[isbn].author === author) {
          matchingBooks.push(books[isbn]);
        }
      }
    }

    if (matchingBooks.length > 0) {
      res.send(matchingBooks);
    } else {
      res
        .status(404)
        .json({ message: "No books found with the specified author" });
    }
  } catch (error) {
    console.error("Error fetching books by author:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  try {
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        if (book.title === title) {
          matchingBooks.push(book);
        }
      }
    }

    if (matchingBooks.length > 0) {
      res.send(matchingBooks);
    } else {
      res
        .status(404)
        .json({ message: "No books found with the specified title" });
    }
  } catch (error) {
    console.error("Error fetching books by title:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    const bookReviews = book.reviews;
    res.json(bookReviews);
  } else {
    res
      .status(404)
      .json({ message: "No reviews found for the specified ISBN" });
  }
});

module.exports.general = public_users;
