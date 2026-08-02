import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PALETTE = [
  { name: 'Sky', hex: '#D4E8F7', bgClass: 'bg-[#D4E8F7]' },
  { name: 'Pink', hex: '#FFD6E0', bgClass: 'bg-[#FFD6E0]' },
  { name: 'Lavender', hex: '#E8D5F2', bgClass: 'bg-[#E8D5F2]' },
  { name: 'Mint', hex: '#D4F1E8', bgClass: 'bg-[#D4F1E8]' },
  { name: 'Peach', hex: '#FFE5D4', bgClass: 'bg-[#FFE5D4]' },
  { name: 'Lemon', hex: '#FFF4D4', bgClass: 'bg-[#FFF4D4]' },
  { name: 'Rose', hex: '#F8BBD9', bgClass: 'bg-[#F8BBD9]' },
  { name: 'Lilac', hex: '#C5B4E3', bgClass: 'bg-[#C5B4E3]' },
  { name: 'Slate', hex: '#5C5470', bgClass: 'bg-[#5C5470]' },
  { name: 'White', hex: '#FFFFFF', bgClass: 'bg-[#FFFFFF] border-2 border-slate-200' },
];

export default function App() {
  const [grid, setGrid] = useState(() => Array(16).fill(null).map(() => Array(16).fill('#FFFFFF')));
  const [activeColor, setActiveColor] = useState('#5C5470');
  const [tool, setTool] = useState('brush'); // 'brush', 'bucket', 'eraser'
  const [showGridLines, setShowGridLines] = useState(true);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [artworks, setArtworks] = useState([]);
  const [loadingArt, setLoadingArt] = useState(true);

  const isMouseDownRef = useRef(false);

  const fetchArtworks = async () => {
    setLoadingArt(true);
    try {
      const res = await axios.get('/api/artworks');
      setArtworks(res.data);
    } catch (err) {
      console.error('Error fetching artworks:', err);
    } finally {
      setLoadingArt(false);
    }
  };

  useEffect(() => {
    fetchArtworks();

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleCellPaint = (row, col) => {
    const colorToApply = tool === 'eraser' ? '#FFFFFF' : activeColor;
    if (tool === 'bucket') {
      const targetColor = grid[row][col];
      floodFill(row, col, targetColor, colorToApply);
    } else {
      const newGrid = grid.map((r, ri) =>
        r.map((c, ci) => (ri === row && ci === col ? colorToApply : c))
      );
      setGrid(newGrid);
    }
  };

  const handleCellMouseDown = (row, col) => {
    isMouseDownRef.current = true;
    handleCellPaint(row, col);
  };

  const handleCellMouseEnter = (row, col) => {
    if (isMouseDownRef.current && tool !== 'bucket') {
      handleCellPaint(row, col);
    }
  };

  const floodFill = (startRow, startCol, targetColor, replacementColor) => {
    if (targetColor === replacementColor) return;
    const newGrid = grid.map(row => [...row]);
    const queue = [[startRow, startCol]];

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      if (r < 0 || r >= 16 || c < 0 || c >= 16) continue;
      if (newGrid[r][c] !== targetColor) continue;

      newGrid[r][c] = replacementColor;
      queue.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
    }
    setGrid(newGrid);
  };

  const clearCanvas = () => {
    if (window.confirm('Clear your canvas?')) {
      setGrid(Array(16).fill(null).map(() => Array(16).fill('#FFFFFF')));
    }
  };

  const publishArtwork = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for your artwork!');
      return;
    }
    try {
      await axios.post('/api/artworks', {
        title: title.trim(),
        author: author.trim() || 'Anonymous',
        grid
      });
      alert('Artwork published successfully! 🎨');
      setTitle('');
      setAuthor('');
      fetchArtworks();
    } catch (err) {
      alert('Error publishing artwork: ' + (err.response?.data?.message || err.message));
    }
  };

  const likeArtwork = async (id) => {
    try {
      const res = await axios.post(`/api/artworks/${id}/like`);
      setArtworks(artworks.map(art => (art._id === id ? res.data : art)));
    } catch (err) {
      console.error('Error liking artwork:', err);
    }
  };

  const remixArtwork = (artworkGrid) => {
    if (window.confirm('Load this artwork into the editor? Current progress will be lost.')) {
      setGrid(artworkGrid.map(row => [...row]));
    }
  };

  const deleteArtwork = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await axios.delete(`/api/artworks/${id}`);
      fetchArtworks();
    } catch (err) {
      console.error('Error deleting artwork:', err);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-cream text-pastel-text font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-pastel-lavender/40">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2">
              🎨 Pastel Draw & Gallery
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Draw retro pixel art on a grid and publish it to the community showcase
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2 justify-center">
            <span className="px-4 py-2 bg-pastel-sky/40 border border-slate-700/10 rounded-2xl text-xs font-bold shadow-sm">
              MERN Stack Day 20
            </span>
          </div>
        </header>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Canvas & Controls (LHS) */}
          <div className="lg:col-span-6 bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-pastel-lavender/30 shadow-md space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🖌️ Drawing Board
            </h2>

            {/* Pixel Grid */}
            <div className="flex justify-center">
              <div 
                className={`grid grid-cols-16 gap-0 bg-slate-200 border-4 border-pastel-text/30 rounded-2xl overflow-hidden shadow-lg select-none`}
                style={{
                  gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
                  width: 'min(100%, 380px)',
                  height: 'min(100vw - 3rem, 380px)',
                }}
              >
                {grid.map((row, rIdx) =>
                  row.map((cellColor, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onMouseDown={() => handleCellMouseDown(rIdx, cIdx)}
                      onMouseEnter={() => handleCellMouseEnter(rIdx, cIdx)}
                      className={`w-full h-full cursor-crosshair transition-colors duration-75 ${
                        showGridLines ? 'border-[0.5px] border-slate-200/50' : ''
                      }`}
                      style={{ backgroundColor: cellColor }}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Palette & Tools */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-2">Palette</label>
                <div className="flex flex-wrap gap-2">
                  {PALETTE.map((color) => {
                    const isSelected = activeColor === color.hex && tool !== 'eraser';
                    return (
                      <button
                        key={color.name}
                        onClick={() => {
                          setActiveColor(color.hex);
                          if (tool === 'eraser') setTool('brush');
                        }}
                        className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                          color.bgClass
                        } ${
                          isSelected ? 'ring-4 ring-pastel-text ring-offset-2 scale-105 shadow-md' : 'shadow-sm'
                        }`}
                        title={color.name}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Tools selection */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTool('brush')}
                  className={`flex-1 py-3 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    tool === 'brush'
                      ? 'bg-pastel-sky text-pastel-text border-slate-700/20 shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 border-pastel-lavender/30 shadow-sm'
                  }`}
                >
                  🖌️ Brush
                </button>
                <button
                  onClick={() => setTool('bucket')}
                  className={`flex-1 py-3 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    tool === 'bucket'
                      ? 'bg-pastel-sky text-pastel-text border-slate-700/20 shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 border-pastel-lavender/30 shadow-sm'
                  }`}
                  title="Flood fill area"
                >
                  🪣 Fill
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`flex-1 py-3 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    tool === 'eraser'
                      ? 'bg-pastel-sky text-pastel-text border-slate-700/20 shadow-md scale-[1.02]'
                      : 'bg-white hover:bg-slate-50 border-pastel-lavender/30 shadow-sm'
                  }`}
                >
                  🧽 Eraser
                </button>
              </div>

              {/* Grid Toggle and Clear */}
              <div className="flex gap-2 justify-between">
                <button
                  onClick={() => setShowGridLines(!showGridLines)}
                  className="px-4 py-2 bg-pastel-lavender/40 border border-slate-700/10 text-xs font-bold rounded-xl hover:bg-pastel-lavender transition-all"
                >
                  {showGridLines ? 'Hide Grid lines' : 'Show Grid lines'}
                </button>
                <button
                  onClick={clearCanvas}
                  className="px-4 py-2 bg-pastel-pink/50 hover:bg-pastel-pink border border-slate-700/10 text-xs font-bold rounded-xl transition-all"
                >
                  🧹 Clear Board
                </button>
              </div>
            </div>

            {/* Save Form */}
            <form onSubmit={publishArtwork} className="pt-4 border-t border-pastel-lavender/40 space-y-4">
              <h3 className="text-sm font-bold uppercase">Publish to Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 rounded-2xl bg-white border border-pastel-lavender/50 focus:outline-none focus:ring-2 focus:ring-pastel-sky text-sm font-medium"
                    placeholder="e.g. Sunny Day"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Artist Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-2xl bg-white border border-pastel-lavender/50 focus:outline-none focus:ring-2 focus:ring-pastel-sky text-sm font-medium"
                    placeholder="Anonymous"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-pastel-mint border border-slate-700/10 text-slate-800 font-extrabold rounded-2xl shadow-sm text-sm transition-all hover:bg-pastel-mint/85 active:scale-95"
              >
                🚀 Publish Drawing
              </button>
            </form>
          </div>

          {/* Gallery Showcase (RHS) */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              🏛️ Community Showcase
            </h2>

            {loadingArt ? (
              <div className="text-center py-16 opacity-60 font-semibold animate-pulse">
                Loading community art...
              </div>
            ) : artworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[750px] overflow-y-auto pr-2">
                {artworks.map((art) => (
                  <div
                    key={art._id}
                    className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 border border-pastel-lavender/30 flex flex-col justify-between shadow-sm hover:scale-[1.02] transition-transform duration-200"
                  >
                    <div>
                      {/* Mini Render */}
                      <div className="aspect-square w-full bg-slate-100 border border-slate-200/50 rounded-2xl overflow-hidden grid grid-cols-16 mb-3 shadow-inner">
                        {art.grid.map((row, r) =>
                          row.map((color, c) => (
                            <div
                              key={`${r}-${c}`}
                              className="w-full h-full"
                              style={{ backgroundColor: color }}
                            />
                          ))
                        )}
                      </div>
                      <h3 className="font-extrabold text-base text-slate-800 leading-snug truncate">
                        {art.title}
                      </h3>
                      <p className="text-xs font-medium opacity-65 truncate mb-4">
                        by {art.author}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => likeArtwork(art._id)}
                        className="px-3 py-2 bg-pastel-pink/30 hover:bg-pastel-pink/70 text-slate-700 text-xs font-bold rounded-xl border border-slate-700/10 flex items-center gap-1 transition-all"
                      >
                        💖 {art.likes}
                      </button>
                      <button
                        onClick={() => remixArtwork(art.grid)}
                        className="flex-1 py-2 bg-pastel-sky/30 hover:bg-pastel-sky/70 text-slate-700 text-xs font-bold rounded-xl border border-slate-700/10 transition-all"
                      >
                        🎨 Remix
                      </button>
                      <button
                        onClick={() => deleteArtwork(art._id)}
                        className="p-2 bg-pastel-lavender/20 hover:bg-pastel-pink/50 text-slate-500 hover:text-red-700 text-xs font-bold rounded-xl border border-slate-700/10 transition-all"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/40 border-2 border-dashed border-pastel-lavender rounded-3xl p-12 text-center">
                <p className="text-sm opacity-60 font-semibold mb-2">
                  No artworks published yet.
                </p>
                <p className="text-xs opacity-50">
                  Be the first to color the grid and publish a masterpiece!
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
