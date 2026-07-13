import { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORIES = [
  { key: 'people', label: 'People', emoji: '💛', color: 'bg-pastel-peach' },
  { key: 'health', label: 'Health', emoji: '💚', color: 'bg-pastel-mint' },
  { key: 'nature', label: 'Nature', emoji: '🌿', color: 'bg-pastel-lemon' },
  { key: 'work', label: 'Work', emoji: '💼', color: 'bg-pastel-sky' },
  { key: 'moments', label: 'Moments', emoji: '✨', color: 'bg-pastel-lavender' },
  { key: 'other', label: 'Other', emoji: '🙏', color: 'bg-pastel-pink' },
];

const EMOJIS = ['🙏', '💛', '🌸', '✨', '☀️', '🌈', '💫', '🤍'];

export default function App() {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({ total: 0, byCategory: [] });
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ text: '', category: 'people', emoji: '🙏' });
  const [editing, setEditing] = useState(null);

  const fetchEntries = () => {
    const q = filter === 'all' ? '' : `?category=${filter}`;
    axios.get(`/api/entries${q}`).then(r => setEntries(r.data));
    axios.get('/api/entries/stats').then(r => setStats(r.data));
  };

  useEffect(() => { fetchEntries(); }, [filter]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;
    if (editing) {
      await axios.put(`/api/entries/${editing}`, form);
      setEditing(null);
    } else {
      await axios.post('/api/entries', form);
    }
    setForm({ text: '', category: 'people', emoji: '🙏' });
    fetchEntries();
  };

  const remove = async (id) => {
    await axios.delete(`/api/entries/${id}`);
    fetchEntries();
  };

  const startEdit = (entry) => {
    setEditing(entry._id);
    setForm({ text: entry.text, category: entry.category, emoji: entry.emoji });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cat = (key) => CATEGORIES.find(c => c.key === key) || CATEGORIES[5];

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-1">🌷 Gratitude Journal</h1>
      <p className="text-center text-pastel-text/70 mb-6">Day 01 — Write three good things, every day</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-pastel-pink/50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs opacity-60">Total entries</p>
        </div>
        <div className="bg-pastel-mint/50 rounded-2xl p-4 text-center col-span-2">
          <p className="text-xs opacity-60 mb-1">Top category</p>
          <p className="font-semibold capitalize">
            {stats.byCategory[0]?._id || '—'} {stats.byCategory[0] ? `(${stats.byCategory[0].count})` : ''}
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="bg-pastel-lavender/40 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="font-bold mb-3">{editing ? 'Edit entry' : 'What are you grateful for?'}</h2>
        <textarea
          className="w-full p-3 rounded-xl mb-3 bg-white/80 resize-none h-24"
          placeholder="Today I'm grateful for..."
          value={form.text}
          onChange={e => setForm({ ...form, text: e.target.value })}
          required
        />
        <div className="flex flex-wrap gap-2 mb-3">
          {CATEGORIES.map(c => (
            <button key={c.key} type="button"
              onClick={() => setForm({ ...form, category: c.key })}
              className={`px-3 py-1.5 rounded-full text-sm ${form.category === c.key ? c.color + ' ring-2 ring-pastel-lilac' : 'bg-white/60'}`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {EMOJIS.map(e => (
            <button key={e} type="button" onClick={() => setForm({ ...form, emoji: e })}
              className={`text-xl p-1 rounded-lg ${form.emoji === e ? 'bg-white ring-2 ring-pastel-lilac' : ''}`}>
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 py-3 bg-pastel-lilac rounded-xl font-bold hover:opacity-90">
            {editing ? 'Update' : 'Save Gratitude'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ text: '', category: 'people', emoji: '🙏' }); }}
              className="px-4 py-3 bg-white/60 rounded-xl">Cancel</button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-pastel-lilac' : 'bg-white/60'}`}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setFilter(c.key)}
            className={`px-3 py-1 rounded-full text-sm ${filter === c.key ? c.color : 'bg-white/60'}`}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="text-center opacity-50 py-8">No entries yet — add your first gratitude above ✨</p>
        )}
        {entries.map(entry => {
          const c = cat(entry.category);
          return (
            <div key={entry._id} className={`${c.color}/60 rounded-xl p-4 flex gap-3`}>
              <span className="text-2xl">{entry.emoji}</span>
              <div className="flex-1">
                <p>{entry.text}</p>
                <p className="text-xs opacity-50 mt-2">
                  {c.emoji} {c.label} · {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => startEdit(entry)} className="text-sm opacity-60 hover:opacity-100">Edit</button>
                <button onClick={() => remove(entry._id)} className="text-sm text-red-400 hover:text-red-600">Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
