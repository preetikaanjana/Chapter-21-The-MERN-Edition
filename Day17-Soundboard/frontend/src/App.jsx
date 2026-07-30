import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const FREQ_MAP = { Rain: 200, Fireplace: 150, Ocean: 180, Birds: 400, Wind: 120, Cafe: 250 };

export default function App() {
  const [sounds, setSounds] = useState([]);
  const [playing, setPlaying] = useState(null);
  const ctxRef = useRef(null);

  useEffect(() => { axios.get('/api/sounds').then(r => setSounds(r.data)); }, []);

  const play = async (sound) => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = ctxRef.current;
    if (playing === sound._id) { ctx.suspend(); setPlaying(null); return; }
    ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = FREQ_MAP[sound.name] || 220;
    gain.gain.value = 0.08;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start();
    setPlaying(sound._id);
    await axios.post(`/api/sounds/${sound._id}/play`);
    axios.get('/api/sounds').then(r => setSounds(r.data));
  };

  const colorMap = { 'pastel-sky': 'bg-pastel-sky', 'pastel-peach': 'bg-pastel-peach', 'pastel-mint': 'bg-pastel-mint', 'pastel-lemon': 'bg-pastel-lemon', 'pastel-lavender': 'bg-pastel-lavender', 'pastel-pink': 'bg-pastel-pink' };

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">🎵 Lo-Fi Soundboard</h1>
      <p className="text-center text-sm opacity-60 mb-8">Tap to play ambient tones</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sounds.map(s => (
          <button key={s._id} onClick={() => play(s)}
            className={`${colorMap[s.color] || 'bg-pastel-lavender'} rounded-2xl p-6 text-center transition hover:scale-105 ${playing === s._id ? 'ring-4 ring-pastel-lilac' : ''}`}>
            <span className="text-4xl block mb-2">{s.emoji}</span>
            <span className="font-bold">{s.name}</span>
            <p className="text-xs opacity-50 mt-1">{s.playCount} plays</p>
          </button>
        ))}
      </div>
    </div>
  );
}
