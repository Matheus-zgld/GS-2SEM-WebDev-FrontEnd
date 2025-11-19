import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import SidebarLayout from '../../components/layout/SideBarLayout';
import ChallengeCard from '../../components/features/marketplace/ChallengeCard';
import PublishChallengeForm from '../../components/features/marketplace/PublishChallengeForm';
import { Loader2, AlertTriangle, PlusCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

function Marketplace() {
    const [challenges, setChallenges] = useState([]);
    const [filteredChallenges, setFilteredChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [showInclusionGuaranteed, setShowInclusionGuaranteed] = useState(false);
    const { user, profile } = useAuth();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'challenges'));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setChallenges(data);
                setFilteredChallenges(data);
            } catch (err) {
                setError("Erro ao carregar desafios: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    useEffect(() => {
        let filtered = challenges;
        if (showInclusionGuaranteed) {
            filtered = filtered.filter(c => c.inclusionGuaranteed);
        }
        setFilteredChallenges(filtered);
    }, [showInclusionGuaranteed, challenges]);

    const handleApply = async (challenge) => {
        try {
            if (!user) return alert('Faça login para aplicar ao desafio');
            const challengeTitle = challenge.titulo || 'Desafio Sem Título';
            await addDoc(collection(db, 'applications'), {
                challengeId: challenge.id,
                challengeTitle: challengeTitle,
                userId: user.uid,
                userEmail: user.email,
                appliedAt: new Date(),
                status: 'applied',
                profileSnapshot: profile || null
            });
            alert('Aplicação enviada com sucesso!');
        } catch (err) {
            console.error('Erro ao aplicar:', err);
            alert('Erro ao aplicar: ' + err.message);
        }
    };

    if (loading) {
        return (
            <SidebarLayout>
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
                    <p className="mt-4 text-lg">Carregando desafios...</p>
                </div>
            </SidebarLayout>
        );
    }

    if (error) {
        return (
            <SidebarLayout>
                <div className="flex flex-col items-center justify-center h-full text-red-400 p-6">
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 max-w-md text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Ocorreu um erro</h3>
                        <p className="text-gray-400">{error}</p>
                        <Button onClick={() => window.location.reload()} className="mt-6">
                            Tentar Novamente
                        </Button>
                    </div>
                </div>
            </SidebarLayout>
        );
    }

    return (
        <SidebarLayout>
            <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">🎯 Mercado de Desafios</h1>
                            <p className="text-gray-400 mt-1">Explore, aplique e publique desafios que impulsionam sua carreira e o mundo.</p>
                        </div>
                        <Button onClick={() => setIsPublishModalOpen(true)} className="flex items-center gap-2">
                            <PlusCircle className="w-5 h-5" />
                            Publicar Desafio
                        </Button>
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-gray-300">
                            <input
                                type="checkbox"
                                checked={showInclusionGuaranteed}
                                onChange={(e) => setShowInclusionGuaranteed(e.target.checked)}
                                className="accent-purple-600"
                            />
                            Mostrar apenas vagas com 'Inclusão Garantida'
                        </label>
                    </div>

                    {filteredChallenges.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredChallenges.map(challenge => (
                                <ChallengeCard key={challenge.id} challenge={challenge} onApply={handleApply} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-20">
                            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md mx-auto">
                                <h3 className="text-xl font-bold text-white">Nenhum desafio encontrado</h3>
                                <p className="mt-2">Seja o primeiro a inspirar a comunidade. Publique um novo desafio!</p>
                                <Button onClick={() => setIsPublishModalOpen(true)} className="mt-6">
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Publicar Agora
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)}>
                <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full">
                    <PublishChallengeForm onSuccess={() => setIsPublishModalOpen(false)} />
                </div>
            </Modal>
        </SidebarLayout>
    );
}

export default Marketplace;
