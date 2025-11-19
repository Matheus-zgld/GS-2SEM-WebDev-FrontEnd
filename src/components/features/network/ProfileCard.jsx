import { motion } from 'framer-motion';
import { BrainCircuit, Lightbulb, Users, Code, BarChartHorizontal } from 'lucide-react';

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
        <div className={`flex items-center justify-center gap-1 text-sm ${archetype.color}`}>
            <Icon className="w-4 h-4" />
            <span className="font-semibold">{archetype.name}</span>
        </div>
    );
};

function ProfileCard({ profile, onClick }) {
    if (!profile) return null;
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="transition-all duration-300">
            <img src={profile.foto || '/default-avatar.png'} alt={profile.nome || 'Perfil'} className="w-24 h-24 rounded-full mb-4 border-2 border-indigo-500 mx-auto" />
            <h4 className="font-bold text-white">{profile.nome || 'Nome não disponível'}</h4>
            <div className="text-gray-400 mt-1 flex justify-center">{profile.archetypeKey ? <ArchetypeBadge archetypeKey={profile.archetypeKey} /> : <p>{profile.cargo || 'Cargo não definido'}</p>}</div>
            <p className="text-sm text-gray-500">{profile.habilidadesTecnicas?.join(', ') || 'Habilidades não listadas'}</p>
            <div className="flex mt-2 flex-wrap gap-1">
                {profile.badges?.map(badge => (
                    <span key={badge} className="bg-yellow-400 text-black px-2 py-1 rounded text-xs">
                        {badge}
                    </span>
                )) || <span className="text-gray-500 text-xs">Sem badges</span>}
            </div>
        </motion.div>
    );
}

export default ProfileCard;