import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Loader2, Zap, Trophy, Users, Target } from 'lucide-react';

function ARWorkspace() {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [filter, setFilter] = useState('todos');

    const odsColors = {
        'Educação de Qualidade': 'from-red-600 to-red-500',
        'Saúde e Bem-estar': 'from-green-600 to-green-500',
        'Tecnologia': 'from-blue-600 to-blue-500',
        'Sustentabilidade': 'from-emerald-600 to-emerald-500',
        'Inclusão Social': 'from-purple-600 to-purple-500',
        'Energias Renováveis': 'from-amber-600 to-amber-500',
        'Inovação': 'from-orange-600 to-orange-500',
    };

    const odsIcons = {
        'Educação de Qualidade': '🎓',
        'Saúde e Bem-estar': '❤️',
        'Tecnologia': '💻',
        'Sustentabilidade': '🌍',
        'Inclusão Social': '🤝',
        'Energias Renováveis': '⚡',
        'Inovação': '💡',
    };

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'challenges'));
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setChallenges(data);
            } catch (err) {
                console.error('Erro ao buscar desafios:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    const filteredChallenges = filter === 'todos' 
        ? challenges 
        : challenges.filter(c => {
            const ods = Array.isArray(c.ods) ? c.ods : [];
            return ods.includes(filter);
          });

    const getDifficultyColor = (dif) => {
        switch (dif?.toLowerCase()) {
            case 'iniciante': return 'text-green-400';
            case 'intermediário': return 'text-yellow-400';
            case 'avançado': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Galeria de Desafios</h3>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-2" />
                        <p className="text-gray-400">Carregando desafios...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white mb-2">🎯 Galeria de Desafios</h3>
            <p className="text-gray-400 text-sm mb-4">{challenges.length} desafios disponíveis para explorar e participar</p>

            {/* Filtros */}
            <div className="flex gap-2 mb-6 flex-wrap">
                <button
                    onClick={() => setFilter('todos')}
                    className={`px-4 py-2 rounded-lg transition-all ${
                        filter === 'todos'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                    Todos
                </button>
                {Object.keys(odsColors).map(ods => (
                    <button
                        key={ods}
                        onClick={() => setFilter(ods)}
                        className={`px-4 py-2 rounded-lg transition-all text-sm ${
                            filter === ods
                                ? `bg-gradient-to-r ${odsColors[ods]} text-white`
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                        {odsIcons[ods]} {ods.split(' ')[0]}
                    </button>
                ))}
            </div>

            {/* Galeria de Cards */}
            {filteredChallenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredChallenges.map(challenge => {
                        const primaryOds = Array.isArray(challenge.ods) ? challenge.ods[0] : 'Inovação';
                        const gradient = odsColors[primaryOds] || odsColors['Inovação'];
                        const icon = odsIcons[primaryOds] || '🎯';
                        
                        return (
                            <div
                                key={challenge.id}
                                onClick={() => setSelectedChallenge(challenge)}
                                className="group bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-indigo-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-1"
                            >
                                {/* Header com gradiente */}
                                <div className={`bg-gradient-to-r ${gradient} p-4 relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 text-4xl opacity-20">{icon}</div>
                                    <h4 className="text-white font-bold text-lg pr-8 line-clamp-2">{challenge.titulo}</h4>
                                    <p className="text-xs text-gray-200 mt-1">{primaryOds}</p>
                                </div>

                                {/* Corpo */}
                                <div className="p-4 space-y-3">
                                    <p className="text-gray-300 text-sm line-clamp-2">{challenge.descricao}</p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                        <div className="bg-gray-800 rounded p-2">
                                            <Trophy className="w-4 h-4 mx-auto text-yellow-400 mb-1" />
                                            <span className="text-gray-300">{challenge.pontos || 50}pts</span>
                                        </div>
                                        <div className="bg-gray-800 rounded p-2">
                                            <Zap className={`w-4 h-4 mx-auto mb-1 ${getDifficultyColor(challenge.dificuldade)}`} />
                                            <span className={getDifficultyColor(challenge.dificuldade)}>
                                                {challenge.dificuldade || 'Intermediário'}
                                            </span>
                                        </div>
                                        <div className="bg-gray-800 rounded p-2">
                                            <Users className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                                            <span className="text-gray-300">{challenge.participants || 0}</span>
                                        </div>
                                    </div>

                                    {/* Tags ODS */}
                                    <div className="flex flex-wrap gap-1">
                                        {Array.isArray(challenge.ods) && challenge.ods.slice(0, 2).map(ods => (
                                            <span key={ods} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                                {odsIcons[ods]} {ods.split(' ')[0]}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Botão */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/app/challenge/${challenge.id}`);
                                        }}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold transition-colors mt-3"
                                    >
                                        Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Nenhum desafio encontrado nesta categoria</p>
                </div>
            )}

            {/* Modal de detalhes rápidos */}
            {selectedChallenge && (
                <div className="fixed inset-0 bg-black/50 flex items-end z-50">
                    <div className="bg-gray-900 border-t border-gray-700 w-full max-w-md rounded-t-xl p-6 space-y-4">
                        <h3 className="text-2xl font-bold text-white">{selectedChallenge.titulo}</h3>
                        <p className="text-gray-300">{selectedChallenge.descricao}</p>
                        <button
                            onClick={() => navigate(`/app/challenge/${selectedChallenge.id}`)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold"
                        >
                            Abrir Desafio Completo
                        </button>
                        <button
                            onClick={() => setSelectedChallenge(null)}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ARWorkspace;