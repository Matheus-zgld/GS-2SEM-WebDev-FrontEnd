import { Brain, Sparkles } from 'lucide-react';

function ArchetypeDisplay({ archetype }) {
    if (!archetype) return null;

    return (
        <div className="bg-gradient-to-br from-indigo-950 via-gray-900 to-purple-950 border border-indigo-700/50 rounded-xl p-8 relative overflow-hidden shadow-lg">
            {/* Efeito de fundo */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-5 -left-10 w-32 h-32 bg-purple-600/20 rounded-full filter blur-3xl"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-600/30 border border-indigo-500 rounded-lg">
                        <Brain className="w-7 h-7 text-indigo-300" />
                    </div>
                    <div>
                        <p className="text-xs text-indigo-300 font-semibold">Seu Arquétipo</p>
                        <h3 className="text-3xl font-bold text-white">
                            {archetype.name}
                        </h3>
                    </div>
                </div>

                <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                    {archetype.description}
                </p>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-indigo-700/30">
                    {(archetype.badges && archetype.badges.length > 0) ? (
                        archetype.badges.map(badge => (
                            <span
                                key={badge}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 bg-indigo-900/40 px-4 py-2 rounded-full border border-indigo-700/50 hover:bg-indigo-900/60 transition-colors"
                            >
                                <Sparkles className="w-4 h-4" />
                                {badge}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-400 italic">Nenhum badge ainda</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ArchetypeDisplay;