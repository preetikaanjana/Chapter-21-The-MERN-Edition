import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const fetch = () => axios.get('/api/watchlist').then(r => setWatchlist(r.data));
  const fetchPrices = () => axios.get('/api/crypto/prices').then(r => setPrices(r.data));

  useEffect(() => { fetch(); }, []);
  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 30000);
    return () => clearInterval(id);
  }, [watchlist]);

  const doSearch = async () => {
    const { data } = await axios.get('/api/crypto/search', { params: { q: search } });
    setResults(data);
  };

  const add = async (coin) => {
    await axios.post('/api/watchlist', { coinId: coin.id, symbol: coin.symbol, name: coin.name });
    fetch(); setResults([]);
  };

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">₿ Crypto Watchlist</h1>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 p-3 rounded-xl bg-white/80" placeholder="Search coin..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={doSearch} className="px-4 bg-pastel-lilac rounded-xl font-bold">Go</button>
      </div>
      {results.map(c => (
        <button key={c.id} onClick={() => add(c)} className="block w-full text-left bg-pastel-peach/30 rounded-xl p-2 mb-1 text-sm">+ {c.name}</button>
      ))}
      <div className="space-y-3 mt-6">
        {watchlist.map(w => {
          const p = prices[w.coinId];
          return (
            <div key={w._id} className="bg-pastel-mint/40 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{w.name}</p>
                <p className="text-xs uppercase opacity-60">{w.symbol}</p>
              </div>
              {p ? (
                <div className="text-right">
                  <p className="font-bold">${p.usd?.toLocaleString()}</p>
                  <p className={`text-sm ${p.usd_24h_change > 0 ? 'text-green-600' : 'text-red-400'}`}>
                    {p.usd_24h_change?.toFixed(2)}%
                  </p>
                </div>
              ) : <span className="opacity-50">...</span>}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-center mt-4 opacity-50">Auto-refreshes every 30s</p>
    </div>
  );
}
