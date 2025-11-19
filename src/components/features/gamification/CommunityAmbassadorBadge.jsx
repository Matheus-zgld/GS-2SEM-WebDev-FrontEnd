import { ShieldCheck } from 'lucide-react';

const CommunityAmbassadorBadge = ({ level }) => {
    const badgeLevels = {
        1: { color: 'text-bronze', label: 'Bronze' },
        2: { color: 'text-silver', label: 'Prata' },
        3: { color: 'text-gold', label: 'Ouro' },
        4: { color: 'text-platinum', label: 'Platina' },
        5: { color: 'text-diamond', label: 'Diamante' },
    };

    const badge = badgeLevels[level] || { color: 'text-gray-500', label: 'Nível 0' };

    return (
        <div className={`bg-gray-800 p-4 rounded-lg flex items-center gap-4`}>
            <ShieldCheck className={`${badge.color} w-10 h-10`} />
            <div>
                <h4 className="font-bold text-lg">Embaixador Comunitário</h4>
                <p className={`font-bold text-xl ${badge.color}`}>{badge.label}</p>
            </div>
        </div>
    );
};

export default CommunityAmbassadorBadge;