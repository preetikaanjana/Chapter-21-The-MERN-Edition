import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [habits, setHabits] = useState([]);
  const [days, setDays] = useState([]);
  const [name, setName] = useState('');

  const fetch = () => axios.get('/api/habits').then(r => { setHabits(r.data.habits); setDays(r.data.days); });
  useEffect(() => { fetch(); }, []);

  const add = async () => { if (!name.trim()) return; await axios.post('/api/habits', { name }); setName(''); fetch(); };
  const toggle = async (id, date) => { await axios.post(`/api/habits/${id}/toggle`, { date }); fetch(); };

  const dayLabel = (d) => new Date(d + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">✅ Habit Tracker Grid</h1>
      <div className="flex gap-2 mb-6">
        <input className="flex-1 p-3 rounded-xl bg-white/80" placeholder="New habit..." value={name} onChange={e => setName(e.target.value)} />
        <button onClick={add} className="px-6 bg-pastel-lilac rounded-xl font-bold">Add</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr><th className="text-left p-2">Habit</th>{days.map(d => <th key={d} className="p-2 text-xs">{dayLabel(d)}</th>)}</tr></thead>
          <tbody>
            {habits.map(h => (
              <tr key={h._id} className="border-t border-pastel-lavender/20">
                <td className="p-2 font-semibold">{h.name}</td>
                {days.map(d => {
                  const done = h.completions.some(c => c.date === d);
                  return (
                    <td key={d} className="p-2 text-center">
                      <button onClick={() => toggle(h._id, d)} className={`w-8 h-8 rounded-lg ${done ? 'bg-pastel-mint' : 'bg-white/60'} hover:opacity-80`}>
                        {done ? '✓' : ''}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
