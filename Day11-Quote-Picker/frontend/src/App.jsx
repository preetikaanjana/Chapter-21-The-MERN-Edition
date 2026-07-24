import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [quote, setQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const fetch = () => axios.get('/api/quote/daily').then(r => setQuote(r.data));
  const fetchFav = () => axios.get('/api/quote/favorites').then(r => setFavorites(r.data));
  useEffect(() => { fetch(); fetchFav(); }, []);

  const save = async () => { await axios.post('/api/quote/favorites', quote); fetchFav(); };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8">✨ Daily Quote Picker</h1>
      {quote && (
        <div className="max-w-2xl mx-auto bg-pastel-lavender/40 rounded-2xl overflow-hidden shadow-lg">
          {quote.image && <img src={quote.image} alt="" className="w-full h-48 object-cover opacity-80" />}
          <div className="p-8 text-center">
            <p className="text-xl italic mb-4">"{quote.text}"</p>
            <p className="font-bold opacity-70">— {quote.author}</p>
            <div className="flex gap-3 justify-center mt-6">
              <button onClick={fetch} className="px-6 py-2 bg-pastel-sky rounded-xl font-bold">New Quote</button>
              <button onClick={save} className="px-6 py-2 bg-pastel-mint rounded-xl font-bold">Save ♥</button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="font-bold mb-3">Favorites</h2>
        {favorites.map(f => (
          <div key={f._id} className="bg-pastel-peach/30 rounded-xl p-3 mb-2 text-sm italic">"{f.text}" — {f.author}</div>
        ))}
      </div>
    </div>
  );
}
