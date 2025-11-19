import { Trophy, Users, Target, Calendar, Heart, MessageCircle, ShieldCheck, DollarSign, Clock } from 'lucide-react';

function ChallengeCard({ challenge, onApply }) {
    if (!challenge) return null;

    const title = challenge.title || challenge.titulo || 'Desafio Sem Título';
    const description = challenge.description || challenge.descricao || '';
    const ods = challenge.ods || [];
    const difficulty = challenge.dificuldade || 'Intermediário';
    const points = challenge.pontos || 100;
    const participants = challenge.participants || 0;
    const likes = challenge.likes || 0;
    const comments = challenge.comments || 0;
    const deadline = challenge.dataLimite || challenge.dateLimite;
    const inclusionGuaranteed = challenge.inclusionGuaranteed || false;
    const potentialSalary = challenge.potentialSalary || null;

    const getDifficultyColor = (diff) => {
        switch(diff.toLowerCase()) {
            case 'iniciante': return 'bg-green-900/40 text-green-300 border-green-700';
            case 'intermediário': return 'bg-yellow-900/40 text-yellow-300 border-yellow-700';
            case 'avançado': return 'bg-red-900/40 text-red-300 border-red-700';
            default: return 'bg-gray-700 text-gray-300';
        }
    };

    const odsColors = {
        'Educação de Qualidade': 'bg-blue-900/40 text-blue-300',
        'Inclusão Social': 'bg-purple-900/40 text-purple-300',
        'Sustentabilidade': 'bg-green-900/40 text-green-300',
        'Tecnologia': 'bg-indigo-900/40 text-indigo-300',
        'Energias Renováveis': 'bg-yellow-900/40 text-yellow-300',
        'Saúde e Bem-estar': 'bg-red-900/40 text-red-300',
        'Inovação': 'bg-pink-900/40 text-pink-300'
    };

    return (
        <div className="h-full bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700 rounded-xl p-6 hover:border-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/20 flex flex-col">
            <div className="mb-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="font-bold text-white text-lg leading-tight flex-1">{title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(difficulty)} whitespace-nowrap`}>
                        {difficulty}
                    </span>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>
            </div>

            {/* ODS Tags & Inclusion Guaranteed */}
            <div className="flex flex-wrap gap-2 mb-4">
                {inclusionGuaranteed && (
                    <span className="text-xs px-2 py-1 rounded-full font-semibold bg-teal-900/40 text-teal-300 flex items-center gap-1">
                        <ShieldCheck size={14} /> Inclusão Garantida
                    </span>
                )}
                {ods.slice(0, 2).map((od, idx) => (
                    <span key={idx} className={`text-xs px-2 py-1 rounded-full font-semibold ${odsColors[od] || 'bg-gray-700 text-gray-300'}`}>
                        {od}
                    </span>
                ))}
                {ods.length > 2 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300 font-semibold">
                        +{ods.length - 2}
                    </span>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4 pb-4 border-b border-gray-700">
                <div className="text-center">
                    <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">{points}pt</p>
                </div>
                <div className="text-center">
                    <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">{participants}</p>
                </div>
                <div className="text-center">
                    <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">{likes}</p>
                </div>
                <div className="text-center">
                    <MessageCircle className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">{comments}</p>
                </div>
            </div>

            {/* Deadline & Salary */}
            <div className="space-y-2 text-xs text-gray-400 mb-4">
                {deadline && (
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(deadline).toLocaleDateString('pt-BR')}</span>
                    </div>
                )}
                {potentialSalary && (
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Salário Potencial: {potentialSalary}</span>
                    </div>
                )}
            </div>

            {/* Apply Buttons */}
            <div className="mt-auto space-y-2">
                <button
                    onClick={() => onApply(challenge)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold flex items-center justify-center gap-2"
                >
                    <Target className="w-4 h-4" />
                    Aplicar Agora
                </button>
                <button
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all font-semibold flex items-center justify-center gap-2 text-xs"
                >
                    <Clock className="w-4 h-4" />
                    Eu me Candidataria (em 6 Meses)
                </button>
            </div>
        </div>
    );
}

export default ChallengeCard;
