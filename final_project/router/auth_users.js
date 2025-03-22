const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return !users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean

    //write code to check if username and password match the one we have in records.
    let validUser = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if(validUser.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error Logging In." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password,
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
        accessToken, username
    }

    return res.status(200).send("User successfully logged in.");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
  
    if (!review) {
      return res.status(400).send("Enter a review to post.");
    }
  
    if (!books[isbn]) {
      return res.status(404).send("Invalid ISBN");
    }
  
    books[isbn].reviews[username] = review;
    return res.status(200).send("Review Added/Updated Successfully.");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (!books[isbn]) {
      return res.status(404).send("Invalid ISBN");
    }
  
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).send("Review Deleted Successfully.");
    } else {
        return res.status(404).send("No review found for this user to delete.");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
