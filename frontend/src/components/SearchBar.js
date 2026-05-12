import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';

export default function SearchBar() {
  const { searchQuery, setSearch } = useNotes();
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative transition-all duration-200 ${focused ? 'scale-[1.01]' : ''}`}>
      <div className={`
        flex items-center gap-2 bg-white border rounded-xl px-3.5 py-2.5 transition-all duration-200
        ${focused ? 'border-accent shadow-sm shadow-accent/10' : 'border-ink-200'}
      `}>
        <svg className="w-4 h-4 text-ink-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search notes by title or content…"
          className="flex-1 text-sm font-sans text-ink-900 placeholder-ink-400 bg-transparent outline-none min-w-0"
        />
        {searchQuery && (
          <button
            onClick={() => setSearch('')}
            className="text-ink-400 hover:text-ink-600 transition-colors flex-shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
