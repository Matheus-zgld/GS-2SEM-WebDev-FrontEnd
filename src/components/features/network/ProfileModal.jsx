import { useState } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { useNavigate } from 'react-router-dom';

function ProfileModal({ profile, isOpen, onClose }) {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    // Verificação defensiva: Se profile for null, não renderiza nada
    if (!profile) return null;
    
    const handleRecommend = () => alert('Recomendado!');
    const handleSendMessage = () => alert(`Mensagem enviada: ${message}`);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-gray-950 text-gray-200 p-6 rounded-xl max-w-lg w-full">
                <h3 className="text-xl font-bold mb-4">{profile.nome || 'Nome não disponível'}</h3>
                <p className="mb-2"><strong>Resumo:</strong> {profile.resumo || 'Resumo não disponível'}</p>
                <p className="mb-2"><strong>Localização:</strong> {profile.localizacao || 'Localização não definida'}</p>
                <p className="mb-2"><strong>Área:</strong> {profile.area || 'Área não definida'}</p>
                <p className="mb-2"><strong>Hard Skills:</strong> {profile.habilidadesTecnicas?.join(', ') || 'Nenhuma habilidade listada'}</p>
                <p className="mb-2"><strong>Soft Skills:</strong> {profile.softSkills?.join(', ') || 'Nenhuma habilidade listada'}</p>
                <p className="mb-2"><strong>Experiências:</strong> {profile.experiencias?.map(e => `${e.empresa || 'Empresa'} - ${e.cargo || 'Cargo'}`).join('; ') || 'Nenhuma experiência listada'}</p>
                <p className="mb-2"><strong>Formação:</strong> {profile.formacao?.map(f => `${f.curso || 'Curso'} - ${f.instituicao || 'Instituição'}`).join('; ') || 'Nenhuma formação listada'}</p>
                <p className="mb-2"><strong>Projetos:</strong> {profile.projetos?.map(p => `${p.titulo || 'Título'} - ${p.link || 'Link não disponível'}`).join('; ') || 'Nenhum projeto listado'}</p>
                <p className="mb-2"><strong>Certificações:</strong> {profile.certificacoes?.join(', ') || 'Nenhuma certificação listada'}</p>
                <p className="mb-2"><strong>Idiomas:</strong> {profile.idiomas?.map(i => `${i.idioma || 'Idioma'} (${i.nivel || 'Nível não definido'})`).join(', ') || 'Nenhum idioma listado'}</p>
                <p className="mb-2"><strong>Interesses:</strong> {profile.areaInteresses?.join(', ') || 'Nenhum interesse listado'}</p>
                <p className="mb-2"><strong>Pontos Gamificação:</strong> {profile.pontosGamificacao || 0}</p>
                <textarea 
                    placeholder="Digite sua mensagem..." 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    className="w-full p-2 border border-gray-700 rounded mt-4 bg-gray-900 text-gray-200" 
                />
                <div className="mt-4 flex gap-2">
                    <Button onClick={handleRecommend} className="bg-blue-600 hover:bg-blue-700">Recomendar</Button>
                    <Button onClick={handleSendMessage} variant="secondary" className="bg-gray-700 hover:bg-gray-600">Enviar Mensagem</Button>
                    <Button onClick={() => navigate('/app/applications')} className="bg-indigo-600 hover:bg-indigo-700">Ver Minhas Candidaturas</Button>
                </div>
            </div>
        </Modal>
    );
}

export default ProfileModal;
