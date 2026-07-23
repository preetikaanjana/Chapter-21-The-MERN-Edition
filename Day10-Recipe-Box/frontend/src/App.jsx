import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [query, setQuery] = useState('pasta');
  const [recipes, setRecipes] = useState([]);
  const [saved, setSaved] = useState([]);

  const search = () => axios.get('/api/recipes/search', { params: { q: query } }).then(r => setRecipes(r.data.results || []));
  const fetchSaved = () => axios.get('/api/recipes/saved').then(r => setSaved(r.data));
  useEffect(() => { search(); fetchSaved(); }, []);

  const save = async (r) => {
    await axios.post('/api/recipes/saved', { recipeId: r.id, title: r.title, image: r.image, readyInMinutes: r.readyInMinutes });
    fetchSaved();
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🍳 Recipe Box</h1>
      <div className="flex gap-2 mb-6">
        <input className="flex-1 p-3 rounded-xl bg-white/80" value={query} onChange={e => setQuery(e.target.value)} />
        <button onClick={search} className="px-6 bg-pastel-lilac rounded-xl font-bold">Search</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {recipes.map(r => (
          <div key={r.id} className="bg-pastel-peach/40 rounded-2xl p-4">
            <h3 className="font-bold">{r.title}</h3>
            <p className="text-sm opacity-60">{r.readyInMinutes} min</p>
            <button onClick={() => save(r)} className="mt-2 text-sm px-3 py-1 bg-pastel-mint rounded-full">Save ♥</button>
          </div>
        ))}
      </div>
      <h2 className="font-bold mb-3">Saved Recipes</h2>
      {saved.map(s => <div key={s._id} className="bg-pastel-lavender/30 rounded-xl p-3 mb-2">{s.title}</div>)}
    </div>
  );
}
