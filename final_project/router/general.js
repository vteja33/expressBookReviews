const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
public_users.use(express.json());


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {

    if (isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
  }
  else {
    return res.status(404).json({message: "Unable to register user."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const prettyBooks = JSON.stringify(books, null, 4)
  return res.send(prettyBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = parseInt(req.params.isbn);
  if (books[isbn]) {
    return res.send("Enter Valid ISBN");
  }
  else {
    return res.send(JSON.stringify(books[isbn], null, 4));
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
  const booksArray = Object.values(books);
  
  const matchingBooks = booksArray.filter((book) => book.author === author);

  if (matchingBooks.length > 0) {
    return res.send(JSON.stringify(matchingBooks, null, 2)); // Nicely formatted
  } else {
    return res.status(404).send('No books found for this author');
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
  
    const booksArray = Object.values(books);
    
    const matchingBooks = booksArray.filter((book) => book.title === title);
  
    if (matchingBooks.length > 0) {
      return res.send(JSON.stringify(matchingBooks, null, 2)); // Nicely formatted
    } else {
      return res.status(404).send('No books found with this title.');
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
  const isbn = parseInt(req.params.isbn);
  if (!books[isbn]) {
    return res.send("Enter Valid ISBN");
  }
  else {
    return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  }
});

module.exports.general = public_users;