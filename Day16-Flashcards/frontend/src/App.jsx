import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [cards, setCards] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: 'javascript' });

  const fetch = () => axios.get('/api/cards').then(r => setCards(r.data)).catch(err => console.error('Error fetching cards:', err));
  useEffect(() => { fetch(); }, []);

  const add = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      alert('Please enter both a question and an answer.');
      return;
    }
    try {
      await axios.post('/api/cards', form);
      setForm({ question: '', answer: '', category: 'javascript' });
      fetch();
    } catch (err) {
      alert('Error adding card: ' + (err.response?.data?.message || err.message));
    }
  };
  const review = async (correct) => {
    if (cards[idx]) await axios.post(`/api/cards/${cards[idx]._id}/review`, { correct });
    setFlipped(false); setIdx((idx + 1) % Math.max(cards.length, 1)); fetch();
  };

  const card = cards[idx];

  return (
    <div className="min-h-screen p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🃏 Interview Flashcards</h1>
      {card ? (
        <div className="perspective-1000 mb-6">
          <div onClick={() => setFlipped(!flipped)} className={`relative w-full h-64 cursor-pointer transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}
            style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
            <div className="absolute inset-0 bg-pastel-sky/60 rounded-2xl flex items-center justify-center p-6 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-lg font-semibold text-center">{card.question}</p>
            </div>
            <div className="absolute inset-0 bg-pastel-mint/60 rounded-2xl flex items-center justify-center p-6" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <p className="text-lg text-center">{card.answer}</p>
            </div>
          </div>
          <p className="text-center text-sm opacity-50 mt-2">Tap to flip • {idx + 1}/{cards.length}</p>
          {flipped && (
            <div className="flex gap-3 mt-4 justify-center">
              <button onClick={() => review(false)} className="px-6 py-2 bg-pastel-pink rounded-xl">Missed</button>
              <button onClick={() => review(true)} className="px-6 py-2 bg-pastel-mint rounded-xl">Got it!</button>
            </div>
          )}
        </div>
      ) : <p className="text-center opacity-50 mb-6">Add cards below to start</p>}
      <div className="bg-pastel-lavender/30 rounded-2xl p-4 space-y-2">
        <input className="w-full p-2 rounded-xl bg-white/80" placeholder="Question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} />
        <input className="w-full p-2 rounded-xl bg-white/80" placeholder="Answer" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} />
        <button onClick={add} className="w-full py-2 bg-pastel-lilac rounded-xl font-bold">Add Card</button>
      </div>
      {cards.map(c => (
        <div key={c._id} className="text-xs opacity-60 mt-2">{c.question.slice(0, 40)}... — {c.timesCorrect}/{c.timesReviewed} correct</div>
      ))}
    </div>
  );
}
