import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { Trophy, MapPin } from 'lucide-react';

const Leaderboard = ({ skill, city }) => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaders = async () => {
            setLoading(true);
            try {
                let q = query(
                    collection(db, 'users'),
                    orderBy('pontosGamificacao', 'desc'),
                    limit(10)
                );

                if (city) {
                    q = query(
                        collection(db, 'users'),
                        where('localizacao', '==', city),
                        orderBy('pontosGamificacao', 'desc'),
                        limit(10)
                    );
                }
                
                // This is a simplified version. For a real implementation, you would need a more complex query
                // or a different data structure to query by skill.
                // For now, we will just order by the general gamification points.

                const querySnapshot = await getDocs(q);
                const leadersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLeaders(leadersData);
            } catch (err) {
                setError('Erro ao carregar o placar de líderes.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaders();
    }, [skill, city]);

    if (loading) {
        return <div className="text-center p-4">Carregando placar...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                Placar de Líderes
            </h3>
            {city && (
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <MapPin size={16} />
                    <span>{city}</span>
                </div>
            )}
            <ul className="space-y-3">
                {leaders.map((leader, index) => (
                    <li key={leader.id} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-400">{index + 1}</span>
                            <img src={leader.avatarUrl || `https://i.pravatar.cc/40?u=${leader.id}`} alt={leader.nome} className="w-8 h-8 rounded-full" />
                            <span className="font-semibold">{leader.nome}</span>
                        </div>
                        <span className="font-bold text-yellow-400">{leader.pontosGamificacao} pts</span>
                    </li>
                ))}
            </ul>
            {leaders.length === 0 && (
                <p className="text-gray-500 text-center">Nenhum líder encontrado para esta seleção.</p>
            )}
        </div>
    );
};

export default Leaderboard;