import { useState, useEffect } from 'react';
import axios from 'axios';

const colorMap = {
  'pastel-pink': 'bg-pastel-pink', 'pastel-sky': 'bg-pastel-sky', 'pastel-peach': 'bg-pastel-peach',
  'pastel-mint': 'bg-pastel-mint', 'pastel-lemon': 'bg-pastel-lemon', 'pastel-lavender': 'bg-pastel-lavender',
  'pastel-rose': 'bg-pastel-rose', 'pastel-lilac': 'bg-pastel-lilac',
};

export default function App() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 21, complete: 0, progress: 0 });

  useEffect(() => {
    axios.get('/api/projects').then(r => setProjects(r.data));
    axios.get('/api/stats').then(r => setStats(r.data));
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">🎂 Portfolio Hub</h1>
        <p className="opacity-70">21 Days, 21 MERN Stack Projects</p>
        <div className="mt-4 bg-pastel-lavender/40 rounded-2xl p-4 inline-block">
          <p className="text-3xl font-bold">{stats.progress}%</p>
          <p className="text-sm opacity-60">{stats.complete}/{stats.total} Complete</p>
          <div className="w-48 h-3 bg-white/60 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-pastel-mint rounded-full transition-all" style={{ width: `${stats.progress}%` }} />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {projects.map(p => (
          <div key={p.day} className={`${colorMap[p.color] || 'bg-pastel-lavender'} rounded-2xl p-5 hover:scale-[1.02] transition`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold opacity-50">DAY {String(p.day).padStart(2, '0')}</span>
              <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">{p.status}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{p.name}</h3>
            <p className="text-sm opacity-70 mb-3">{p.description}</p>
            <div className="flex flex-wrap gap-1">
              {p.concepts?.map(c => <span key={c} className="text-xs bg-white/40 px-2 py-0.5 rounded-full">{c}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
