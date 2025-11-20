import { useState } from 'react';
import { Users, Zap } from 'lucide-react';

const StudyBuddyMatcher = ({ onMatch }) => {
    const [isMatching, setIsMatching] = useState(false);

    const handleMatch = () => {
        setIsMatching(true);
        setTimeout(() => {
            setIsMatching(false);
            onMatch({ name: 'Carlos', avatar: 'https://i.pravatar.cc/40?u=carlos' });
        }, 1500);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg text-center">
            <Users className="mx-auto text-purple-400 w-10 h-10 mb-3" />
            <h4 className="font-bold text-lg text-white">Encontrar Companheiro de Estudo</h4>
            <p className="text-sm text-gray-400 mt-1 mb-4">Conecte-se com outro usuário para uma sessão de estudo de 30 minutos.</p>
            <button
                onClick={handleMatch}
                disabled={isMatching}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
                {isMatching ? (
                    <>
                        <Zap className="w-4 h-4 animate-ping" />
                        Buscando...
                    </>
                ) : (
                    <>
                        <Zap className="w-4 h-4" />
                        Buscar Agora
                    </>
                )}
            </button>
        </div>
    );
};

export default StudyBuddyMatcher;