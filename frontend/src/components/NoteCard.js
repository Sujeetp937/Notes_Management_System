import React from 'react';
import { useNotes } from '../context/NotesContext';
import { NOTE_COLORS, formatDate, truncate } from '../utils/helpers';

export default function NoteCard({ note, isSelected, searchQuery }) {
  const { selectNote, togglePin, deleteNote } = useNotes();
  const color = NOTE_COLORS[note.color] || NOTE_COLORS.default;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${note.title}"? This cannot be undone.`)) {
      deleteNote(note._id);
    }
  };

  const handlePin = (e) => {
    e.stopPropagation();
    togglePin(note._id);
  };

  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i} className="bg-yellow-200 text-ink-900 rounded px-0.5">{part}</mark> : part
    );
  };

  return (
    <div
      onClick={() => selectNote(note)}
      className={`
        group relative cursor-pointer rounded-xl border p-4 transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5 select-none
        ${color.bg} ${color.border}
        ${isSelected ? 'ring-2 ring-accent shadow-md -translate-y-0.5' : ''}
      `}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-sm">
          <PinIcon className="w-2.5 h-2.5 text-white" />
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handlePin}
          className={`p-1.5 rounded-lg hover:bg-white/80 transition-colors ${note.isPinned ? 'text-accent' : 'text-ink-400'}`}
          title={note.isPinned ? 'Unpin' : 'Pin note'}
        >
          <PinIcon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg hover:bg-red-100 hover:text-red-600 text-ink-400 transition-colors"
          title="Delete note"
        >
          <TrashIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <h3 className="font-serif text-ink-900 text-[15px] leading-snug mb-1.5 pr-12 line-clamp-2">
        {highlightText(note.title)}
      </h3>

      {note.content && (
        <p className="text-ink-500 text-xs leading-relaxed mb-3 font-sans line-clamp-3">
          {highlightText(truncate(note.content, 140))}
        </p>
      )}

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-sans font-medium text-ink-500 bg-white/60 border border-ink-200 rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] font-sans text-ink-400">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Date */}
      <p className="text-[10px] font-sans text-ink-400 mt-auto">
        {formatDate(note.updatedAt)}
      </p>
    </div>
  );
}

function PinIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
