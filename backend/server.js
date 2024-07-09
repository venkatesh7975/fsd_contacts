const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 4000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// GET endpoint to fetch all users (just for reference, not required for login)
app.get("/", (req, res) => {
  connection.query("SELECT * FROM user_details", (err, rows) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error fetching users" });
    }
    res.json(rows); // Send JSON response with users data
  });
});

// POST endpoint to register a new user
app.post("/", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "INSERT INTO user_details (username, password) VALUES (?, ?)";
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).json({ error: "Error registering user" });
    }
    console.log("User registered successfully");
    res.status(200).json({ message: "User registered successfully" });
  });
});

// POST endpoint to handle user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM user_details WHERE username = ? AND password = ?";
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }

    if (results.length === 0) {
      console.log("invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // User found, login successful
    console.log("login successful");
    res.status(200).json({ message: "Login successful", user: results[0] });
  });
});

// GET all contacts
app.get("/contacts", (req, res) => {
  const sql = "SELECT * FROM contacts";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching contacts:", err);
      return res.status(500).json({ error: "Error fetching contacts" });
    }
    res.json(results);
  });
});

// POST create a new contact
app.post("/contacts", (req, res) => {
  const { username, number } = req.body;
  const sql = "INSERT INTO contacts (username, number) VALUES (?, ?)";
  connection.query(sql, [username, number], (err, result) => {
    if (err) {
      console.error("Error creating contact:", err);
      return res.status(500).json({ error: "Error creating contact" });
    }
    console.log("Contact created successfully");
    res.status(200).json({ message: "Contact created successfully" });
  });
});

// PUT update an existing contact
app.put("/contacts/:contactId", (req, res) => {
  const { contactId } = req.params;
  const { username, number } = req.body;
  const sql = "UPDATE contacts SET username = ?, number = ? WHERE id = ?";
  connection.query(sql, [username, number, contactId], (err, result) => {
    if (err) {
      console.error("Error updating contact:", err);
      return res.status(500).json({ error: "Error updating contact" });
    }
    console.log("Contact updated successfully");
    res.status(200).json({ message: "Contact updated successfully" });
  });
});

// DELETE delete a contact
app.delete("/contacts/:contactId", (req, res) => {
  const { contactId } = req.params;
  const sql = "DELETE FROM contacts WHERE id = ?";
  connection.query(sql, [contactId], (err, result) => {
    if (err) {
      console.error("Error deleting contact:", err);
      return res.status(500).json({ error: "Error deleting contact" });
    }
    console.log("Contact deleted successfully");
    res.status(200).json({ message: "Contact deleted successfully" });
  });
});

// Update user details
// Update user details
app.put("/users/:userId", (req, res) => {
  const { userId } = req.params;
  const { username, password } = req.body;

  // Construct the SQL query
  const updateUserQuery = `
    UPDATE user_details
    SET
      username = ?,
      password = ?
    WHERE
      user_id = ?;
  `;

  // Execute the query
  connection.query(
    updateUserQuery,
    [username, password, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: "Error updating user" });
      }
      console.log("User updated successfully");
      res.status(200).json({ message: "User updated successfully" });
    }
  );
});

// Delete a user
// Delete a user
app.delete("/users/:userId", (req, res) => {
  const { userId } = req.params;

  // Construct the SQL query
  const deleteUserQuery = `
    DELETE FROM user_details
    WHERE user_id = ?;
  `;

  // Execute the query
  connection.query(deleteUserQuery, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ error: "Error deleting user" });
    }
    console.log("User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
