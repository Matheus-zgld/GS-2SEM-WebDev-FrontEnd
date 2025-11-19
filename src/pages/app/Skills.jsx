import { useState, useEffect } from 'react';
import SidebarLayout from '../../components/layout/SideBarLayout';
import { SlidersHorizontal, BarChart2, Lightbulb, Settings, Search, Map, Mail, Calendar, Code, X, BrainCircuit, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Lista mestre de habilidades profissionais para sugestão
const masterSkillList = [
    // Frontend
    'React', 'Vue.js', 'Angular', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'SASS/SCSS', 'Tailwind CSS', 'Figma', 'Adobe XD', 'UX/UI Design',
    // Backend
    'Node.js', 'Python', 'Java', 'C#', 'Ruby on Rails', 'PHP', 'Go', 'Express.js', 'Django', 'Flask',
    // Banco de Dados
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Redis',
    // DevOps & Cloud
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins',
    // Data Science & ML
    'Machine Learning', 'Análise de Dados', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch',
    // Soft Skills
    'Comunicação', 'Liderança', 'Trabalho em Equipe', 'Resolução de Problemas', 'Pensamento Crítico', 'Criatividade', 'Gestão de Tempo', 'Inteligência Emocional'
];

const initialAiSkills = [
    { id: 1, name: 'Pesquisa Web', description: 'Busca informações em tempo real na internet.', category: 'Produtividade', enabled: true, usage: 45, icon: Search, preferences: { verbosity: 'detailed' } },
    { id: 2, name: 'Integração com Gmail', description: 'Lê e resume seus e-mails não lidos.', category: 'Produtividade', enabled: true, usage: 15, icon: Mail, preferences: { priority_inbox: 'primary' } },
    { id: 3, name: 'Agenda e Calendário', description: 'Cria e gerencia eventos na sua agenda.', category: 'Produtividade', enabled: true, usage: 20, icon: Calendar, preferences: { default_duration: 30 } },
    { id: 4, name: 'Mapas e Rotas', description: 'Fornece direções e informações de trânsito.', category: 'Viagem', enabled: false, usage: 0, icon: Map, preferences: { mode: 'driving' } },
    { id: 5, name: 'Análise de Código', description: 'Revisa e sugere melhorias em trechos de código.', category: 'Técnico', enabled: true, usage: 10, icon: Code, preferences: { language: 'javascript' } },
    { id: 6, name: 'Cotações Financeiras', description: 'Busca cotações de ações e criptomoedas.', category: 'Finanças', enabled: false, usage: 0, icon: BarChart2, preferences: { currency: 'BRL' } },
];

function Skills() {
    const { user, profile, reloadProfile, loading: authLoading } = useAuth();
    
    // Habilidades do Usuário
    const [userSkills, setUserSkills] = useState([]);
    const [skillSearch, setSkillSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingSkills, setIsLoadingSkills] = useState(true);

    useEffect(() => {
        const loadSkills = async () => {
            if (user) {
                setIsLoadingSkills(true);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().habilidadesTecnicas) {
                    setUserSkills(userDoc.data().habilidadesTecnicas);
                }
                setIsLoadingSkills(false);
            }
        }
        loadSkills();
    }, [user]);
    
    // Habilidades da IA
    const [aiSkills, setAiSkills] = useState(initialAiSkills);
    const [aiFilter, setAiFilter] = useState('Todos');
    const [selectedSkill, setSelectedSkill] = useState(null);

    const categories = ['Todos', 'Produtividade', 'Viagem', 'Técnico', 'Finanças'];

    const toggleSkill = (id) => {
        setAiSkills(aiSkills.map(skill => skill.id === id ? { ...skill, enabled: !skill.enabled } : skill));
    };

    const updateUserSkillsInDb = async (newSkills) => {
        if (!user) return;
        setIsSaving(true);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                habilidadesTecnicas: newSkills
            }, { merge: true }); // Usa set com merge para criar ou atualizar
            await reloadProfile(); // Força a atualização do perfil no contexto
        } catch (error) {
            console.error("Erro ao salvar ou recarregar skills:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddUserSkill = (skill) => {
        if (skill && !userSkills.includes(skill) && !isSaving) {
            const newSkills = [...userSkills, skill];
            setUserSkills(newSkills);
            updateUserSkillsInDb(newSkills);
        }
        setSkillSearch('');
    };

    const handleRemoveUserSkill = (skillToRemove) => {
        if (isSaving) return;
        const newSkills = userSkills.filter(skill => skill !== skillToRemove);
        setUserSkills(newSkills);
        updateUserSkillsInDb(newSkills);
    };

    const filteredSearchSkills = skillSearch
        ? masterSkillList.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase()) && !userSkills.includes(s))
        : [];
    const filteredAiSkills = aiFilter === 'Todos' ? aiSkills : aiSkills.filter(s => s.category === aiFilter);

    const SkillConfigModal = ({ skill, onClose }) => {
        if (!skill) return null;

        return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-3 mb-4">
                        <skill.icon className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-2xl font-bold text-white">Configurar: {skill.name}</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Preferências */}
                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Preferências</h4>
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <label className="text-sm text-gray-400">Verbosity</label>
                                <select className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded">
                                    <option value="detailed">Detalhado</option>
                                    <option value="concise">Conciso</option>
                                </select>
                            </div>
                        </div>

                        {/* Desativação Temporária */}
                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Desativação Temporária</h4>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-lg">Por 1 hora</button>
                                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-lg">Por 24 horas</button>
                                <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-sm py-2 rounded-lg">Até eu reativar</button>
                            </div>
                        </div>

                        {/* Restrição de Uso */}
                        <div>
                            <h4 className="font-semibold text-gray-300 mb-2">Restringir Uso</h4>
                            <div className="bg-gray-800 p-3 rounded-lg">
                                <label className="text-sm text-gray-400">Usar apenas para contextos de:</label>
                                <input type="text" placeholder="Ex: rotas, trânsito" className="w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Cancelar</button>
                        <button onClick={onClose} className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700">Salvar</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <SidebarLayout>
            <div className="p-6 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold mb-2 text-white">🛠️ Gerenciador de Skills</h2>
                        <p className="text-gray-400">Ative, desative e configure as ferramentas que a IA pode utilizar.</p>
                    </div>

                    <div className="space-y-12">
                        {/* Seção de Habilidades do Usuário */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold flex items-center gap-3"><BrainCircuit /> Minhas Habilidades</h3>
                                {isSaving && (
                                    <div className="flex items-center gap-2 text-sm text-indigo-400">
                                        <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-400 mb-4">Adicione as habilidades que você possui. Elas serão salvas automaticamente em seu perfil.</p>
                            
                            {/* Adicionar Skill */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    value={skillSearch}
                                    onChange={(e) => setSkillSearch(e.target.value)}
                                    placeholder="Buscar habilidade (ex: Python, Liderança...)"
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
                                />
                                {filteredSearchSkills.length > 0 && skillSearch && (
                                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto">
                                        {filteredSearchSkills.slice(0, 5).map(skill => (
                                            <div
                                                key={skill}
                                                onClick={() => handleAddUserSkill(skill)}
                                                className="p-3 hover:bg-indigo-600 cursor-pointer"
                                            >
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Lista de Skills Adicionadas */}
                            <div className="flex flex-wrap gap-3">
                                {isLoadingSkills ? <p className="text-gray-500">Carregando suas habilidades...</p> : userSkills.length > 0 ? userSkills.map(skill => (
                                    <span key={skill} className="flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-3 py-1.5 rounded-full text-sm font-semibold border border-indigo-500/30">
                                        {skill}
                                        <button onClick={() => handleRemoveUserSkill(skill)} className="text-indigo-300 hover:text-white">
                                            <X size={14} />
                                        </button>
                                    </span>
                                )) : <p className="text-gray-500">Nenhuma habilidade adicionada. Comece a digitar para adicionar.</p>}
                            </div>
                        </div>

                        {/* Seção de Habilidades da IA */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Coluna Principal: Lista de Skills da IA */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><SlidersHorizontal /> Habilidades da IA</h3>
                                    {/* Filtros */}
                                    <div className="flex gap-2 mb-4 border-b border-gray-700 pb-4 flex-wrap">
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setAiFilter(cat)}
                                                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${aiFilter === cat ? 'bg-indigo-600 text-white font-semibold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Lista */}
                                    <div className="space-y-3">
                                        {filteredAiSkills.map(skill => (
                                            <div key={skill.id} className="bg-gray-800/50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-800 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <skill.icon className={`w-6 h-6 ${skill.enabled ? 'text-indigo-400' : 'text-gray-500'}`} />
                                                    <div>
                                                        <p className={`font-semibold ${skill.enabled ? 'text-white' : 'text-gray-400'}`}>{skill.name}</p>
                                                        <p className="text-sm text-gray-500">{skill.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => setSelectedSkill(skill)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full">
                                                        <Settings size={18} />
                                                    </button>
                                                <button onClick={() => toggleSkill(skill.id)} className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors ${skill.enabled ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                                                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${skill.enabled ? 'translate-x-5' : ''}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Coluna Lateral: Dashboard e Sugestões */}
                            <div className="space-y-8">
                                {/* Monitoramento de Uso */}
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart2 /> Monitoramento de Uso da IA</h3>
                                    <p className="text-sm text-gray-400 mb-4">Habilidades da IA mais utilizadas no último mês.</p>
                                    <div className="space-y-4">
                                        {aiSkills.filter(s => s.usage > 0).sort((a, b) => b.usage - a.usage).map(skill => (
                                            <div key={skill.id}>
                                                <div className="flex justify-between items-center text-sm mb-1">
                                                    <span className="font-semibold text-gray-300">{skill.name}</span>
                                                    <span className="text-gray-400">{skill.usage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${skill.usage}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sugestão de Novas Skills */}
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Lightbulb /> Sugestão para Você</h3>
                                    <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 rounded-lg border border-indigo-700">
                                        <p className="text-gray-300 mb-3">Notei que você perguntou sobre cotações de criptomoedas. Deseja ativar a skill de Cotações Financeiras?</p>
                                        <div className="flex gap-3">
                                            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg font-semibold">Ativar Skill</button>
                                            <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg">Ignorar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SkillConfigModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
        </SidebarLayout>
    );
}

export default Skills;