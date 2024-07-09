// src/App.js

import React, { useState, useEffect } from "react";

const backendUrl = "http://localhost:4000";

function App() {
  const [contacts, setContacts] = useState([]);
  const [username, setUsername] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${backendUrl}/contacts`);
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleCreateContact = async () => {
    try {
      const response = await fetch(`${backendUrl}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, number }),
      });
      if (!response.ok) {
        throw new Error("Failed to create contact");
      }
      const data = await response.json();
      alert(data.message);
      fetchContacts(); // Refresh contacts list
      setUsername("");
      setNumber("");
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("Failed to create contact. Please try again.");
    }
  };

  const handleUpdateContact = async (id, newUsername, newNumber) => {
    try {
      const response = await fetch(`${backendUrl}/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername, number: newNumber }),
      });
      if (!response.ok) {
        throw new Error("Failed to update contact");
      }
      const data = await response.json();
      alert(data.message);
      fetchContacts(); // Refresh contacts list
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact. Please try again.");
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/contacts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete contact");
      }
      const data = await response.json();
      alert(data.message);
      fetchContacts(); // Refresh contacts list
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact. Please try again.");
    }
  };

  return (
    <div className="App">
      <h1>Contacts App</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button onClick={handleCreateContact}>Create Contact</button>
      </div>
      <div>
        <h2>Contact List:</h2>
        {contacts.map((contact) => (
          <div key={contact.id}>
            <p>Username: {contact.username}</p>
            <p>Number: {contact.number}</p>
            <button
              onClick={() => {
                const newUsername = prompt(
                  "Enter new username",
                  contact.username
                );
                const newNumber = prompt("Enter new number", contact.number);
                if (newUsername !== null && newNumber !== null) {
                  handleUpdateContact(contact.id, newUsername, newNumber);
                }
              }}
            >
              Edit
            </button>
            <button onClick={() => handleDeleteContact(contact.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
