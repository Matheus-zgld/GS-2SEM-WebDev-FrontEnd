import { useState } from 'react';
import { Calendar, CheckCircle, Zap } from 'lucide-react';

const MicroProject = ({ project }) => {
    const [completed, setCompleted] = useState(false);

    const handleComplete = () => {
        setCompleted(true);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-md text-white">{project.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{project.community}</p>
                </div>
                <span className="text-xs font-semibold bg-purple-600/20 text-purple-300 px-2 py-1 rounded">7 Dias</span>
            </div>
            <p className="text-sm text-gray-300 mt-3">{project.description}</p>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} />
                    <span>Encerra em: {project.deadline}</span>
                </div>
                <button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                        completed
                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                >
                    {completed ? <CheckCircle size={14} /> : <Zap size={14} />}
                    {completed ? 'Concluído!' : 'Marcar como Concluído'}
                </button>
            </div>
        </div>
    );
};

export default MicroProject;