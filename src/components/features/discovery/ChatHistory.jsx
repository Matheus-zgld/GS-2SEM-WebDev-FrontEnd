import { useEffect, useState } from 'react';

export default function ChatHistory({ onLoadConversation }) {
    const [convos, setConvos] = useState([]);
    const [q, setQ] = useState('');

    useEffect(() => {
        try {
            const raw = localStorage.getItem('socratic_conversations');
            setConvos(raw ? JSON.parse(raw) : []);
        } catch (e) { setConvos([]); }
    }, []);

    const reload = () => {
        try { const raw = localStorage.getItem('socratic_conversations'); setConvos(raw ? JSON.parse(raw) : []); } catch (e) { setConvos([]); }
    };

    const handleLoad = (c) => {
        if (onLoadConversation) onLoadConversation(c.messages);
    };

    const handleDelete = (id) => {
        const next = convos.filter(c => c.id !== id);
        localStorage.setItem('socratic_conversations', JSON.stringify(next));
        setConvos(next);
    };

    const filtered = convos.filter(c => c.title?.toLowerCase().includes(q.toLowerCase()) || c.preview?.toLowerCase().includes(q.toLowerCase()));

    return (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <h4 className="text-lg font-bold text-white mb-2">Histórico da IA</h4>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar histórico" className="w-full p-2 mb-3 bg-gray-900 border border-gray-700 rounded text-gray-200" />
            <div className="max-h-56 overflow-y-auto space-y-2">
                {filtered.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma conversa salva.</p>
                ) : (
                    filtered.map(c => (
                        <div key={c.id} className="flex items-start justify-between bg-gray-900 border border-gray-800 p-2 rounded">
                            <div>
                                <button onClick={() => handleLoad(c)} className="text-left">
                                    <div className="font-semibold text-white">{c.title || 'Sem título'}</div>
                                    <div className="text-xs text-gray-400">{c.preview}</div>
                                </button>
                            </div>
                            <div className="flex flex-col gap-1 ml-2">
                                <button onClick={() => handleLoad(c)} className="text-indigo-400 text-sm">Abrir</button>
                                <button onClick={() => handleDelete(c.id)} className="text-red-400 text-sm">Apagar</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-3 text-sm text-gray-400">As conversas são salvas localmente no navegador.</div>
        </div>
    );
}
