import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ byCategory: [], grandTotal: 0 });
  const [form, setForm] = useState({ title: '', amount: '', category: 'food' });

  const fetch = () => {
    axios.get('/api/expenses').then(r => setExpenses(r.data));
    axios.get('/api/expenses/summary').then(r => setSummary(r.data));
  };
  useEffect(() => { fetch(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post('/api/expenses', { ...form, amount: +form.amount });
    setForm({ title: '', amount: '', category: 'food' }); fetch();
  };

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">💰 Expense Logger</h1>
      <div className="bg-pastel-mint/50 rounded-2xl p-4 mb-6 text-center">
        <p className="text-sm opacity-70">Total Spent</p>
        <p className="text-3xl font-bold">${summary.grandTotal.toFixed(2)}</p>
      </div>
      <form onSubmit={submit} className="grid gap-2 mb-6 bg-pastel-peach/40 p-4 rounded-2xl">
        <input className="p-3 rounded-xl bg-white/80" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input type="number" className="p-3 rounded-xl bg-white/80" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
        <select className="p-3 rounded-xl" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          {['food', 'transport', 'shopping', 'bills', 'other'].map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="py-3 bg-pastel-lilac rounded-xl font-bold">Add Expense</button>
      </form>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {summary.byCategory.map(c => (
          <div key={c._id} className="bg-pastel-lavender/40 rounded-xl p-3 text-center">
            <p className="capitalize font-semibold">{c._id}</p>
            <p className="text-xl font-bold">${c.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
      {expenses.map(e => (
        <div key={e._id} className="flex justify-between bg-white/60 rounded-xl p-3 mb-2">
          <span>{e.title} <span className="text-xs opacity-50">({e.category})</span></span>
          <span className="font-bold">${e.amount}</span>
        </div>
      ))}
    </div>
  );
}
