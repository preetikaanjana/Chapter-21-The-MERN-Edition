import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [title, setTitle] = useState('Untitled');
  const [content, setContent] = useState('# Hello Pastel World\n\nWrite **markdown** here!');
  const [html, setHtml] = useState('');
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    axios.post('/api/preview', { content }).then(r => setHtml(r.data.html));
  }, [content]);

  useEffect(() => { axios.get('/api/docs').then(r => setDocs(r.data)); }, []);

  const save = async () => {
    await axios.post('/api/docs', { title, content });
    axios.get('/api/docs').then(r => setDocs(r.data));
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📄 Markdown Previewer</h1>
      <input className="block max-w-4xl mx-auto w-full p-2 mb-2 rounded-xl bg-pastel-lavender/30 font-bold" value={title} onChange={e => setTitle(e.target.value)} />
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
        <textarea className="h-96 p-4 rounded-2xl bg-pastel-sky/30 font-mono text-sm resize-none" value={content} onChange={e => setContent(e.target.value)} />
        <div className="h-96 p-4 rounded-2xl bg-pastel-mint/30 overflow-auto prose prose-sm" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="max-w-4xl mx-auto mt-4 flex gap-2">
        <button onClick={save} className="px-6 py-2 bg-pastel-lilac rounded-xl font-bold">Save</button>
      </div>
      <div className="max-w-4xl mx-auto mt-6">
        {docs.map(d => <div key={d._id} className="bg-white/50 rounded-xl p-2 mb-1 text-sm cursor-pointer" onClick={() => { setTitle(d.title); setContent(d.content); }}>{d.title}</div>)}
      </div>
    </div>
  );
}
