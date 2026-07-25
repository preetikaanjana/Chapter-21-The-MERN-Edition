import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [username, setUsername] = useState('octocat');
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const { data: d } = await axios.get(`/api/github/${username}`);
      setData(d);
      setNote(d.note);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Failed to reach backend server. Please verify the backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      await axios.post(`/api/github/${username}/note`, { note });
      alert('Note saved successfully! ✨');
    } catch (err) {
      alert('Failed to save note. Make sure backend is running.');
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🐙 GitHub Inspector</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 p-3 rounded-xl bg-white/80 shadow-sm border border-pastel-lilac/20"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter github username"
        />
        <button
          onClick={search}
          disabled={loading}
          className="px-6 bg-pastel-lilac rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {loading ? 'Inspecting...' : 'Inspect'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-2xl p-4 text-center text-sm font-semibold border border-red-100 mb-6">
          ⚠️ {error}
        </div>
      )}

      {data && (
        <div className="bg-pastel-sky/40 rounded-2xl p-6 text-center shadow-sm">
          <img src={data.profile.avatar_url} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-white shadow-sm" />
          <h2 className="text-xl font-bold">{data.profile.name || data.profile.login}</h2>
          <p className="opacity-70 mb-2">@{data.profile.login}</p>
          <p className="text-sm mb-4">{data.profile.bio || 'No bio available.'}</p>
          <div className="flex justify-center gap-6 text-sm mb-4">
            <span><strong>{data.profile.public_repos}</strong> repos</span>
            <span><strong>{data.profile.followers}</strong> followers</span>
          </div>
          <textarea
            className="w-full p-3 rounded-xl bg-white/80 text-sm border border-pastel-sky/20"
            rows="3"
            placeholder="Write personal notes about this developer..."
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <button
            onClick={saveNote}
            className="mt-3 px-6 py-2.5 bg-pastel-mint rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Save Note
          </button>
        </div>
      )}
    </div>
  );
}
