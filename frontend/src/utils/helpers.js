import { formatDistanceToNow, format } from 'date-fns';

export const NOTE_COLORS = {
  default: { bg: 'bg-paper-warm', border: 'border-ink-200', dot: 'bg-ink-400', label: 'Default' },
  red:     { bg: 'bg-red-50',     border: 'border-red-200',    dot: 'bg-red-400',    label: 'Red' },
  orange:  { bg: 'bg-orange-50',  border: 'border-orange-200', dot: 'bg-orange-400', label: 'Orange' },
  yellow:  { bg: 'bg-yellow-50',  border: 'border-yellow-200', dot: 'bg-yellow-400', label: 'Yellow' },
  green:   { bg: 'bg-green-50',   border: 'border-green-200',  dot: 'bg-green-500',  label: 'Green' },
  teal:    { bg: 'bg-teal-50',    border: 'border-teal-200',   dot: 'bg-teal-500',   label: 'Teal' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',   dot: 'bg-blue-400',   label: 'Blue' },
  purple:  { bg: 'bg-purple-50',  border: 'border-purple-200', dot: 'bg-purple-400', label: 'Purple' },
};

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 1) return formatDistanceToNow(date, { addSuffix: true });
  if (diffDays < 7) return format(date, 'EEE, MMM d');
  return format(date, 'MMM d, yyyy');
}

export function truncate(str, max = 120) {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export function highlight(text, query) {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>');
}
