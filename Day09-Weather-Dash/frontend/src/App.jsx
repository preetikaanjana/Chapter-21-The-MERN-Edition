import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [cities, setCities] = useState([]);
  const [weather, setWeather] = useState({});
  const [newCity, setNewCity] = useState('');

  useEffect(() => { axios.get('/api/cities').then(r => setCities(r.data)); }, []);

  const addCity = async () => {
    await axios.post('/api/cities', { name: newCity });
    setNewCity('');
    const { data } = await axios.get('/api/cities');
    setCities(data);
  };

  const loadWeather = async (name) => {
    const { data } = await axios.get(`/api/weather/${name}`);
    setWeather(w => ({ ...w, [name]: data }));
  };

  useEffect(() => { cities.forEach(c => loadWeather(c.name)); }, [cities]);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">🌤️ Weather Dashboard</h1>
      <div className="flex gap-2 mb-8">
        <input className="flex-1 p-3 rounded-xl bg-white/80" placeholder="Add city..." value={newCity} onChange={e => setNewCity(e.target.value)} />
        <button onClick={addCity} className="px-6 bg-pastel-lilac rounded-xl font-bold">Add</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {cities.map(c => {
          const w = weather[c.name];
          return (
            <div key={c._id} className="bg-pastel-sky/50 rounded-2xl p-6 text-center">
              <h2 className="text-xl font-bold">{c.name}</h2>
              {w ? (<>
                <p className="text-5xl font-bold my-2">{Math.round(w.temp)}°C</p>
                <p className="capitalize opacity-70">{w.description}</p>
                <p className="text-sm opacity-50">Humidity: {w.humidity}%</p>
                {w.mock && <p className="text-xs text-pastel-lilac mt-2">Demo data — add OPENWEATHER_API_KEY</p>}
              </>) : <p className="opacity-50">Loading...</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
