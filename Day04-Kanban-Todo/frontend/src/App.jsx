import { useState, useEffect } from 'react';
import axios from 'axios';

const COLS = [
  { key: 'todo', label: 'To Do', color: 'bg-pastel-pink/60' },
  { key: 'doing', label: 'Doing', color: 'bg-pastel-lemon/60' },
  { key: 'done', label: 'Done', color: 'bg-pastel-mint/60' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetch = () => axios.get('/api/tasks').then(r => setTasks(r.data));
  useEffect(() => { fetch(); }, []);

  const add = async (e) => { e.preventDefault(); await axios.post('/api/tasks', { title }); setTitle(''); fetch(); };
  const move = async (id, status) => { await axios.put(`/api/tasks/${id}`, { status }); fetch(); };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📋 Kanban To-Do</h1>
      <form onSubmit={add} className="max-w-md mx-auto flex gap-2 mb-8">
        <input className="flex-1 p-3 rounded-xl bg-white/80" placeholder="New task..." value={title} onChange={e => setTitle(e.target.value)} />
        <button className="px-6 bg-pastel-lilac rounded-xl font-bold">Add</button>
      </form>
      <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {COLS.map(col => (
          <div key={col.key} className={`${col.color} rounded-2xl p-4 min-h-[300px]`}>
            <h2 className="font-bold mb-4 text-center">{col.label}</h2>
            {tasks.filter(t => t.status === col.key).map(t => (
              <div key={t._id} className="bg-white/80 rounded-xl p-3 mb-2 shadow-sm">
                <p>{t.title}</p>
                <div className="flex gap-1 mt-2">
                  {COLS.filter(c => c.key !== t.status).map(c => (
                    <button key={c.key} onClick={() => move(t._id, c.key)} className="text-xs px-2 py-1 bg-pastel-lavender rounded-full">{c.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
