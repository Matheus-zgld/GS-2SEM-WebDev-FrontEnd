import SidebarLayout from '../../components/layout/SideBarLayout';
import MicroProject from '../../components/features/community/MicroProject';
import StudyBuddyMatcher from '../../components/features/community/StudyBuddyMatcher';
import CustomReactions from '../../components/features/community/CustomReactions';
import { useState } from 'react';

function Community() {
    const [matchedBuddy, setMatchedBuddy] = useState(null);

    const microProjects = [
        {
            title: 'Refatorar um Componente React',
            community: 'React Developers',
            description: 'Escolha um componente em um de seus projetos e aplique os princípios de clean code.',
            deadline: '3 dias',
        },
        {
            title: 'Escrever um Artigo Técnico',
            community: 'Escritores Técnicos',
            description: 'Escreva um artigo de 500 palavras sobre uma tecnologia que você está aprendendo.',
            deadline: '5 dias',
        },
    ];

    const handleMatch = (buddy) => {
        setMatchedBuddy(buddy);
        alert(`Você foi pareado com ${buddy.name}!`);
    };

    return (
        <SidebarLayout>
            <div className="p-6 min-h-screen bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Comunidade</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Micro-Projetos da Semana</h2>
                                <div className="space-y-4">
                                    {microProjects.map((project, index) => (
                                        <MicroProject key={index} project={project} />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4">Reações Personalizadas</h2>
                                <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-4">
                                    <p className="text-gray-400">Use reações para dar um feedback mais significativo:</p>
                                    <CustomReactions />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <StudyBuddyMatcher onMatch={handleMatch} />
                            {matchedBuddy && (
                                <div className="bg-gray-800 p-4 rounded-lg text-center">
                                    <h4 className="font-bold text-lg text-white">Pareado com:</h4>
                                    <div className="flex items-center justify-center gap-3 mt-3">
                                        <img src={matchedBuddy.avatar} alt={matchedBuddy.name} className="w-10 h-10 rounded-full" />
                                        <p className="font-semibold">{matchedBuddy.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}

export default Community;