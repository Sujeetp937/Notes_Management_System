const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  getAllTags,
} = require('../controllers/notesController');
const { validateNote, validateNoteUpdate } = require('../middleware/validation');

// GET /api/notes/tags - Must be before /:id to avoid conflict
router.get('/tags', getAllTags);

// GET /api/notes?search=...&tags=...&color=...&pinned=...
router.get('/', getNotes);

// GET /api/notes/:id
router.get('/:id', getNoteById);

// POST /api/notes
router.post('/', validateNote, createNote);

// PUT /api/notes/:id
router.put('/:id', validateNoteUpdate, updateNote);

// PATCH /api/notes/:id/pin
router.patch('/:id/pin', togglePin);

// DELETE /api/notes/:id
router.delete('/:id', deleteNote);

module.exports = router;
