const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'default',
      enum: ['default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple'],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Text index for efficient search on title and content
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Index for sorting by updatedAt and pinned status
noteSchema.index({ isPinned: -1, updatedAt: -1 });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
