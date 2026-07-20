import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState('Yes,No,Maybe');

  const fetch = () => axios.get('/api/polls').then(r => setPolls(r.data));
  useEffect(() => { fetch(); }, []);

  const create = async () => {
    await axios.post('/api/polls', { question, options: options.split(',').map(o => o.trim()) });
    setQuestion(''); fetch();
  };

  const vote = async (pollId, idx) => {
    await axios.post(`/api/polls/${pollId}/vote/${idx}`); fetch();
  };

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Quick Poll</h1>
      <div className="bg-pastel-sky/50 rounded-2xl p-4 mb-8 space-y-2">
        <input className="w-full p-3 rounded-xl bg-white/80" placeholder="Question?" value={question} onChange={e => setQuestion(e.target.value)} />
        <input className="w-full p-3 rounded-xl bg-white/80" placeholder="Options (comma separated)" value={options} onChange={e => setOptions(e.target.value)} />
        <button onClick={create} className="w-full py-3 bg-pastel-lilac rounded-xl font-bold">Create Poll</button>
      </div>
      {polls.map(p => {
        const total = p.options.reduce((s, o) => s + o.votes, 0) || 1;
        return (
          <div key={p._id} className="bg-pastel-lavender/30 rounded-2xl p-4 mb-4">
            <h3 className="font-bold mb-3">{p.question}</h3>
            {p.options.map((o, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <button onClick={() => vote(p._id, i)} className="hover:underline">{o.text}</button>
                  <span>{o.votes} ({Math.round(o.votes / total * 100)}%)</span>
                </div>
                <div className="h-4 bg-white/60 rounded-full overflow-hidden">
                  <div className="h-full bg-pastel-mint rounded-full transition-all" style={{ width: `${o.votes / total * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
