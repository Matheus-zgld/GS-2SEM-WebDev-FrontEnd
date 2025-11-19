import { motion } from 'framer-motion';

function ProfileCard({ profile, onClick }) {
    if (!profile) return null;
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="transition-all duration-300">
            <img src={profile.foto || '/default-avatar.png'} alt={profile.nome || 'Perfil'} className="w-16 h-16 rounded-full mb-4 border border-gray-700" />
            <h4 className="font-bold text-white">{profile.nome || 'Nome não disponível'}</h4>
            <p className="text-gray-400">{profile.cargo || 'Cargo não definido'}</p>
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