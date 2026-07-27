import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [movie, setMovie] = useState(null);
  const [review, setReview] = useState({ author: '', rating: 5, comment: '' });

  const search = async () => {
    const { data } = await axios.get('/api/movies/search', { params: { q: query } });
    setResults(data.Search || []);
  };

  const select = async (imdbId) => {
    const { data } = await axios.get(`/api/movies/${imdbId}`);
    setMovie(data);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`/api/movies/${movie.imdbId}/reviews`, review);
    setMovie(data); setReview({ author: '', rating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🎬 Movie Reviews</h1>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 p-3 rounded-xl bg-white/80" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies..." />
        <button onClick={search} className="px-6 bg-pastel-lilac rounded-xl font-bold">Search</button>
      </div>
      {!movie && results.map(m => (
        <button key={m.imdbID} onClick={() => select(m.imdbID)} className="block w-full text-left bg-pastel-lavender/30 rounded-xl p-3 mb-2">
          {m.Title} ({m.Year})
        </button>
      ))}
      {movie && (
        <div>
          <button onClick={() => setMovie(null)} className="text-sm opacity-60 mb-4">← Back</button>
          <div className="bg-pastel-peach/40 rounded-2xl p-6 mb-4">
            <h2 className="text-xl font-bold">{movie.title}</h2>
            <p className="opacity-60">{movie.year}</p>
          </div>
          <form onSubmit={submitReview} className="bg-pastel-mint/30 rounded-2xl p-4 mb-4 space-y-2">
            <input className="w-full p-2 rounded-xl bg-white/80" placeholder="Your name" value={review.author} onChange={e => setReview({ ...review, author: e.target.value })} required />
            <input type="range" min="1" max="5" value={review.rating} onChange={e => setReview({ ...review, rating: +e.target.value })} className="w-full" />
            <p className="text-sm">Rating: {'★'.repeat(review.rating)}</p>
            <textarea className="w-full p-2 rounded-xl bg-white/80" placeholder="Review..." value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} required />
            <button className="w-full py-2 bg-pastel-lilac rounded-xl font-bold">Submit Review</button>
          </form>
          {movie.reviews?.map((r, i) => (
            <div key={i} className="bg-white/60 rounded-xl p-3 mb-2">
              <p className="font-bold">{r.author} {'★'.repeat(r.rating)}</p>
              <p className="text-sm">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
