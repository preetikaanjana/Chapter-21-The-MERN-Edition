import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function App() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => { axios.get('/api/me').then(r => setUser(r.data)).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const url = mode === 'login' ? '/api/login' : '/api/register';
    const { data } = await axios.post(url, form);
    setUser(data);
  };

  const logout = async () => { await axios.post('/api/logout'); setUser(null); };

  if (user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-pastel-mint/50 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}! 🎉</h1>
        <p className="opacity-70 mb-4">{user.email}</p>
        <button onClick={logout} className="px-6 py-2 bg-pastel-lilac rounded-xl font-bold">Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="bg-pastel-pink/40 rounded-2xl p-8 w-full max-w-md space-y-3">
        <h1 className="text-2xl font-bold text-center mb-4">🔐 Auth Template</h1>
        {mode === 'register' && <input className="w-full p-3 rounded-xl bg-white/80" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />}
        <input type="email" className="w-full p-3 rounded-xl bg-white/80" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input type="password" className="w-full p-3 rounded-xl bg-white/80" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button className="w-full py-3 bg-pastel-lilac rounded-xl font-bold">{mode === 'login' ? 'Login' : 'Register'}</button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full text-sm opacity-70">
          {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
        </button>
      </form>
    </div>
  );
}
