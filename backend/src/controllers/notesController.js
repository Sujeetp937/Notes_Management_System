const Note = require('../models/Note');

// @desc    Get all notes (with optional search)
// @route   GET /api/notes
// @access  Public
const getNotes = async (req, res, next) => {
  try {
    const { search, tags, color, pinned } = req.query;

    let query = {};

    // Full-text search
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagArray.length > 0) {
        query.tags = { $in: tagArray };
      }
    }

    // Filter by color
    if (color) {
      query.color = color;
    }

    // Filter pinned only
    if (pinned === 'true') {
      query.isPinned = true;
    }

    const sortOptions = search
      ? { score: { $meta: 'textScore' }, isPinned: -1, updatedAt: -1 }
      : { isPinned: -1, updatedAt: -1 };

    const selectOptions = search ? { score: { $meta: 'textScore' } } : {};

    const notes = await Note.find(query, selectOptions).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Public
const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;

    const note = await Note.create({
      title: title.trim(),
      content: content || '',
      tags: tags || [],
      color: color || 'default',
      isPinned: isPinned || false,
    });

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Public
const updateNote = async (req, res, next) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (color !== undefined) updateData.color = color;
    if (isPinned !== undefined) updateData.isPinned = isPinned;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin status
// @route   PATCH /api/notes/:id/pin
// @access  Public
const togglePin = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Public
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, error: 'Note not found' });
    }

    res.status(200).json({ success: true, data: {}, message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique tags
// @route   GET /api/notes/tags
// @access  Public
const getAllTags = async (req, res, next) => {
  try {
    const tags = await Note.distinct('tags');
    res.status(200).json({ success: true, data: tags.filter(Boolean) });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote, togglePin, getAllTags };
