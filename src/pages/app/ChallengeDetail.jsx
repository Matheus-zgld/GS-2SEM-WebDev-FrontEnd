import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, Share2, ThumbsUp, MessageCircle, Users, Award, Zap } from 'lucide-react';

export default function ChallengeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [challenge, setChallenge] = useState(null);
    const [owner, setOwner] = useState(null);
    const [applications, setApplications] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchChallenge = async () => {
            if (!id) return;
            try {
                const challengeDoc = await getDoc(doc(db, 'challenges', id));
                if (challengeDoc.exists()) {
                    const challengeData = { id: challengeDoc.id, ...challengeDoc.data() };
                    setChallenge(challengeData);

                    if (challengeData.ownerId) {
                        const ownerDoc = await getDoc(doc(db, 'users', challengeData.ownerId));
                        if (ownerDoc.exists()) {
                            setOwner({ id: ownerDoc.id, ...ownerDoc.data() });
                        }
                    }

                    const appsQuery = query(collection(db, 'applications'), where('challengeId', '==', id));
                    const appsSnapshot = await getDocs(appsQuery);
                    const appsList = appsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setApplications(appsList);

                    const userApplication = appsList.find((app) => app.userId === user?.uid);
                    setHasApplied(!!userApplication);

                    if (challengeData.comments && Array.isArray(challengeData.comments)) {
                        setComments(challengeData.comments);
                    }
                } else {
                    console.error('Challenge not found');
                }
            } catch (err) {
                console.error('Error fetching challenge:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenge();
    }, [id, user]);

    const handleApply = async () => {
        if (!user) return alert('Faça login para se candidatar');
        try {
            const newApp = {
                userId: user.uid,
                challengeId: id,
                userName: user.displayName || 'Usuário',
                userEmail: user.email,
                appliedAt: new Date().toISOString(),
                status: 'pending',
            };
            setApplications([...applications, newApp]);
            setHasApplied(true);
            alert('Candidatura enviada com sucesso!');
        } catch (err) {
            console.error('Error applying:', err);
            alert('Erro ao enviar candidatura');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        try {
            const comment = {
                userId: user.uid,
                userName: user.displayName || 'Usuário',
                text: newComment,
                timestamp: new Date().toISOString(),
            };
            setComments([comment, ...comments]);
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const handleShare = () => {
        const text = `Confira este desafio: ${challenge?.titulo || 'Desafio'} em SYNAPSE`;
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({ title: 'SYNAPSE Challenge', text, url });
        } else {
            alert('Link copiado: ' + url);
            navigator.clipboard.writeText(url);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-950">
                <p className="text-gray-400">Carregando desafio...</p>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-950">
                <p className="text-gray-400">Desafio não encontrado</p>
            </div>
        );
    }

    const ods = Array.isArray(challenge.ods) ? challenge.ods : [];
    const odsBadges = {
        'Educação de Qualidade': '#e74c3c',
        'Saúde e Bem-estar': '#27ae60',
        'Tecnologia': '#3498db',
        'Sustentabilidade': '#2ecc71',
        'Inclusão Social': '#9b59b6',
        'Energias Renováveis': '#f39c12',
        'Inovação': '#e67e22',
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold text-white flex-1">{challenge.titulo}</h1>
                    <button
                        onClick={handleShare}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h2 className="text-xl font-semibold text-white mb-4">Descrição</h2>
                            <p className="text-gray-300 leading-relaxed">{challenge.descricao || 'Sem descrição'}</p>
                        </div>

                        {/* ODS Tags */}
                        {ods.length > 0 && (
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                                <h2 className="text-xl font-semibold text-white mb-4">Objetivos de Desenvolvimento Sustentável</h2>
                                <div className="flex flex-wrap gap-3">
                                    {ods.map((o, idx) => (
                                        <div
                                            key={idx}
                                            className="px-4 py-2 rounded-full text-white font-semibold"
                                            style={{ backgroundColor: odsBadges[o] || '#6366f1' }}
                                        >
                                            {o}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Challenge Details */}
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-2">Nível de Dificuldade</h3>
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4 text-yellow-500" />
                                    <span className="text-white font-semibold">{challenge.dificuldade || 'Intermediário'}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-2">Tipo</h3>
                                <p className="text-white font-semibold">{challenge.tipo || 'Projeto'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-2">Data Limite</h3>
                                <p className="text-white font-semibold">
                                    {challenge.dataLimite ? new Date(challenge.dataLimite).toLocaleDateString() : 'Sem limite'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 mb-2">Pontos Gamificação</h3>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-indigo-500" />
                                    <span className="text-white font-semibold">{challenge.pontos || '0'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h2 className="text-xl font-semibold text-white mb-4">Comentários</h2>

                            {user && (
                                <form onSubmit={handleAddComment} className="mb-6 pb-6 border-b border-gray-800">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Deixe seu comentário..."
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                                        rows="3"
                                    />
                                    <button
                                        type="submit"
                                        className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition-colors"
                                    >
                                        Comentar
                                    </button>
                                </form>
                            )}

                            <div className="space-y-4">
                                {comments.length > 0 ? (
                                    comments.map((comment, idx) => (
                                        <div key={idx} className="bg-gray-800 p-4 rounded-lg">
                                            <p className="text-sm text-gray-400 mb-1">{comment.userName}</p>
                                            <p className="text-gray-200">{comment.text}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {comment.timestamp ? new Date(comment.timestamp).toLocaleDateString() : ''}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">Sem comentários ainda. Seja o primeiro!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="col-span-1 space-y-6">
                        {/* Criador */}
                        {owner && (
                            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                                <h3 className="text-lg font-semibold text-white mb-4">Criador</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {owner.nome?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{owner.nome}</p>
                                        <p className="text-xs text-gray-400">{owner.cargo || 'Profissional'}</p>
                                    </div>
                                </div>
                                <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-semibold transition-colors">
                                    Ver Perfil
                                </button>
                            </div>
                        )}

                        {/* Aplicações */}
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-indigo-500" />
                                <h3 className="text-lg font-semibold text-white">Participantes</h3>
                            </div>
                            <p className="text-2xl font-bold text-indigo-500 mb-4">{applications.length}</p>
                            <button
                                onClick={handleApply}
                                disabled={hasApplied}
                                className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                                    hasApplied
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }`}
                            >
                                {hasApplied ? 'Já Candidatado' : 'Se Candidatar'}
                            </button>
                        </div>

                        {/* Engajamento */}
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Curtidas</span>
                                </div>
                                <span className="text-white font-semibold">{challenge.likes || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Comentários</span>
                                </div>
                                <span className="text-white font-semibold">{comments.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
