import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const COLORS = ['pastel-lemon', 'pastel-pink', 'pastel-mint', 'pastel-sky', 'pastel-peach'];

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [color, setColor] = useState('pastel-lemon');
  const containerRef = useRef(null);

  const fetch = () => axios.get('/api/notes').then(r => setNotes(r.data));
  useEffect(() => { fetch(); }, []);

  const add = async () => {
    if (!text.trim()) return;
    const x = Math.random() * 200 + 50;
    const y = Math.random() * 150 + 50;
    await axios.post('/api/notes', { text, color, x, y });
    setText('');
    fetch();
  };

  const startDrag = (e, note) => {
    if (e.target.tagName.toLowerCase() === 'button') return;
    e.preventDefault();

    const noteElement = e.currentTarget;
    const noteRect = noteElement.getBoundingClientRect();
    const containerElement = containerRef.current;
    const containerRect = containerElement.getBoundingClientRect();

    const offsetX = e.clientX - noteRect.left;
    const offsetY = e.clientY - noteRect.top;

    const move = (moveEvent) => {
      let nextX = moveEvent.clientX - containerRect.left - offsetX;
      let nextY = moveEvent.clientY - containerRect.top - offsetY;

      nextX = Math.max(0, Math.min(nextX, containerRect.width - noteRect.width));
      nextY = Math.max(0, Math.min(nextY, containerRect.height - noteRect.height));

      setNotes(prev => prev.map(n => n._id === note._id ? { ...n, x: nextX, y: nextY } : n));
    };

    const up = async (upEvent) => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);

      let finalX = upEvent.clientX - containerRect.left - offsetX;
      let finalY = upEvent.clientY - containerRect.top - offsetY;

      finalX = Math.max(0, Math.min(finalX, containerRect.width - noteRect.width));
      finalY = Math.max(0, Math.min(finalY, containerRect.height - noteRect.height));

      await axios.put(`/api/notes/${note._id}`, { x: finalX, y: finalY });
      fetch();
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const colorMap = {
    'pastel-lemon': 'bg-pastel-lemon',
    'pastel-pink': 'bg-pastel-pink',
    'pastel-mint': 'bg-pastel-mint',
    'pastel-sky': 'bg-pastel-sky',
    'pastel-peach': 'bg-pastel-peach'
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-4">📝 Sticky Notes Board</h1>
      <div className="max-w-md mx-auto mb-6 flex gap-2">
        <input
          className="flex-1 p-3 rounded-xl bg-white/80 shadow-sm border border-pastel-lilac/20"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a note..."
        />
        <select
          className="p-3 rounded-xl bg-white/80 shadow-sm border border-pastel-lilac/20 capitalize"
          value={color}
          onChange={e => setColor(e.target.value)}
        >
          {COLORS.map(c => <option key={c} value={c}>{c.replace('pastel-', '')}</option>)}
        </select>
        <button onClick={add} className="px-5 bg-pastel-lilac rounded-xl font-bold hover:opacity-90 transition-opacity">+</button>
      </div>
      <div
        ref={containerRef}
        className="relative h-[500px] bg-pastel-lavender/20 rounded-2xl border-2 border-dashed border-pastel-lilac/30 max-w-4xl mx-auto overflow-hidden"
      >
        {notes.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-pastel-text/50 font-medium">
            No notes yet — write one above to post it here ✨
          </p>
        )}
        {notes.map(n => (
          <div
            key={n._id}
            onMouseDown={e => startDrag(e, n)}
            style={{ left: `${n.x}px`, top: `${n.y}px`, position: 'absolute' }}
            className={`${colorMap[n.color] || 'bg-pastel-lemon'} w-40 p-3 rounded-lg shadow-md rotate-1 cursor-move select-none transition-shadow hover:shadow-lg`}
          >
            <p className="text-sm text-pastel-text font-medium break-words leading-snug">{n.text}</p>
            <button
              onClick={() => axios.delete(`/api/notes/${n._id}`).then(fetch)}
              className="text-xs text-red-400 hover:text-red-600 mt-2 block font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
