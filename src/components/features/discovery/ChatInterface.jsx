import { useState, useImperativeHandle, forwardRef } from 'react';
import { generateResponse } from '../../../lib/gemini.js';
import { Send } from 'lucide-react';

const ChatInterface = forwardRef(function ChatInterface({ userData }, ref) {
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem('socratic_messages');
            return saved ? JSON.parse(saved) : [{ text: 'Olá! Estou aqui para o ajudar a descobrir o seu potencial. Vamos começar por explorar um desafio que você superou recentemente. Qual foi?', sender: 'ai' }];
        } catch (e) { return [{ text: 'Olá! Estou aqui para o ajudar a descobrir o seu potencial. Vamos começar por explorar um desafio que você superou recentemente. Qual foi?', sender: 'ai' }]; }
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (input.trim() === '' || loading) return;

        const userMsg = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const context = userData ? `Perfil do usuário: ${JSON.stringify(userData)}\n` : '';
            const res = await generateResponse(context + input);
            const aiText = typeof res === 'string' ? res : (res?.text || '');
            const aiMode = typeof res === 'string' ? 'unknown' : (res?.mode || 'unknown');
            setMessages(prev => [...prev, { text: aiText, sender: 'ai', meta: { mode: aiMode } }]);
            try { const next = [...messages, { text: input, sender: 'user' }, { text: aiText, sender: 'ai', meta: { mode: aiMode } }]; localStorage.setItem('socratic_messages', JSON.stringify(next)); } catch (e) {}
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: 'Erro ao comunicar com a IA.', sender: 'ai', isError: true }]);
        } finally {
            setLoading(false);
        }
    };

    useImperativeHandle(ref, () => ({
        loadConversation: (msgs) => {
            if (!Array.isArray(msgs)) return;
            setMessages(msgs);
            try { localStorage.setItem('socratic_messages', JSON.stringify(msgs)); } catch (e) {}
        },
        saveConversation: (title) => {
            try {
                const raw = localStorage.getItem('socratic_conversations');
                const convos = raw ? JSON.parse(raw) : [];
                const preview = messages.slice(-3).map(m => m.text).join(' | ');
                const record = { id: Date.now().toString(), title: title || `Conversa ${new Date().toLocaleString()}`, preview, messages };
                convos.unshift(record);
                localStorage.setItem('socratic_conversations', JSON.stringify(convos));
                return record;
            } catch (e) { console.error('Erro ao salvar conversa:', e); return null; }
        },
        clearConversation: () => {
            setMessages([{ text: 'Olá! Estou aqui para o ajudar a descobrir o seu potencial. Vamos começar por explorar um desafio que você superou recentemente. Qual foi?', sender: 'ai' }]);
            try { localStorage.removeItem('socratic_messages'); } catch (e) {}
        }
    }));

    return (
        <div className="w-full bg-gray-950 border border-gray-700 rounded-lg p-6">
            <div className="h-96 overflow-y-auto mb-4 space-y-4 pr-2 bg-gray-900 rounded p-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-xs md:max-w-md p-4 rounded-xl break-words text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-100'} ${msg.isError ? 'bg-red-900 text-red-100' : ''}`}>
                            <div className="flex items-center justify-between gap-3">
                                <div className="break-words leading-relaxed">{msg.text}</div>
                                {msg.meta?.mode && msg.sender === 'ai' && (
                                    <div className="ml-2 text-xs px-2 py-1 rounded-full bg-black/40 text-gray-300 whitespace-nowrap">{msg.meta.mode}</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 text-gray-300 p-4 rounded-xl inline-flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Digite a sua resposta..."
                        className="flex-1 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={loading}
                        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50"
                        title="Enviar mensagem"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            try { const raw = localStorage.getItem('socratic_conversations'); const convos = raw ? JSON.parse(raw) : []; const preview = messages.slice(-3).map(m => m.text).join(' | '); const record = { id: Date.now().toString(), title: `Conversa ${new Date().toLocaleString()}`, preview, messages }; convos.unshift(record); localStorage.setItem('socratic_conversations', JSON.stringify(convos)); alert('Conversa salva!'); } catch (e) { console.error(e); alert('Erro ao salvar conversa'); }
                        }}
                        className="flex-1 p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm font-semibold"
                    >Salvar Conversa
                    </button>
                    <button
                        onClick={() => { setMessages([{ text: 'Olá! Estou aqui para o ajudar a descobrir o seu potencial. Vamos começar por explorar um desafio que você superou recentemente. Qual foi?', sender: 'ai' }]); try { localStorage.removeItem('socratic_messages'); } catch (e) {} }}
                        className="flex-1 p-2 bg-red-700 text-white rounded-lg hover:bg-red-600 text-sm font-semibold"
                    >Limpar
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ChatInterface;