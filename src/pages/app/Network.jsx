import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase.js';
import { collection, getDocs, doc, getDoc, query, orderBy, updateDoc, increment, arrayUnion, arrayRemove, writeBatch } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import SidebarLayout from '../../components/layout/SideBarLayout';
import ProfileCard from '../../components/features/network/ProfileCard';
import ProfileModal from '../../components/features/network/ProfileModal';
import ProfileFilters from '../../components/features/network/ProfileFilters';
import Leaderboard from '../../components/features/gamification/Leaderboard'; 
import { BrainCircuit, Lightbulb, Users, Code, BarChartHorizontal } from 'lucide-react';

// Definições de arquétipos para exibição na página Network
const archetypesConfig = {
    CONSTRUTOR: { name: 'O Construtor', icon: Code, color: 'text-sky-400' },
    ARQUITETO: { name: 'O Arquiteto', icon: BrainCircuit, color: 'text-purple-400' },
    INOVADOR: { name: 'O Inovador', icon: Lightbulb, color: 'text-yellow-400' },
    COMUNICADOR: { name: 'O Comunicador', icon: Users, color: 'text-green-400' },
    ANALISTA: { name: 'O Analista', icon: BarChartHorizontal, color: 'text-orange-400' },
};

const ArchetypeBadge = ({ archetypeKey }) => {
    const archetype = archetypesConfig[archetypeKey];
    if (!archetype) return null;

    const Icon = archetype.icon;
    return (
        <div className={`flex items-center gap-1 text-xs ${archetype.color}`}>
            <Icon className="w-3 h-3" />
            <span className="font-semibold">{archetype.name}</span>
        </div>
    );
};
import SkillsChart from '../../components/features/gamification/SkillsChart';
import CommunityAmbassadorBadge from '../../components/features/gamification/CommunityAmbassadorBadge';
import PositiveImpactHistory from '../../components/features/gamification/PositiveImpactHistory';
import { Loader2, AlertTriangle, User, ThumbsUp, MessageCircle, Share2, Heart, Send, Bookmark, Flag, Eye, UserPlus, Mail, Link2, Shield } from 'lucide-react';

function Network() {
    const { user, profile: authProfile, reloadProfile } = useAuth();
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [trustCircle, setTrustCircle] = useState([]);

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
                        archetypeKey: docData.archetypeKey || null, 
                    };
                });
                setProfiles(data);
                setFilteredProfiles(data);

                try {
                    const pubsSnapshot = await getDocs(query(collection(db, 'publications'), orderBy('timestamp', 'desc')));
                    const pubsList = pubsSnapshot.docs.map(doc => {
                        const pubData = doc.data();
                        const deterministicViews = ((pubData.likes || 0) * 10) + (pubData.commentCount || 0) * 5 + 100;
                        return {
                            id: doc.id,
                            userId: pubData.userId || '',
                            userName: pubData.userName || 'Usuário Anônimo',
                            content: pubData.content || '',
                            timestamp: pubData.timestamp || new Date().toISOString(),
                            views: deterministicViews || 100,
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
                        setTrustCircle(data.slice(0, 3));
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
    }, [user]);

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

    const handleLikePublication = async (pubId) => {
        if (!user || isSubmitting) return;
        setIsSubmitting(true);

        const pubRef = doc(db, 'publications', pubId);
        const userRef = doc(db, 'users', user.uid);
        const isLiked = likedPublications.has(pubId);

        const newLiked = new Set(likedPublications);
        isLiked ? newLiked.delete(pubId) : newLiked.add(pubId);
        setLikedPublications(newLiked);

        setPublications(pubs => pubs.map(p => {
            if (p.id === pubId) {
                return { ...p, likes: p.likes + (isLiked ? -1 : 1) };
            }
            return p;
        }));

        try {
            const batch = writeBatch(db);
            batch.update(pubRef, { likes: increment(isLiked ? -1 : 1) });
            batch.update(userRef, { likedPublications: isLiked ? arrayRemove(pubId) : arrayUnion(pubId) });
            await batch.commit();
            await reloadProfile(); 
        } catch (error) {
            console.error("Error liking publication:", error);
            setLikedPublications(likedPublications);
            setPublications(pubs => pubs.map(p => {
                if (p.id === pubId) {
                    return { ...p, likes: p.likes + (isLiked ? 1 : -1) };
                }
                return p;
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSavePublication = async (pubId) => {
        if (!user || isSubmitting) return;
        setIsSubmitting(true);

        const userRef = doc(db, 'users', user.uid);
        const isSaved = savedPublications.has(pubId);

        const newSaved = new Set(savedPublications);
        isSaved ? newSaved.delete(pubId) : newSaved.add(pubId);
        setSavedPublications(newSaved);

        try {
            await updateDoc(userRef, {
                savedPublications: isSaved ? arrayRemove(pubId) : arrayUnion(pubId)
            });
            await reloadProfile();
        } catch (error) {
            console.error("Error saving publication:", error);
            setSavedPublications(savedPublications);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddComment = async (pubId) => {
        const commentText = newComments[pubId];
        if (!user || !commentText?.trim() || isSubmitting) return;
        setIsSubmitting(true);

        const pubRef = doc(db, 'publications', pubId);
        const newComment = {
            userId: user.uid,
            userName: authProfile?.nome || 'Usuário Anônimo',
            userInitial: (authProfile?.nome || 'U').charAt(0).toUpperCase(),
            text: commentText,
            timestamp: new Date().toISOString(),
        };

        try {
            await updateDoc(pubRef, {
                comments: arrayUnion(newComment),
                commentCount: increment(1)
            });
            setPublications(pubs => pubs.map(p => p.id === pubId ? { ...p, comments: [...(p.comments || []), newComment], commentCount: (p.commentCount || 0) + 1 } : p));
            setNewComments(prev => ({ ...prev, [pubId]: '' }));
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Erro ao adicionar comentário.");
        } finally {
            setIsSubmitting(false);
        }
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

    useEffect(() => {
        if (authProfile) {
            setLikedPublications(new Set(authProfile.likedPublications || []));
            setSavedPublications(new Set(authProfile.savedPublications || []));
        }
    }, [authProfile]);


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
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold mb-2 text-white">🌐 Rede Profissional</h2>
                        <p className="text-gray-400">Conecte-se com profissionais, explore oportunidades e acompanhe as novidades.</p>
                    </div>

                    {/* Seu Perfil e Gamificação */}
                    {userProfile && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div className="md:col-span-2 flex flex-col gap-8">
                                <div className="bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-indigo-950 border border-indigo-700/50 rounded-xl p-8 text-white shadow-lg hover:shadow-indigo-500/20 transition-all flex-grow">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
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
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <Shield className="text-blue-400" />
                                        Círculos de Confiança
                                    </h3>
                                    <ul className="space-y-3">
                                        {trustCircle.map(member => (
                                            <li key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50">
                                                <img src={member.foto || `https://i.pravatar.cc/40?u=${member.id}`} alt={member.nome} className="w-8 h-8 rounded-full" />
                                                <div>
                                                    <p className="font-semibold text-sm">{member.nome}</p>
                                                    <p className="text-xs text-gray-400">{member.cargo}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="md:col-span-1">
                                <div className="h-full">
                                    <Leaderboard city={userProfile.localizacao} />
                                </div>
                            </div>
                            <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <SkillsChart userSkills={userProfile.habilidadesTecnicas || []} demandedSkills={demandedSkills} />
                                <CommunityAmbassadorBadge level={userProfile.ambassadorLevel} />
                                <PositiveImpactHistory impacts={positiveImpacts} />
                            </div>
                        </div>
                    )}

                    {/* Feed de Publicações - LinkedIn Style */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {publications.length > 0 && (
                                <div className="space-y-4">
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
                                                <span>{pub.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{pub.commentCount || pub.comments?.length || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-4 h-4" />
                                                <span>{pub.views}</span>
                                            </div>
                                        </div>

                                        {/* Ações */}
                                        <div className="flex justify-between items-center gap-2">
                                            <button
                                                onClick={() => handleLikePublication(pub.id)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-all disabled:opacity-50 ${
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
                                                className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-all disabled:opacity-50"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                <span className="text-sm">Comentar</span>
                                            </button>
                                            <button
                                                onClick={() => handleSavePublication(pub.id)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded transition-all disabled:opacity-50 ${
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
                                                {/* Lista de Comentários */}
                                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                                    {pub.comments && pub.comments.length > 0 ? pub.comments.map((comment, index) => (
                                                        <div key={index} className="flex items-start gap-2">
                                                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                                {comment.userInitial}
                                                            </div>
                                                            <div className="bg-gray-800 p-3 rounded-lg flex-1">
                                                                <p className="font-semibold text-sm text-white">{comment.userName}</p>
                                                                <p className="text-sm text-gray-300">{comment.text}</p>
                                                            </div>
                                                        </div>
                                                    )) : <p className="text-sm text-gray-500 text-center">Seja o primeiro a comentar!</p>}
                                                </div>
                                                {/* Input de Comentário */}
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Adicione um comentário..."
                                                        value={newComments[pub.id] || ''}
                                                        onChange={(e) => setNewComments({...newComments, [pub.id]: e.target.value})}
                                                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                                                    />
                                                    <button
                                                        onClick={() => handleAddComment(pub.id)}
                                                        disabled={isSubmitting}
                                                        className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded text-white disabled:opacity-50">
                                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1 space-y-6">
                            {/* Seção de Filtros */}
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-white mb-4">Filtrar Profissionais</h3>
                                <ProfileFilters onSearch={handleSearch} onFilter={handleFilter} />
                            </div>

                            {/* Grid de Perfis */}
                            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-white mb-4">👥 Profissionais ({filteredProfiles.length})</h3>
                                {filteredProfiles.length > 0 ? (
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                        {filteredProfiles.map(profile => (
                                            <div
                                                key={profile.id}
                                                className="bg-gray-900 border border-gray-800 rounded-lg p-3 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200 cursor-pointer group"
                                                onClick={() => setSelectedProfile(profile)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                        {(profile.nome || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-white font-semibold text-sm truncate">{profile.nome}</p>
                                                        <div className="text-xs text-gray-400 truncate">
                                                            {profile.archetypeKey ? <ArchetypeBadge archetypeKey={profile.archetypeKey} /> : <span>{profile.cargo}</span>}
                                                        </div>
                                                    </div>
                                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded text-xs font-semibold transition-colors opacity-0 group-hover:opacity-100">
                                                        <UserPlus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400">Nenhum perfil encontrado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {selectedProfile && (
                        <ProfileModal
                            profile={selectedProfile}
                            isOpen={!!selectedProfile}
                            onClose={() => setSelectedProfile(null)}
                        >
                            {/* O conteúdo do ProfileCard foi movido para cá para incluir o ArchetypeBadge */}
                            <div className="text-center">
                                <img src={selectedProfile.foto || '/default-avatar.png'} alt={selectedProfile.nome || 'Perfil'} className="w-24 h-24 rounded-full mb-4 border-2 border-indigo-500 mx-auto" />
                                <h4 className="font-bold text-2xl text-white">{selectedProfile.nome || 'Nome não disponível'}</h4>
                                <div className="text-gray-400 mt-1 flex justify-center">
                                    {selectedProfile.archetypeKey ? <ArchetypeBadge archetypeKey={selectedProfile.archetypeKey} /> : <span>{selectedProfile.cargo || 'Cargo não definido'}</span>}
                                </div>
                                <p className="text-sm text-gray-500 mt-4">{selectedProfile.habilidadesTecnicas?.join(', ') || 'Habilidades não listadas'}</p>
                                <div className="flex justify-center mt-4 flex-wrap gap-2">
                                    {selectedProfile.badges?.map(badge => (
                                        <span key={badge} className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold">
                                            {badge}
                                        </span>
                                    )) || <span className="text-gray-500 text-xs">Sem badges</span>}
                                </div>
                            </div>
                        </ProfileModal>
                    )}

                </div>
            </div>
        </SidebarLayout>
    );
}

export default Network;
