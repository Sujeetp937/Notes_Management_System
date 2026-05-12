import { useEffect, useRef, useCallback } from 'react';

export function useAutoSave(value, onSave, delay = 1500) {
  const timeoutRef = useRef(null);
  const lastSavedRef = useRef(value);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const triggerSave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (JSON.stringify(value) !== JSON.stringify(lastSavedRef.current)) {
        lastSavedRef.current = value;
        onSaveRef.current(value);
      }
    }, delay);
  }, [value, delay]);

  useEffect(() => {
    triggerSave();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [triggerSave]);

  const saveNow = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (JSON.stringify(value) !== JSON.stringify(lastSavedRef.current)) {
      lastSavedRef.current = value;
      onSaveRef.current(value);
    }
  }, [value]);

  return { saveNow };
}
