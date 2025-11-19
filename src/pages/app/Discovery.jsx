import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import SidebarLayout from '../../components/layout/SideBarLayout';
import ChatInterface from '../../components/features/discovery/ChatInterface';
import ChatHistory from '../../components/features/discovery/ChatHistory';
import { useRef } from 'react';
import ArchetypeDisplay from '../../components/features/discovery/ArchetypeDisplay';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function normalizeUserData(data = {}) {
    return {
        habilidadesTecnicas: Array.isArray(data.habilidadesTecnicas) ? data.habilidadesTecnicas : (typeof data.habilidadesTecnicas === 'string' ? data.habilidadesTecnicas.split(',').map(s => s.trim()).filter(Boolean) : []),
        softSkills: Array.isArray(data.softSkills) ? data.softSkills : (typeof data.softSkills === 'string' ? data.softSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
        areaInteresses: Array.isArray(data.areaInteresses) ? data.areaInteresses : (typeof data.areaInteresses === 'string' ? data.areaInteresses.split(',').map(s => s.trim()).filter(Boolean) : []),
        experiencias: Array.isArray(data.experiencias) ? data.experiencias.map(e => e.descricao || e) : (data.experiencias || ''),
        resumo: data.resumo || ''
    };
}

function Discovery() {
    const { user, loading: authLoading } = useAuth();
    const [userData, setUserData] = useState(() => normalizeUserData({}));
    const [archetype, setArchetype] = useState({ name: 'Iniciante', description: 'Comece a explorar suas habilidades.', badges: ['Curioso'] });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        if (authLoading) return;

        const fetchUserData = async () => {
            if (!mounted) return;
            setLoading(true);
            try {
                if (user && user.uid) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        const normalized = normalizeUserData(data);
                        if (mounted) {
                            setUserData(normalized);
                            generateArchetype(normalized);
                        }
                    }
                }
            } catch (err) {
                console.error('Erro ao buscar dados do usuário:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchUserData();
        return () => { mounted = false; };
    }, [user, authLoading]); // Correct dependency

    const generateArchetype = (data) => {
        let name = 'Iniciante';
        let description = 'Comece a explorar suas habilidades e experiências.';
        let badges = ['Curioso'];

        const techs = data.habilidadesTecnicas || [];
        const interests = data.areaInteresses || [];

        if (techs.find(t => typeof t === 'string' && t.toLowerCase().includes('react'))) {
            name = 'Desenvolvedor Criativo';
            description = 'Especialista em front-end e inovação.';
            badges = ['Criativo', 'Técnico'];
        } else if (interests.find(i => typeof i === 'string' && i.toLowerCase().includes('educa'))) {
            name = 'Educador Inovador';
            description = 'Focado em aprendizado e impacto social.';
            badges = ['Educador', 'Inovador'];
        }
        setArchetype({ name, description, badges });
    };

    const saveUserData = async () => {
        if (!user) return alert('Faça login para salvar.');
        try {
            await setDoc(doc(db, 'users', user.uid), {
                ...userData,
                email: user.email,
                pontosGamificacao: (userData.habilidadesTecnicas.length + userData.softSkills.length) * 10
            }, { merge: true });
            alert('Dados salvos! Arquétipo atualizado.');
            generateArchetype(userData);
        } catch (err) {
            console.error('Erro ao salvar dados do usuário:', err);
            alert('Erro ao salvar dados. Veja console.');
        }
    };

    if (authLoading || loading) {
        return (
            <SidebarLayout>
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-gray-400">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg">Carregando descoberta...</p>
                </div>
            </SidebarLayout>
        );
    }

    if (!user) {
        return (
            <SidebarLayout>
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-gray-300">
                    <p className="text-lg mb-4">Faça login para acessar a descoberta de potencial.</p>
                    <button onClick={() => navigate('/auth/login')} className="bg-blue-600 px-4 py-2 rounded">Entrar</button>
                </div>
            </SidebarLayout>
        );
    }

    const chatRef = useRef(null);

    const handleLoadConversation = (msgs) => {
        if (chatRef.current && chatRef.current.loadConversation) chatRef.current.loadConversation(msgs);
    };

    const handleSaveArchetype = async () => {
        if (!user) return alert('Faça login para salvar arquétipo.');
        try {
            await setDoc(doc(db, 'users', user.uid), { archetype }, { merge: true });
            alert('Arquétipo salvo no seu perfil.');
        } catch (err) { console.error('Erro ao salvar arquétipo:', err); alert('Erro ao salvar arquétipo.'); }
    };

    return (
        <SidebarLayout>
            <div className="p-6 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-2">🧠 Descoberta de Potencial</h2>
                        <p className="text-gray-400">Explore seu perfil com ajuda de IA Socrática</p>
                    </motion.div>

                    {/* Seção de Arquétipo em Destaque */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <ArchetypeDisplay archetype={archetype} />
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Chat e Edição */}
                        <motion.div 
                            className="lg:col-span-2 space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {/* Seção de Editar Perfil */}
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    ✏️ Editar Perfil
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Habilidades Técnicas</label>
                                        <input
                                            type="text"
                                            placeholder="React, Python, Firebase..."
                                            value={userData.habilidadesTecnicas.join(', ')}
                                            onChange={(e) => setUserData({ ...userData, habilidadesTecnicas: e.target.value.split(',').map(s => s.trim()) })}
                                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Soft Skills</label>
                                        <input
                                            type="text"
                                            placeholder="Liderança, Comunicação..."
                                            value={userData.softSkills.join(', ')}
                                            onChange={(e) => setUserData({ ...userData, softSkills: e.target.value.split(',').map(s => s.trim()) })}
                                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Áreas de Interesse</label>
                                        <input
                                            type="text"
                                            placeholder="Educação, Saúde, Tecnologia..."
                                            value={userData.areaInteresses.join(', ')}
                                            onChange={(e) => setUserData({ ...userData, areaInteresses: e.target.value.split(',').map(s => s.trim()) })}
                                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 mb-1 block">Experiências</label>
                                        <textarea
                                            placeholder="Descreva suas experiências..."
                                            value={Array.isArray(userData.experiencias) ? userData.experiencias.join('; ') : userData.experiencias}
                                            onChange={(e) => setUserData({ ...userData, experiencias: e.target.value })}
                                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all min-h-24"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm text-gray-400 mb-1 block">Resumo Pessoal</label>
                                        <textarea
                                            placeholder="Conte-nos sobre você..."
                                            value={userData.resumo}
                                            onChange={(e) => setUserData({ ...userData, resumo: e.target.value })}
                                            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all min-h-24"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2 flex-wrap">
                                    <button 
                                        onClick={saveUserData} 
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                    >
                                        💾 Salvar Perfil
                                    </button>
                                    <button 
                                        onClick={() => { setUserData(normalizeUserData({})); generateArchetype({}); }} 
                                        className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        🔄 Resetar
                                    </button>
                                </div>
                            </div>

                            {/* Chat Interface */}
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    💬 Conversa com IA
                                </h3>
                                <ChatInterface ref={chatRef} userData={userData} />
                            </div>
                        </motion.div>

                        {/* Sidebar - Histórico e Ações */}
                        <motion.aside 
                            className="space-y-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {/* Histórico */}
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    📚 Histórico
                                </h4>
                                <ChatHistory onLoadConversation={handleLoadConversation} />
                            </div>

                            {/* Ações */}
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all space-y-3">
                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    ⚡ Ações Rápidas
                                </h4>
                                <button 
                                    onClick={handleSaveArchetype} 
                                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center justify-center gap-2"
                                >
                                    💎 Salvar Arquétipo
                                </button>
                                <button 
                                    onClick={() => { 
                                        if (chatRef.current && chatRef.current.saveConversation) { 
                                            chatRef.current.saveConversation(); 
                                            alert('Conversa salva!'); 
                                        } 
                                    }} 
                                    className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
                                >
                                    💾 Salvar Conversa
                                </button>
                                <button 
                                    onClick={() => { 
                                        if (chatRef.current && chatRef.current.clearConversation) { 
                                            chatRef.current.clearConversation(); 
                                            alert('Conversa limpa!'); 
                                        } 
                                    }} 
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
                                >
                                    🗑️ Limpar Conversa
                                </button>
                            </div>

                            {/* Dicas */}
                            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-700/50 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-indigo-300 mb-3">💡 Dicas</h4>
                                <ul className="text-sm text-gray-300 space-y-2">
                                    <li>✨ Complete seu perfil para melhores análises</li>
                                    <li>💬 Converse com a IA de forma natural</li>
                                    <li>📊 Acompanhe seu crescimento no perfil</li>
                                    <li>🎯 Defina metas de desenvolvimento</li>
                                </ul>
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

export default Discovery;