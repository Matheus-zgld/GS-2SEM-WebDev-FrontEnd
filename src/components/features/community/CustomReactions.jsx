import { useState } from 'react';
import { ThumbsUp, Lightbulb, Sparkles, HelpCircle } from 'lucide-react';

const CustomReactions = () => {
    const [selectedReaction, setSelectedReaction] = useState(null);

    const reactions = [
        { id: 'like', icon: <ThumbsUp size={18} />, label: 'Like' },
        { id: 'insightful', icon: <Lightbulb size={18} />, label: 'Esclarecedor' },
        { id: 'inspiring', icon: <Sparkles size={18} />, label: 'Inspirador' },
        { id: 'help', icon: <HelpCircle size={18} />, label: 'Precisa de Ajuda' },
    ];

    return (
        <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-full">
            {reactions.map(reaction => (
                <button
                    key={reaction.id}
                    onClick={() => setSelectedReaction(reaction.id)}
                    className={`p-2 rounded-full transition-colors ${
                        selectedReaction === reaction.id
                            ? 'bg-purple-600 text-white'
                            : 'hover:bg-gray-700 text-gray-400'
                    }`}
                    title={reaction.label}
                >
                    {reaction.icon}
                </button>
            ))}
        </div>
    );
};

export default CustomReactions;