const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Amit", email: "amit@test.com" },
  { id: 2, name: "Riya", email: "riya@test.com" }
];

const notes = [
  { id: 1, title: "Note 1", content: "Content 1", userId: 1 },
  { id: 2, title: "Note 2", content: "Content 2", userId: 2 }
];


// GET ALL USERS

app.get("/users", (req, res) => {

  // FIX: userList variable did not exist
  res.send(users);
});

 
// GET USER BY ID
 
app.get("/users/:id", (req, res) => {

  // FIX: Convert params id from string to number
  const id = Number(req.params.id);

  const user = users.find(u => u.id === id);

  // FIX: Added user not found handling
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send(user);
});

 
// GET USER BY ID FUNCTION
 
function getUserById(id) {

  // FIX: Added return statement
  return users.find(u => u.id === id);
}

 
// NOTES COUNT
 
app.get("/notes/count", (req, res) => {

  // FIX: lenght -> length
  const total = notes.length;

  res.send({ total });
});

 
// MOCK EXTERNAL DATA FUNCTION
 
async function fetchExternalData() {
  return {
    message: "External data fetched successfully"
  };
}

 
// EXTERNAL DATA ROUTE
 
app.get("/external-data", async (req, res) => {

  // FIX: Added await
  const data = await fetchExternalData();

  res.send(data);
});

 
// GET ALL NOTES
 
app.get("/notes", (req, res) => {

  // FIX: notes = [] was assignment instead of comparison
  // FIX: Proper empty array check using length
  if (notes.length === 0) {
    console.log("No notes found");
  }

  res.send(notes);
});

 
// GENERATE NOTE ID
 
function generateNoteId() {

  // FIX: Better random integer id
  return Math.floor(Math.random() * 1000);
}

 
// CREATE NOTE
 
app.post("/notes", (req, res) => {

  const { title, content, userId } = req.body;

  // FIX: Changed && to ||
  // If either title or content is missing
  if (!title || !content) {
    return res.status(400).send("Invalid input");
  }

  const newNote = {

    // FIX: generateNoteId() should be called here
    id: generateNoteId(),

    title,
    content,
    userId
  };

  notes.push(newNote);

  res.send(newNote);
});

 
// DELETE NOTE
 
app.delete("/notes/:id", (req, res) => {

  // FIX: Convert id to number
  const id = Number(req.params.id);

  const noteIndex = notes.findIndex(n => n.id === id);

  // FIX: Added validation if note not found
  if (noteIndex === -1) {
    return res.status(404).send({ message: "Note not found" });
  }

  notes.splice(noteIndex, 1);

  res.send({ message: "Note deleted" });
});

 
// UPDATE USER
 
app.put("/users/:id", (req, res) => {

  const id = Number(req.params.id);

  const { name } = req.body;

  const user = users.find(u => u.id === id);

  // FIX: Added user existence check
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // FIX: username variable did not exist
  user.name = name;

  res.send(user);
});

 
// GET NOTES OF A USER
 
app.get("/user-notes/:userId", (req, res) => {

  // FIX: Convert to number
  const userId = Number(req.params.userId);

  // FIX: = changed to ===
  const userNotes = notes.filter(n => n.userId === userId);

  res.send(userNotes);
});

 
// LOGIN
 
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  // FIX: || changed to &&
  if (email === "admin@test.com" && password === "123456") {

    res.send({ message: "Login successful" });

  } else {

    res.status(401).send({
      message: "Invalid credentials"
    });
  }
});

 
// PROFILE
 
app.get("/profile/:id", (req, res) => {

  const id = Number(req.params.id);

  // FIX: filter() returns array
  // find() returns single object
  const user = users.find(u => u.id === id);

  // FIX: Added validation
  if (!user) {
    return res.status(404).send({
      message: "User not found"
    });
  }

  res.send(user.name);
});

 
// SUM API
 
app.post("/sum", (req, res) => {

  const { a, b } = req.body;

  // FIX: Convert to numbers to avoid string concatenation
  const total = Number(a) + Number(b);

  res.send({ total });
});

 
// START SERVER
 
app.listen(3000, () => {

  // FIX: Wrong port number in message
  console.log("Server running on port 3000");
});