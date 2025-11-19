import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase.js';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import SidebarLayout from '../../components/layout/SideBarLayout';
import ArchetypeDisplay from '../../components/features/discovery/ArchetypeDisplay';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Lightbulb, Users, Code, BarChartHorizontal } from 'lucide-react';

function normalizeUserData(data = {}) {
    return {
        habilidadesTecnicas: Array.isArray(data.habilidadesTecnicas) ? data.habilidadesTecnicas : (typeof data.habilidadesTecnicas === 'string' ? data.habilidadesTecnicas.split(',').map(s => s.trim()).filter(Boolean) : []),
        softSkills: Array.isArray(data.softSkills) ? data.softSkills : (typeof data.softSkills === 'string' ? data.softSkills.split(',').map(s => s.trim()).filter(Boolean) : []),
        areaInteresses: Array.isArray(data.areaInteresses) ? data.areaInteresses : (typeof data.areaInteresses === 'string' ? data.areaInteresses.split(',').map(s => s.trim()).filter(Boolean) : []),
        experiencias: Array.isArray(data.experiencias) ? data.experiencias.map(e => e.descricao || e) : (data.experiencias || ''),
        resumo: data.resumo || ''
    };
}

// --- Definições do Quiz e Arquétipos ---

const archetypes = {
    CONSTRUTOR: {
        name: 'O Construtor',
        description: 'Você é um fazedor, alguém que adora colocar a mão na massa e ver as ideias se transformando em realidade. Seu foco está em construir produtos funcionais e de alta qualidade.',
        badges: ['Pragmático', 'Técnico'],
        icon: Code
    },
    ARQUITETO: {
        name: 'O Arquiteto',
        description: 'Você tem uma visão sistêmica e pensa no quadro geral. Seu talento está em projetar sistemas robustos, escaláveis e bem estruturados, garantindo a base para o futuro.',
        badges: ['Estrategista', 'Visão de Futuro'],
        icon: BrainCircuit
    },
    INOVADOR: {
        name: 'O Inovador',
        description: 'Sua mente está sempre buscando o que há de novo. Você adora experimentar tecnologias emergentes e não tem medo de desbravar territórios desconhecidos para criar soluções disruptivas.',
        badges: ['Visionário', 'Experimental'],
        icon: Lightbulb
    },
    COMUNICADOR: {
        name: 'O Comunicador',
        description: 'Você conecta pessoas e ideias. Sua força está na colaboração, liderança e em garantir que a equipe esteja alinhada e que o produto final atenda às necessidades dos usuários.',
        badges: ['Colaborativo', 'Empático'],
        icon: Users
    },
    ANALISTA: {
        name: 'O Analista',
        description: 'Você é guiado por dados e lógica. Sua precisão e atenção aos detalhes garantem que as decisões sejam bem-informadas e que os problemas sejam resolvidos da forma mais eficiente possível.',
        badges: ['Metódico', 'Preciso'],
        icon: BarChartHorizontal
    },
};

const quizQuestions = [
    {
        question: "Qual parte de um projeto de tecnologia mais te empolga?",
        options: [
            { text: "Codificar e ver o produto funcionando.", archetype: "CONSTRUTOR" },
            { text: "Planejar a estrutura e a escalabilidade do sistema.", archetype: "ARQUITETO" },
            { text: "Pesquisar novas tecnologias para aplicar no projeto.", archetype: "INOVADOR" },
            { text: "Entender as necessidades do usuário e colaborar com a equipe.", archetype: "COMUNICADOR" },
            { text: "Analisar os dados de uso para encontrar melhorias.", archetype: "ANALISTA" },
        ],
    },
    {
        question: "Quando você encontra um problema complexo, qual é sua primeira reação?",
        options: [
            { text: "Dividir o problema em partes menores e começar a codificar uma solução.", archetype: "CONSTRUTOR" },
            { text: "Desenhar um diagrama de como a solução se encaixará no sistema existente.", archetype: "ARQUITETO" },
            { text: "Verificar se existe uma ferramenta ou abordagem totalmente nova para resolvê-lo.", archetype: "INOVADOR" },
            { text: "Organizar uma reunião com a equipe para discutir diferentes pontos de vista.", archetype: "COMUNICADOR" },
            { text: "Coletar todos os dados e evidências relacionadas ao problema antes de agir.", archetype: "ANALISTA" },
        ],
    },
    {
        question: "Que tipo de tarefa te dá mais satisfação?",
        options: [
            { text: "Finalizar uma funcionalidade e fazer o deploy.", archetype: "CONSTRUTOR" },
            { text: "Definir padrões de código e arquitetura para a equipe seguir.", archetype: "ARQUITETO" },
            { text: "Apresentar uma prova de conceito com uma tecnologia de ponta.", archetype: "INOVADOR" },
            { text: "Fazer uma apresentação do produto para stakeholders ou usuários.", archetype: "COMUNICADOR" },
            { text: "Criar um dashboard que revela um insight importante sobre o negócio.", archetype: "ANALISTA" },
        ],
    },
    {
        question: "Como você prefere aprender algo novo?",
        options: [
            { text: "Construindo um pequeno projeto prático do zero.", archetype: "CONSTRUTOR" },
            { text: "Lendo a documentação oficial e entendendo os princípios de design.", archetype: "ARQUITETO" },
            { text: "Assistindo a palestras sobre o futuro da tecnologia e tendências.", archetype: "INOVADOR" },
            { text: "Entrando em uma comunidade ou grupo de estudos para discutir com outros.", archetype: "COMUNICADOR" },
            { text: "Analisando estudos de caso e exemplos de implementação bem-sucedidos.", archetype: "ANALISTA" },
        ],
    },
    {
        question: "No final de um projeto, o que é mais importante para você?",
        options: [
            { text: "Um produto robusto e com código limpo.", archetype: "CONSTRUTOR" },
            { text: "Uma arquitetura que pode ser facilmente expandida no futuro.", archetype: "ARQUITETO" },
            { text: "Ter aprendido e aplicado algo que ninguém na equipe conhecia antes.", archetype: "INOVADOR" },
            { text: "O feedback positivo dos usuários e o bom relacionamento da equipe.", archetype: "COMUNICADOR" },
            { text: "Os resultados mensuráveis que o projeto trouxe para o negócio.", archetype: "ANALISTA" },
        ],
    },
];


function Discovery() {
    const { user, profile, loading: authLoading, reloadProfile } = useAuth();
    const [userData, setUserData] = useState(() => normalizeUserData({}));
    const [archetype, setArchetype] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Estado do Quiz
    const [quizStep, setQuizStep] = useState('start'); // 'start', 'questions', 'result'
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [archetypeKey, setArchetypeKey] = useState(null);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        let mounted = true;
        if (authLoading) return;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                if (user && user.uid) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        const normalized = normalizeUserData(data);
                        if (mounted) {
                            setUserData(normalized);
                            if (data.archetypeKey && archetypes[data.archetypeKey]) {
                                setArchetypeKey(data.archetypeKey);
                                setArchetype(archetypes[data.archetypeKey]);
                            } else {
                                generateArchetype(normalized); // Gera um inicial se não houver salvo
                            }
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
    }, [user, authLoading]);

    const generateArchetype = (data) => {
        // Lógica inicial, pode ser substituída pela do quiz
        if (profile?.archetypeKey && archetypes[profile.archetypeKey]) {
            setArchetype(archetypes[profile.archetypeKey]);
        } else {
            setArchetypeKey(null);
            setArchetype({
                name: 'Explorador',
                description: 'Você está no início de sua jornada. Complete o quiz para descobrir seu potencial!',
                badges: ['Curioso'],
                icon: Lightbulb
            });
        }
    };

    const handleAnswer = (archetypeKey) => {
        const newAnswers = [...answers, archetypeKey];
        setAnswers(newAnswers);
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            calculateResult(newAnswers);
            setQuizStep('result');
        }
    };

    const calculateResult = (finalAnswers) => {
        const counts = finalAnswers.reduce((acc, curr) => {
            acc[curr] = (acc[curr] || 0) + 1;
            return acc;
        }, {});

        const resultArchetypeKey = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        setArchetypeKey(resultArchetypeKey);
        setArchetype(archetypes[resultArchetypeKey]);
    };

    const resetQuiz = () => {
        setAnswers([]);
        setArchetypeKey(null);
        setCurrentQuestion(0);
        setQuizStep('start');
        generateArchetype(userData); // Volta ao arquétipo salvo ou inicial
    };

    const handleSaveArchetype = async () => {
        if (!user) return alert('Faça login para salvar seu arquétipo.');
        if (!archetypeKey) return alert('Complete o quiz para definir um arquétipo antes de salvar.');

        try {
            await updateDoc(doc(db, 'users', user.uid), { archetypeKey: archetypeKey });
            await reloadProfile();
            alert('Arquétipo Salvo com Sucesso');
        } catch (err) {
            console.error('Erro ao salvar arquétipo:', err);
            // O alerta de erro foi removido conforme solicitado, pois estava aparecendo mesmo com sucesso.
        }
    };

    const saveUserData = async () => {
        if (!user) return alert('Faça login para salvar.');
        try {
            await setDoc(doc(db, 'users', user.uid), {
                ...userData,
                email: user.email,
            }, { merge: true });
            alert('Perfil salvo com sucesso!');
            // A chamada a generateArchetype foi removida para não sobrescrever o resultado do quiz.
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
                        {archetype && <ArchetypeDisplay archetype={archetype} onSave={handleSaveArchetype} />}
                    </motion.div>

                    {/* Quiz ou Seção de Edição */}
                    <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all">
                        {quizStep === 'start' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                                <h3 className="text-2xl font-bold text-white mb-4">Descubra seu Arquétipo Profissional</h3>
                                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">Responda 5 perguntas rápidas para entendermos melhor seu perfil e como você pode gerar mais impacto.</p>
                                <button
                                    onClick={() => setQuizStep('questions')}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
                                >
                                    Começar o Quiz
                                </button>
                            </motion.div>
                        )}

                        {quizStep === 'questions' && (
                            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="mb-4">
                                    <p className="text-indigo-400 font-semibold">Pergunta {currentQuestion + 1} de {quizQuestions.length}</p>
                                    <h3 className="text-2xl font-bold text-white mt-1">{quizQuestions[currentQuestion].question}</h3>
                                </div>
                                <div className="space-y-3">
                                    {quizQuestions[currentQuestion].options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => handleAnswer(option.archetype)}
                                            className="w-full text-left p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-indigo-600 hover:border-indigo-500 transition-all"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {option.text}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {quizStep === 'result' && archetype && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                                <h3 className="text-2xl font-bold text-white mb-2">Quiz Finalizado!</h3>
                                <p className="text-gray-400 mb-6">Seu arquétipo foi atualizado com base nas suas respostas.</p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleSaveArchetype}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                                    >
                                        Salvar este Arquétipo
                                    </button>
                                    <button
                                        onClick={resetQuiz}
                                        className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Refazer Quiz
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Seção de Editar Perfil (opcional, pode ser mantida ou removida) */}
                    <motion.div
                        className="mt-8 bg-gray-950 border border-gray-800 rounded-xl p-6 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">✏️ Editar Perfil</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Habilidades Técnicas</label>
                                <input
                                    type="text"
                                    placeholder="React, Python, Firebase..."
                                    value={userData.habilidadesTecnicas.join(', ')}
                                    onChange={(e) => setUserData({ ...userData, habilidadesTecnicas: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Soft Skills</label>
                                <input
                                    type="text"
                                    placeholder="Liderança, Comunicação..."
                                    value={userData.softSkills.join(', ')}
                                    onChange={(e) => setUserData({ ...userData, softSkills: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Áreas de Interesse</label>
                                <input
                                    type="text"
                                    placeholder="Educação, Saúde, Tecnologia..."
                                    value={userData.areaInteresses.join(', ')}
                                    onChange={(e) => setUserData({ ...userData, areaInteresses: e.target.value.split(',').map(s => s.trim()) })}
                                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 mb-1 block">Experiências</label>
                                <textarea
                                    placeholder="Descreva suas experiências..."
                                    value={Array.isArray(userData.experiencias) ? userData.experiencias.join('; ') : userData.experiencias}
                                    onChange={(e) => setUserData({ ...userData, experiencias: e.target.value })}
                                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none min-h-24"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-400 mb-1 block">Resumo Pessoal</label>
                                <textarea
                                    placeholder="Conte-nos sobre você..."
                                    value={userData.resumo}
                                    onChange={(e) => setUserData({ ...userData, resumo: e.target.value })}
                                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none min-h-24"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={saveUserData}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                            >
                                💾 Salvar Perfil
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </SidebarLayout>
    );
}

export default Discovery;