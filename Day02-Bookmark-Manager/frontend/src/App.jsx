import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ title: '', url: '', tags: '' });

  const fetch = () => axios.get('/api/bookmarks', { params: filter ? { tag: filter } : {} }).then(r => setBookmarks(r.data));
  useEffect(() => { fetch(); }, [filter]);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/bookmarks', { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) });
    setForm({ title: '', url: '', tags: '' });
    fetch();
  };

  const allTags = [...new Set(bookmarks.flatMap(b => b.tags))];

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">🔖 Bookmark Manager</h1>
      <form onSubmit={submit} className="bg-pastel-sky/50 rounded-2xl p-6 mb-6 grid gap-3">
        <input className="p-3 rounded-xl bg-white/80" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input className="p-3 rounded-xl bg-white/80" placeholder="URL" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} required />
        <input className="p-3 rounded-xl bg-white/80" placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
        <button className="py-3 bg-pastel-lilac rounded-xl font-bold">Add Bookmark</button>
      </form>
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter('')} className={`px-3 py-1 rounded-full ${!filter ? 'bg-pastel-lilac' : 'bg-white/60'}`}>All</button>
        {allTags.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1 rounded-full ${filter === t ? 'bg-pastel-mint' : 'bg-white/60'}`}>{t}</button>
        ))}
      </div>
      <div className="grid gap-3">
        {bookmarks.map(b => (
          <div key={b._id} className="bg-pastel-lavender/40 rounded-xl p-4">
            <a href={b.url} target="_blank" rel="noreferrer" className="font-bold text-lg hover:underline">{b.title}</a>
            <p className="text-sm opacity-60 truncate">{b.url}</p>
            <div className="flex gap-2 mt-2">{b.tags.map(t => <span key={t} className="text-xs bg-pastel-peach px-2 py-0.5 rounded-full">{t}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
