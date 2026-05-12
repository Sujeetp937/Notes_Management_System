import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { NotesProvider } from './context/NotesContext';
import App from './pages/App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotesProvider>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            background: '#261f1a',
            color: '#faf8f4',
            borderRadius: '10px',
            padding: '10px 16px',
          },
          success: { iconTheme: { primary: '#c17d3c', secondary: '#faf8f4' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#faf8f4' } },
          duration: 2500,
        }}
      />
    </NotesProvider>
  </React.StrictMode>
);
