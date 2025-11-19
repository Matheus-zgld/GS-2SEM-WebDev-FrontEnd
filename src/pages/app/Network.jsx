import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase.js';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import SidebarLayout from '../../components/layout/SideBarLayout';
import ProfileCard from '../../components/features/network/ProfileCard';
import ProfileModal from '../../components/features/network/ProfileModal';
import ProfileFilters from '../../components/features/network/ProfileFilters';
import Leaderboard from '../../components/features/gamification/Leaderboard';
import SkillsChart from '../../components/features/gamification/SkillsChart';
import CommunityAmbassadorBadge from '../../components/features/gamification/CommunityAmbassadorBadge';
import PositiveImpactHistory from '../../components/features/gamification/PositiveImpactHistory';
import { Loader2, AlertTriangle, User, ThumbsUp, MessageCircle, Share2, Heart, Send, Bookmark, Flag, Eye, UserPlus, Mail, Link2, Shield } from 'lucide-react';

function Network() {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [likedPublications, setLikedPublications] = useState(new Set());
    const [savedPublications, setSavedPublications] = useState(new Set());
    const [commentingOn, setCommentingOn] = useState(null);
    const [newComments, setNewComments] = useState({});
    const [hoveredPub, setHoveredPub] = useState(null);
    const [trustCircle, setTrustCircle] = useState([]);

    // Mock data for new components
    const demandedSkills = [
        { name: 'React', demand: 80 },
        { name: 'Node.js', demand: 70 },
        { name: 'Python', demand: 90 },
        { name: 'Figma', demand: 60 },
        { name: 'AWS', demand: 85 },
    ];
    const positiveImpacts = [
        { description: 'Ajudou a reflorescer 250 árvores virtuais no Desafio do Mês.' },
        { description: 'Mentorou 3 novos usuários na plataforma.' },
        { description: 'Contribuiu com 10 horas de voluntariado em projetos de impacto social.' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const data = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        email: docData.email || 'E-mail indisponível',
                        pontosGamificacao: docData.pontosGamificacao || 0,
                        nome: docData.nome || docData.email || 'Utilizador Anônimo',
                        area: docData.area || 'Área não definida',
                        foto: docData.foto || '/default-avatar.png',
                        cargo: docData.cargo || 'Cargo não definido',
                        habilidadesTecnicas: Array.isArray(docData.habilidadesTecnicas) ? docData.habilidadesTecnicas : [],
                        softSkills: Array.isArray(docData.softSkills) ? docData.softSkills : [],
                        localizacao: docData.localizacao || 'Localização não definida',
                        resumo: docData.resumo || 'Resumo não disponível',
                        experiencias: Array.isArray(docData.experiencias) ? docData.experiencias : [],
                        formacao: Array.isArray(docData.formacao) ? docData.formacao : [],
                        projetos: Array.isArray(docData.projetos) ? docData.projetos : [],
                        certificacoes: Array.isArray(docData.certificacoes) ? docData.certificacoes : [],
                        idiomas: Array.isArray(docData.idiomas) ? docData.idiomas : [],
                        areaInteresses: Array.isArray(docData.areaInteresses) ? docData.areaInteresses : [],
                        badges: Array.isArray(docData.badges) ? docData.badges : [],
                        ambassadorLevel: docData.ambassadorLevel || 1,
                    };
                });
                setProfiles(data);
                setFilteredProfiles(data);

                try {
                    const pubsSnapshot = await getDocs(query(collection(db, 'publications'), orderBy('timestamp', 'desc')));
                    const pubsList = pubsSnapshot.docs.map(doc => {
                        const pubData = doc.data();
                        return {
                            id: doc.id,
                            userId: pubData.userId || '',
                            userName: pubData.userName || 'Usuário Anônimo',
                            content: pubData.content || '',
                            timestamp: pubData.timestamp || new Date().toISOString(),
                            likes: pubData.likes || 0,
                            comments: pubData.comments || 0,
                            userInitial: (pubData.userName || 'U').charAt(0).toUpperCase(),
                        };
                    });
                    setPublications(pubsList);
                } catch (pubsErr) {
                    console.warn('Publications collection not found:', pubsErr);
                    setPublications([]);
                }

                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserProfile({ id: user.uid, ...userData, ambassadorLevel: userData.ambassadorLevel || 1 });
                        // Mock trust circle
                        setTrustCircle(profiles.slice(0, 3));
                    } else {
                        setUserProfile({ id: user.uid, email: user.email, nome: 'Perfil não configurado', ambassadorLevel: 1 });
                    }
                }
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                setError("Erro ao carregar dados: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, profiles]);

    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase();
        const filtered = profiles.filter(p =>
            (p.nome?.toLowerCase().includes(lowerQuery)) ||
            (p.area?.toLowerCase().includes(lowerQuery)) ||
            (p.localizacao?.toLowerCase().includes(lowerQuery)) ||
            (p.habilidadesTecnicas?.some(h => h.toLowerCase().includes(lowerQuery)))
        );
        setFilteredProfiles(filtered);
    };

    const handleFilter = (filters) => {
        let filtered = profiles;
        if (filters.area) {
            filtered = filtered.filter(p => p.area === filters.area);
        }
        if (filters.cidade) {
            filtered = filtered.filter(p => p.localizacao && p.localizacao.includes(filters.cidade));
        }
        if (filters.tecnologia) {
            filtered = filtered.filter(p => p.habilidadesTecnicas && p.habilidadesTecnicas.includes(filters.tecnologia));
        }
        setFilteredProfiles(filtered);
    };

    const handleLikePublication = (pubId) => {
        setLikedPublications(prev => {
            const updated = new Set(prev);
            if (updated.has(pubId)) {
                updated.delete(pubId);
            } else {
                updated.add(pubId);
            }
            return updated;
        });
    };

    const handleSavePublication = (pubId) => {
        setSavedPublications(prev => {
            const updated = new Set(prev);
            if (updated.has(pubId)) {
                updated.delete(pubId);
            } else {
                updated.add(pubId);
            }
            return updated;
        });
    };

    const formatTimeAgo = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return 'Agora';
    };

    if (loading) {
        return (
            <SidebarLayout>
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-gray-400">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                    <p className="mt-4 text-lg">Carregando rede...</p>
                </div>
            </SidebarLayout>
        );
    }

    if (error) {
        return (
            <SidebarLayout>
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-red-400 p-6">
                    <AlertTriangle className="w-12 h-12 mb-4" />
                    <p className="text-lg">{error}</p>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div className="p-6 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold mb-2 text-white">🌐 Rede Profissional</h2>
                        <p className="text-gray-400">Conecte-se com profissionais e explore oportunidades</p>
                    </div>

                    {/* Seu Perfil e Gamificação */}
                    {userProfile && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="md:col-span-2">
                                <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-indigo-950 border border-indigo-700/50 rounded-xl p-8 text-white shadow-lg hover:shadow-indigo-500/20 transition-all">
                                    <div className="flex justify-between items-start gap-6">
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-bold mb-2">{userProfile.nome}</h3>
                                            <p className="text-indigo-200 text-lg font-semibold">{userProfile.cargo || 'Profissional'}</p>
                                            <p className="text-sm text-indigo-200 mt-2">📍 {userProfile.localizacao || 'Local não definido'}</p>
                                        </div>
                                        <div className="text-right bg-indigo-600/30 px-6 py-4 rounded-lg border border-indigo-600/50">
                                            <p className="text-4xl font-bold text-indigo-300">{userProfile.pontosGamificacao || 0}</p>
                                            <p className="text-xs text-indigo-200 mt-1">Pontos</p>
                                        </div>
                                    </div>
                                    <p className="text-indigo-100 mt-6 leading-relaxed">{userProfile.resumo || 'Sem resumo'}</p>
                                    <div className="flex gap-3 mt-6">
                                        <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2 transition-colors">
                                            <Mail className="w-4 h-4" /> Mensagem
                                        </button>
                                        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors">
                                            <Link2 className="w-4 h-4" /> Conectar
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0">
                                    <Leaderboard city={userProfile.localizacao} />
                                </div>
                            </div>
                            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SkillsChart userSkills={userProfile.habilidadesTecnicas || []} demandedSkills={demandedSkills} />
                                <CommunityAmbassadorBadge level={userProfile.ambassadorLevel} />
                                <PositiveImpactHistory impacts={positiveImpacts} />
                                <div>
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <Shield className="text-blue-400" />
                                        Círculos de Confiança
                                    </h3>
                                    <div className="bg-gray-800 p-4 rounded-lg">
                                        <ul className="space-y-3">
                                            {trustCircle.map(member => (
                                                <li key={member.id} className="flex items-center gap-3">
                                                    <img src={member.foto || `https://i.pravatar.cc/40?u=${member.id}`} alt={member.nome} className="w-8 h-8 rounded-full" />
                                                    <div>
                                                        <p className="font-semibold">{member.nome}</p>
                                                        <p className="text-xs text-gray-400">{member.cargo}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Feed de Publicações - LinkedIn Style */}
                    {publications.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-4">📰 Feed</h3>
                            <div className="space-y-4 max-w-2xl">
                                {publications.map(pub => (
                                    <div
                                        key={pub.id}
                                        onMouseEnter={() => setHoveredPub(pub.id)}
                                        onMouseLeave={() => setHoveredPub(null)}
                                        className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-indigo-500 transition-all"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {pub.userInitial}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">{pub.userName}</p>
                                                    <p className="text-xs text-gray-400">{formatTimeAgo(pub.timestamp)}</p>
                                                </div>
                                            </div>
                                            {hoveredPub === pub.id && (
                                                <button className="text-gray-400 hover:text-gray-300">
                                                    <Flag className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Conteúdo */}
                                        <p className="text-gray-300 mb-4 leading-relaxed">{pub.content}</p>

                                        {/* Engajamento Stats */}
                                        <div className="flex justify-between items-center text-xs text-gray-400 border-y border-gray-700 py-2 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-4 h-4 text-red-500" />
                                                <span>{pub.likes + (likedPublications.has(pub.id) ? 1 : 0)}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{pub.comments}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{Math.floor(Math.random() * 500 + 50)}</span>
                                            </div>
                                        </div>

                                        {/* Ações */}
                                        <div className="flex justify-between items-center gap-2">
                                            <button
                                                onClick={() => handleLikePublication(pub.id)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-all ${
                                                    likedPublications.has(pub.id)
                                                        ? 'text-red-500 bg-red-500/10'
                                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                                                }`}
                                            >
                                                <Heart className={`w-4 h-4 ${likedPublications.has(pub.id) ? 'fill-current' : ''}`} />
                                                <span className="text-sm">Curtir</span>
                                            </button>
                                            <button
                                                onClick={() => setCommentingOn(commentingOn === pub.id ? null : pub.id)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-all"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                <span className="text-sm">Comentar</span>
                                            </button>
                                            <button
                                                onClick={() => handleSavePublication(pub.id)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-all ${
                                                    savedPublications.has(pub.id)
                                                        ? 'text-yellow-500 bg-yellow-500/10'
                                                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                                                }`}
                                            >
                                                <Bookmark className={`w-4 h-4 ${savedPublications.has(pub.id) ? 'fill-current' : ''}`} />
                                                <span className="text-sm">Salvar</span>
                                            </button>
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-all">
                                                <Share2 className="w-4 h-4" />
                                                <span className="text-sm">Compartilhar</span>
                                            </button>
                                        </div>

                                        {/* Comentários */}
                                        {commentingOn === pub.id && (
                                            <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Adicione um comentário..."
                                                        value={newComments[pub.id] || ''}
                                                        onChange={(e) => setNewComments({...newComments, [pub.id]: e.target.value})}
                                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                                                    />
                                                    <button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded text-white">
                                                        <Send className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seção de Filtros */}
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-6">
                        <ProfileFilters onSearch={handleSearch} onFilter={handleFilter} />
                    </div>

                    {/* Grid de Perfis */}
                    <h3 className="text-2xl font-bold text-white mb-4">👥 Profissionais ({filteredProfiles.length})</h3>
                    {filteredProfiles.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {filteredProfiles.map(profile => (
                                <div
                                    key={profile.id}
                                    className="bg-gray-950 border border-gray-800 rounded-xl p-4 hover:bg-gray-900 hover:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                                    onClick={() => setSelectedProfile(profile)}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {(profile.nome || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-semibold text-sm">{profile.nome}</p>
                                            <p className="text-xs text-gray-400">{profile.cargo}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3">{profile.localizacao}</p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {profile.badges?.slice(0, 2).map((badge, idx) => (
                                            <span key={idx} className="text-xs bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded">
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                                            <UserPlus className="w-3 h-3" /> Conectar
                                        </button>
                                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded text-xs font-semibold transition-colors">
                                            Ver Perfil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-950 border border-gray-800 rounded-xl">
                            <p className="text-gray-400">Nenhum perfil encontrado</p>
                        </div>
                    )}

                    <ProfileModal
                        profile={selectedProfile}
                        isOpen={!!selectedProfile}
                        onClose={() => setSelectedProfile(null)}
                    />
                </div>
            </div>
        </SidebarLayout>
    );
}

export default Network;
