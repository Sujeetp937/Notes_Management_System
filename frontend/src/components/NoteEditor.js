import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNotes } from '../context/NotesContext';
import { NOTE_COLORS, formatDate } from '../utils/helpers';
import { useAutoSave } from '../hooks/useAutoSave';

const COLOR_OPTIONS = Object.entries(NOTE_COLORS);

export default function NoteEditor({ onClose }) {
  const { selectedNote, createNote, updateNote, deleteNote } = useNotes();
  const isNew = !selectedNote?._id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [color, setColor] = useState('default');
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const titleRef = useRef(null);
  const noteIdRef = useRef(null);

  // When selectedNote changes, populate form
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setContent(selectedNote.content || '');
      setTags(selectedNote.tags || []);
      setColor(selectedNote.color || 'default');
      noteIdRef.current = selectedNote._id;
      setErrors({});
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setColor('default');
      noteIdRef.current = null;
      setErrors({});
    }
  }, [selectedNote?._id]);

  useEffect(() => {
    if (!selectedNote?._id) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [selectedNote?._id]);

  const validate = useCallback(() => {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [title]);

  const doSave = useCallback(async (vals) => {
    if (!vals.title?.trim()) return;
    setSaving(true);
    setSaved(false);
    try {
      const payload = {
        title: vals.title.trim(),
        content: vals.content,
        tags: vals.tags,
        color: vals.color,
      };
      if (noteIdRef.current) {
        await updateNote(noteIdRef.current, payload);
      } else {
        const created = await createNote(payload);
        noteIdRef.current = created._id;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (_) {
    } finally {
      setSaving(false);
    }
  }, [createNote, updateNote]);

  const autoSaveValue = { title, content, tags, color };
  const { saveNow } = useAutoSave(autoSaveValue, doSave, 1200);

  const handleManualSave = async () => {
    if (!validate()) return;
    saveNow();
  };

  const handleDelete = async () => {
    if (!noteIdRef.current) { onClose?.(); return; }
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      await deleteNote(noteIdRef.current);
      onClose?.();
    }
  };

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setTags(prev => [...prev, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => setTags(prev => prev.filter(t => t !== tag));
  const colorConfig = NOTE_COLORS[color] || NOTE_COLORS.default;

  return (
    <div className={`flex flex-col h-full ${colorConfig.bg} transition-colors duration-300`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-5 py-3 border-b ${colorConfig.border} bg-white/40 backdrop-blur-sm`}>
        <div className="flex items-center gap-2">
          {/* Color picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(p => !p)}
              className="flex items-center gap-1.5 text-xs font-sans text-ink-500 hover:text-ink-700 bg-white/60 hover:bg-white border border-ink-200 rounded-lg px-2.5 py-1.5 transition-all"
            >
              <span className={`w-3 h-3 rounded-full ${colorConfig.dot}`} />
              Color
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-ink-200 rounded-xl shadow-lg p-2 z-20 flex flex-wrap gap-1.5 w-44 animate-scale-in">
                {COLOR_OPTIONS.map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => { setColor(key); setShowColorPicker(false); }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-sans text-ink-600 hover:bg-ink-50 transition-colors w-full ${color === key ? 'bg-ink-50 font-medium' : ''}`}
                  >
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    {cfg.label}
                    {color === key && <CheckIcon className="w-3 h-3 ml-auto text-accent" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save status */}
          <span className={`text-xs font-sans transition-all duration-300 ${saving ? 'text-ink-400' : saved ? 'text-green-500' : 'text-transparent'}`}>
            {saving ? 'Saving…' : 'Saved ✓'}
          </span>

          <button
            onClick={handleManualSave}
            disabled={saving}
            className="text-xs font-sans font-medium text-white bg-accent hover:bg-accent-dark disabled:opacity-50 rounded-lg px-3 py-1.5 transition-colors"
          >
            Save
          </button>

          {noteIdRef.current && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete note"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded-lg transition-colors lg:hidden"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Title */}
        <div>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); if (errors.title) setErrors({}); }}
            placeholder="Note title…"
            className={`w-full font-serif text-2xl text-ink-900 bg-transparent outline-none placeholder-ink-300 border-b pb-2 transition-colors
              ${errors.title ? 'border-red-400' : 'border-transparent focus:border-ink-200'}`}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1 font-sans">{errors.title}</p>}
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Start writing your note…"
          rows={14}
          className="w-full font-sans text-sm text-ink-700 leading-relaxed bg-transparent outline-none placeholder-ink-300 resize-none"
        />

        {/* Tags */}
        <div className="pt-2 border-t border-ink-100">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs font-sans bg-white/70 border border-ink-200 text-ink-600 rounded-full px-2.5 py-0.5">
                {tag}
                <button onClick={() => removeTag(tag)} className="text-ink-400 hover:text-red-500 transition-colors leading-none">×</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Add tags (press Enter)…"
            className="w-full text-xs font-sans text-ink-600 bg-transparent outline-none placeholder-ink-400"
          />
        </div>

        {/* Meta */}
        {selectedNote && (
          <div className="pt-2 border-t border-ink-100 space-y-0.5">
            <p className="text-[10px] font-sans text-ink-400">Created {formatDate(selectedNote.createdAt)}</p>
            <p className="text-[10px] font-sans text-ink-400">Updated {formatDate(selectedNote.updatedAt)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
