'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ciao! Sono il tuo Fashion Stylist personale. Dimmi che vestiti indossi o mandami una foto del tuo outfit: ti dirò se spacchi o se è un disastro! Regola la Temperature in alto per decidere quanto sarò clemente... 😈' }
  ]);
  const [input, setInput] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getTempDescription = (temp: number) => {
    if (temp <= 0.4) return '🔥 Modalità: Critico Severo & Harsh';
    if (temp <= 0.9) return '✨ Modalità: Stylist Amichevole & Cool';
    return '🦄 Modalità: Folle Avant-Garde';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    let userContent: any = input;
    if (image) {
      userContent = [
        { type: 'text', text: input || 'Analizza questo outfit e dammi il tuo verdetto!' },
        { type: 'image_url', image_url: { url: image } }
      ];
    }

    const newMessages = [...messages, { role: 'user', content: userContent }];
    setMessages(newMessages);
    setInput('');
    setImage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, temperature }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: 'Errore dell AI: ' + data.error }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Errore di connessione al server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 text-gray-800">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-6 flex flex-col h-[90vh] border border-white/50">

        <div className="border-b pb-4 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ✨ VibeCheck Fashion AI
            </h1>
            <p className="text-xs font-medium text-purple-600">{getTempDescription(temperature)}</p>
          </div>

          <div className="flex flex-col items-end bg-purple-50 p-2.5 rounded-xl border border-purple-100">
            <label className="text-xs font-bold text-purple-900 mb-1">
              Temperature: <span className="text-pink-600 font-extrabold">{temperature}</span>
            </label>
            <input 
              type="range" 
              min="0.1" 
              max="1.5" 
              step="0.1" 
              value={temperature} 
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-32 accent-pink-600 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none font-medium' 
                  : 'bg-white text-gray-800 rounded-bl-none border border-purple-100'
              }`}>
                {typeof msg.content === 'string' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                ) : (
                  <div>
                    <p className="mb-2 font-medium">{msg.content[0].text}</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={msg.content[1].image_url.url} alt="Outfit caricato" className="max-h-48 rounded-lg mt-2 object-cover border-2 border-pink-200 shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl text-sm text-purple-600 font-semibold italic animate-pulse border border-purple-100 shadow-sm">
                Stylist al lavoro sull'outfit... 🎨✨
              </div>
            </div>
          )}
        </div>

        {image && (
          <div className="relative mb-3 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Preview" className="h-20 w-20 object-cover rounded-xl border-2 border-pink-500 shadow-md" />
            <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center shadow hover:bg-red-600 transition">×</button>
          </div>
        )}

        <form onSubmit={sendMessage} className="flex gap-2 items-center border-t pt-4">
          <label className="cursor-pointer bg-pink-100 hover:bg-pink-200 p-2.5 rounded-xl text-pink-700 transition shadow-sm">
            📷
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi i tuoi vestiti o carica una foto..." 
            className="flex-1 border border-purple-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-purple-50/50"
          />
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50">
            Invia 🚀
          </button>
        </form>

      </div>
    </main>
  );
}
