#  Noteflow — Notes Management System

A full-stack Notes Management System built with **React**, **Express.js**, **MongoDB**, and **Tailwind CSS**.

---

##  Features

### Core
- **Create** notes with title, content, tags, and color
- **View** all notes sorted by most recently updated
- **Edit** notes with auto-save (saves after 1.2s of inactivity)
- **Delete** notes with confirmation dialog
- **Search** notes by title and content (full-text search via MongoDB)
- **View** individual notes in the editor panel

### Bonus
-  **Tags/Categories** — Add multiple tags to notes, filter by tag
-  **Pin notes** — Pinned notes appear at the top
-  **Auto-save** — Changes are automatically saved after a short delay
-  **Color labels** — 8 color options for visual organization
-  **Responsive** — Works on mobile, tablet, and desktop

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Validation | express-validator |
| State | React Context + useReducer |

---

##  Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone & Install

```bash
# Install all dependencies
npm run install:all
```

### 2. Configure Environment

```bash


#Create`backend/.env`:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesdb
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Start Development Servers

```bash
# Run both frontend and backend together
npm run dev

# Or separately:
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:3000
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes (supports ?search, ?tags, ?color, ?pinned) |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| PATCH | `/api/notes/:id/pin` | Toggle pin status |
| GET | `/api/notes/tags` | Get all distinct tags |
| GET | `/api/health` | Health check |

### Request Body (POST / PUT)
```json
{
  "title": "My Note Title",       // required
  "content": "Note body text",    // optional
  "tags": ["work", "ideas"],      // optional array
  "color": "yellow",              // optional: default|red|orange|yellow|green|teal|blue|purple
  "isPinned": false               // optional boolean
}
```

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "count": 5     // for list endpoints
}
```

### Search
```
GET /api/notes?search=meeting notes
GET /api/notes?tags=work,personal
GET /api/notes?color=yellow
GET /api/notes?pinned=true
```

---

## 🗂️ Project Structure

```
notes-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   └── notesController.js # Business logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js    # Global error handling
│   │   │   └── validation.js      # Input validation rules
│   │   ├── models/
│   │   │   └── Note.js            # Mongoose schema
│   │   ├── routes/
│   │   │   └── notes.js           # Express routes
│   │   └── server.js              # App entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NoteCard.js        # Note list item
│   │   │   ├── NoteEditor.js      # Note editing panel
│   │   │   ├── SearchBar.js       # Search input
│   │   │   └── Sidebar.js         # Navigation & filters
│   │   ├── context/
│   │   │   └── NotesContext.js    # Global state management
│   │   ├── hooks/
│   │   │   └── useAutoSave.js     # Auto-save hook
│   │   ├── pages/
│   │   │   └── App.js             # Main layout page
│   │   ├── utils/
│   │   │   ├── api.js             # Axios API client
│   │   │   └── helpers.js         # Utility functions
│   │   ├── index.css              # Tailwind + global styles
│   │   └── index.js               # React entry point
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                   # Root scripts
└── README.md
```

---

##  Database Schema

```javascript
{
  _id: ObjectId,
  title: String,        // required, max 200 chars
  content: String,      // optional
  tags: [String],       // array, max 10 tags
  color: String,        // enum: default|red|orange|yellow|green|teal|blue|purple
  isPinned: Boolean,    // default: false
  createdAt: Date,      // auto-managed by Mongoose
  updatedAt: Date,      // auto-managed by Mongoose
}
```

**Indexes:**
- Text index on `title`, `content`, `tags` for full-text search
- Compound index on `isPinned DESC, updatedAt DESC` for sorted queries

---

##  Design Decisions

- **Auto-save**: Debounced 1.2s delay to avoid excessive API calls while typing
- **Context + useReducer**: Lightweight global state without Redux overhead
- **Text index**: MongoDB native full-text search for efficient title/content search
- **Optimistic UI**: Notes list updates immediately from context before API confirms
- **Error boundaries**: All API errors surfaced via toast notifications

---

##  UI Overview

- **3-panel layout**: Sidebar (filters/tags) + Notes list + Editor
- **Responsive**: Panels collapse on mobile with hamburger navigation
- **Color themes**: Each note can have a background color
- **Typography**: Instrument Serif for headings, DM Sans for body
