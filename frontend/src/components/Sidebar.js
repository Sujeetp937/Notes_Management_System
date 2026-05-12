import React from 'react';
import { useNotes } from '../context/NotesContext';
import { NOTE_COLORS } from '../utils/helpers';

export default function Sidebar({ onNewNote }) {
  const { tags, activeFilter, setFilter, notes } = useNotes();

  const pinnedCount = notes.filter(n => n.isPinned).length;

  return (
    <div className="flex flex-col h-full bg-paper-cream border-r border-ink-200">
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-ink-200">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-paper" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-serif text-ink-900 text-lg leading-none">Noteflow</h1>
            <p className="text-[10px] font-sans text-ink-400 mt-0.5">{notes.length} notes</p>
          </div>
        </div>

        <button
          onClick={onNewNote}
          className="w-full flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-700 text-paper font-sans text-sm font-medium rounded-xl px-4 py-2.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M12 4v16m-8-8h16" />
          </svg>
          New Note
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {/* Views */}
        <div>
          <p className="text-[10px] font-sans font-semibold text-ink-400 uppercase tracking-widest px-2 mb-1.5">Views</p>
          <SidebarItem
            icon={<AllIcon />}
            label="All Notes"
            count={notes.length}
            active={!activeFilter.pinned}
            onClick={() => setFilter({ pinned: false, tags: [], color: null })}
          />
          <SidebarItem
            icon={<PinIcon />}
            label="Pinned"
            count={pinnedCount}
            active={activeFilter.pinned}
            onClick={() => setFilter({ pinned: true })}
          />
        </div>

        {/* Colors */}
        <div>
          <p className="text-[10px] font-sans font-semibold text-ink-400 uppercase tracking-widest px-2 mb-1.5">Colors</p>
          <SidebarItem
            icon={<span className="w-2.5 h-2.5 rounded-full bg-ink-400" />}
            label="All colors"
            active={!activeFilter.color}
            onClick={() => setFilter({ color: null })}
          />
          {Object.entries(NOTE_COLORS).filter(([k]) => k !== 'default').map(([key, cfg]) => (
            <SidebarItem
              key={key}
              icon={<span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />}
              label={cfg.label}
              active={activeFilter.color === key}
              onClick={() => setFilter({ color: activeFilter.color === key ? null : key })}
            />
          ))}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div>
            <p className="text-[10px] font-sans font-semibold text-ink-400 uppercase tracking-widest px-2 mb-1.5">Tags</p>
            {tags.map(tag => (
              <SidebarItem
                key={tag}
                icon={<TagIcon />}
                label={tag}
                active={activeFilter.tags?.includes(tag)}
                onClick={() => {
                  const currentTags = activeFilter.tags || [];
                  const newTags = currentTags.includes(tag)
                    ? currentTags.filter(t => t !== tag)
                    : [...currentTags, tag];
                  setFilter({ tags: newTags });
                }}
              />
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-sans transition-all text-left
        ${active ? 'bg-ink-900 text-paper' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'}`}
    >
      <span className={`flex-shrink-0 w-4 h-4 flex items-center justify-center ${active ? 'text-paper' : 'text-ink-400'}`}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className={`text-xs rounded-full px-1.5 py-0.5 ${active ? 'bg-white/20 text-paper' : 'bg-ink-200 text-ink-500'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function AllIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="w-4 h-4">
      <path strokeLinecap="round" d="M4 6h16M4 10h16M4 14h16M4 18h7" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/>
    </svg>
  );
}

function TagIcon() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M3 3h8l10 10a2 2 0 010 2.83l-5.17 5.17a2 2 0 01-2.83 0L3 11V3z"/>
    </svg>
  );
}
