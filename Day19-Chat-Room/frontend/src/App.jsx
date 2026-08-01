import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

export default function App() {
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [room] = useState('general');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!joined) return;
    socket.emit('join', room);
    axios.get(`/api/messages/${room}`).then(r => setMessages(r.data));
    socket.on('message', (msg) => setMessages(prev => [...prev, msg]));
    return () => socket.off('message');
  }, [joined, room]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const join = () => { if (username.trim()) setJoined(true); };
  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('message', { username, text, room });
    setText('');
  };

  if (!joined) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-pastel-pink/40 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">💬 Chat Room</h1>
        <input className="w-full p-3 rounded-xl bg-white/80 mb-3" placeholder="Your name" value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={join} className="w-full py-3 bg-pastel-lilac rounded-xl font-bold">Join Chat</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto">
      <div className="bg-pastel-lavender/50 p-4 text-center font-bold">#{room}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div key={m._id || i} className={`max-w-[80%] ${m.username === username ? 'ml-auto' : ''}`}>
            <div className={`rounded-2xl px-4 py-2 ${m.username === username ? 'bg-pastel-mint' : 'bg-pastel-sky/60'}`}>
              <p className="text-xs font-bold opacity-60">{m.username}</p>
              <p>{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="p-4 flex gap-2">
        <input className="flex-1 p-3 rounded-xl bg-white/80" value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." />
        <button className="px-6 bg-pastel-lilac rounded-xl font-bold">Send</button>
      </form>
    </div>
  );
}
