import React, { useEffect, useState } from 'react';
import { useNotes } from '../context/NotesContext';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import SearchBar from '../components/SearchBar';

export default function App() {
  const { notes, loading, error, selectedNote, selectNote, fetchNotes, fetchTags, searchQuery } = useNotes();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchTags();
  }, []);

  const handleNewNote = () => {
    selectNote(null);
    setShowEditor(true);
    setSidebarOpen(false);
  };

  const handleSelectNote = (note) => {
    selectNote(note);
    setShowEditor(true);
    setSidebarOpen(false);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    selectNote(null);
    fetchNotes({ search: searchQuery });
    fetchTags();
  };

  return (
    <div className="flex h-screen bg-paper overflow-hidden font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-ink-950/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-30 w-56 flex-shrink-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onNewNote={handleNewNote} />
      </div>

      {/* Notes list panel */}
      <div className={`
        flex flex-col flex-shrink-0 border-r border-ink-200 bg-paper
        w-full lg:w-72 xl:w-80
        ${showEditor ? 'hidden lg:flex' : 'flex'}
      `}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-ink-200">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-100 rounded-lg transition-colors"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-ink-900 text-lg flex-1">Notes</h2>
            <button
              onClick={handleNewNote}
              className="flex items-center gap-1.5 text-xs font-sans font-medium text-accent hover:text-accent-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M12 4v16m-8-8h16" />
              </svg>
              New
            </button>
          </div>
          <SearchBar />
        </div>

        {/* Notes list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-sans text-ink-400">Loading notes…</p>
            </div>
          )}

          {error && (
            <div className="mx-2 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-sans text-red-600 font-medium">Connection error</p>
              <p className="text-xs font-sans text-red-400 mt-1">{error}</p>
              <button onClick={() => fetchNotes()} className="text-xs text-red-600 underline mt-2 font-sans">Retry</button>
            </div>
          )}

          {!loading && !error && notes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
              <div className="w-14 h-14 bg-paper-cream rounded-2xl flex items-center justify-center border border-ink-200">
                <svg className="w-7 h-7 text-ink-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-ink-700 text-base">
                  {searchQuery ? 'No notes found' : 'No notes yet'}
                </p>
                <p className="text-xs font-sans text-ink-400 mt-1">
                  {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
                </p>
              </div>
              {!searchQuery && (
                <button
                  onClick={handleNewNote}
                  className="text-sm font-sans font-medium text-accent hover:text-accent-dark underline transition-colors"
                >
                  Create a note
                </button>
              )}
            </div>
          )}

          {!loading && notes.map(note => (
            <div key={note._id} onClick={() => handleSelectNote(note)} className="animate-fade-in">
              <NoteCard
                note={note}
                isSelected={selectedNote?._id === note._id}
                searchQuery={searchQuery}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Editor panel */}
      <div className={`
        flex-1 overflow-hidden
        ${showEditor ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}
      `}>
        {showEditor || selectedNote ? (
          <NoteEditor onClose={handleCloseEditor} />
        ) : (
          <EmptyEditorState onNewNote={handleNewNote} />
        )}
      </div>
    </div>
  );
}

function EmptyEditorState({ onNewNote }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-paper-warm gap-4 text-center p-8">
      <div className="w-20 h-20 bg-paper border-2 border-ink-200 rounded-3xl flex items-center justify-center shadow-sm">
        <svg className="w-9 h-9 text-ink-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
        </svg>
      </div>
      <div>
        <h3 className="font-serif text-ink-800 text-xl">Select a note to edit</h3>
        <p className="text-sm font-sans text-ink-400 mt-1.5">Or create a new one to get started</p>
      </div>
      <button
        onClick={onNewNote}
        className="flex items-center gap-2 bg-ink-900 hover:bg-ink-700 text-paper font-sans text-sm font-medium rounded-xl px-5 py-2.5 transition-colors mt-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" d="M12 4v16m-8-8h16" />
        </svg>
        New Note
      </button>
    </div>
  );
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
