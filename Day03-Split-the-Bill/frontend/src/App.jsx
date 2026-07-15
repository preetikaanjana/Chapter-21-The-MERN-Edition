import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState(2);
  const [tip, setTip] = useState(15);
  const [names, setNames] = useState('');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [history, setHistory] = useState([]);
  const perPerson = total ? ((+total * (1 + tip / 100)) / people).toFixed(2) : '0.00';

  useEffect(() => { axios.get('/api/splits').then(r => setHistory(r.data)); }, []);

  const save = async () => {
    if (!total || !purpose) return;
    const res = await axios.post('/api/splits', {
      total: +total,
      people,
      tip,
      names: names.split(',').map(n => n.trim()).filter(Boolean),
      purpose,
      date
    });
    setHistory([res.data, ...history]);
    setTotal('');
    setNames('');
    setPurpose('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">💸 Split the Bill</h1>
      <div className="bg-pastel-peach/50 rounded-2xl p-6 mb-6 space-y-4">
        <div>
          <label className="font-semibold">Spent For (Purpose)</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl bg-white/80 mt-1"
            placeholder="e.g. Dinner, Cab, Groceries"
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold">Total Bill (₹)</label>
            <input
              type="number"
              className="w-full p-3 rounded-xl bg-white/80 mt-1"
              placeholder="0.00"
              value={total}
              onChange={e => setTotal(e.target.value)}
            />
          </div>
          <div>
            <label className="font-semibold">Date</label>
            <input
              type="date"
              className="w-full p-3 rounded-xl bg-white/80 mt-1"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="font-semibold">People: {people}</label>
          <input
            type="range"
            min="1"
            max="20"
            value={people}
            className="w-full"
            onChange={e => setPeople(+e.target.value)}
          />
        </div>
        <div>
          <label className="font-semibold">Tip: {tip}%</label>
          <input
            type="range"
            min="0"
            max="30"
            value={tip}
            className="w-full"
            onChange={e => setTip(+e.target.value)}
          />
        </div>
        
        <div>
          <label className="font-semibold">Names (comma separated)</label>
          <input
            className="w-full p-3 rounded-xl bg-white/80 mt-1"
            placeholder="e.g. Amit, Rahul, Priya"
            value={names}
            onChange={e => setNames(e.target.value)}
          />
        </div>
        
        <div className="text-center py-4 bg-pastel-mint rounded-xl">
          <p className="text-sm opacity-70">Each person pays</p>
          <p className="text-4xl font-bold">₹{perPerson}</p>
        </div>
        <button
          onClick={save}
          disabled={!total || !purpose}
          className="w-full py-3 bg-pastel-lilac rounded-xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
        >
          Save to History
        </button>
      </div>
      
      <h2 className="font-bold mb-3">History</h2>
      <div className="space-y-3">
        {history.length === 0 && (
          <p className="text-center opacity-50 py-4">No history yet.</p>
        )}
        {history.map(h => (
          <div key={h._id} className="bg-pastel-lavender/30 rounded-xl p-4 text-sm flex justify-between items-start shadow-sm border border-pastel-lavender/20">
            <div>
              <p className="font-bold text-base text-pastel-text capitalize">{h.purpose || 'Spends'}</p>
              <p className="text-xs opacity-60 mb-2">
                {h.date ? new Date(h.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'No date'}
              </p>
              {h.names && h.names.length > 0 && (
                <p className="text-xs opacity-75 mb-1">
                  👥 Split: {h.names.join(', ')}
                </p>
              )}
              <p className="text-xs opacity-60">
                ₹{h.total} ÷ {h.people} people {h.tip > 0 ? `+ ${h.tip}% tip` : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider opacity-60">Per Person</p>
              <p className="text-xl font-extrabold text-pastel-text">₹{h.perPerson}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
