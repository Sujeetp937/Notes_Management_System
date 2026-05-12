import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import { notesApi } from '../utils/api';
import toast from 'react-hot-toast';

const NotesContext = createContext(null);

const initialState = {
  notes: [],
  loading: false,
  error: null,
  searchQuery: '',
  activeFilter: { tags: [], color: null, pinned: false },
  selectedNote: null,
  tags: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    case 'SET_NOTES': return { ...state, notes: action.payload, loading: false, error: null };
    case 'SET_TAGS': return { ...state, tags: action.payload };
    case 'ADD_NOTE': return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE': return {
      ...state,
      notes: state.notes.map(n => n._id === action.payload._id ? action.payload : n),
      selectedNote: state.selectedNote?._id === action.payload._id ? action.payload : state.selectedNote,
    };
    case 'DELETE_NOTE': return {
      ...state,
      notes: state.notes.filter(n => n._id !== action.payload),
      selectedNote: state.selectedNote?._id === action.payload ? null : state.selectedNote,
    };
    case 'SET_SEARCH': return { ...state, searchQuery: action.payload };
    case 'SET_FILTER': return { ...state, activeFilter: { ...state.activeFilter, ...action.payload } };
    case 'SET_SELECTED': return { ...state, selectedNote: action.payload };
    default: return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const searchTimeout = useRef(null);

  const fetchNotes = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await notesApi.getAll(params);
      dispatch({ type: 'SET_NOTES', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const res = await notesApi.getTags();
      dispatch({ type: 'SET_TAGS', payload: res.data });
    } catch (_) {}
  }, []);

  const createNote = useCallback(async (data) => {
    const toastId = toast.loading('Creating note...');
    try {
      const res = await notesApi.create(data);
      dispatch({ type: 'ADD_NOTE', payload: res.data });
      toast.success('Note created!', { id: toastId });
      fetchTags();
      return res.data;
    } catch (err) {
      toast.error(err.message, { id: toastId });
      throw err;
    }
  }, [fetchTags]);

  const updateNote = useCallback(async (id, data) => {
    try {
      const res = await notesApi.update(id, data);
      dispatch({ type: 'UPDATE_NOTE', payload: res.data });
      toast.success('Note saved');
      fetchTags();
      return res.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  }, [fetchTags]);

  const deleteNote = useCallback(async (id) => {
    const toastId = toast.loading('Deleting...');
    try {
      await notesApi.delete(id);
      dispatch({ type: 'DELETE_NOTE', payload: id });
      toast.success('Note deleted', { id: toastId });
      fetchTags();
    } catch (err) {
      toast.error(err.message, { id: toastId });
      throw err;
    }
  }, [fetchTags]);

  const togglePin = useCallback(async (id) => {
    try {
      const res = await notesApi.togglePin(id);
      dispatch({ type: 'UPDATE_NOTE', payload: res.data });
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  const setSearch = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchNotes({ search: query });
    }, 400);
  }, [fetchNotes]);

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
    const params = {};
    const merged = { ...state.activeFilter, ...filter };
    if (state.searchQuery) params.search = state.searchQuery;
    if (merged.tags?.length) params.tags = merged.tags.join(',');
    if (merged.color) params.color = merged.color;
    if (merged.pinned) params.pinned = true;
    fetchNotes(params);
  }, [state.activeFilter, state.searchQuery, fetchNotes]);

  const selectNote = useCallback((note) => {
    dispatch({ type: 'SET_SELECTED', payload: note });
  }, []);

  return (
    <NotesContext.Provider value={{
      ...state,
      fetchNotes,
      fetchTags,
      createNote,
      updateNote,
      deleteNote,
      togglePin,
      setSearch,
      setFilter,
      selectNote,
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
