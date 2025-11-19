import { useState } from 'react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function ApplicationModal({ isOpen, onClose, application, onStatusChange }) {
    const [comment, setComment] = useState('');
    if (!application) return null;

    const handleChangeStatus = async (status) => {
        try {
            await updateDoc(doc(db, 'applications', application.id), { status, updatedAt: new Date() });
            if (onStatusChange) onStatusChange(application.id, status);
        } catch (err) { console.error('Erro ao atualizar status:', err); alert('Erro ao atualizar status'); }
    };

    const handleSendComment = async () => {
        if (!comment.trim()) return;
        try {
            await updateDoc(doc(db, 'applications', application.id), { comments: arrayUnion({ text: comment.trim(), at: new Date(), from: 'publisher' }) });
            setComment('');
            alert('Comentário adicionado.');
            if (onStatusChange) onStatusChange(application.id); // trigger refresh
        } catch (err) { console.error('Erro ao enviar comentário:', err); alert('Erro ao enviar comentário'); }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-gray-950 text-gray-200 p-6 rounded-xl max-w-2xl w-full">
                <h3 className="text-xl font-bold mb-2">Candidatura: {application.challengeTitle}</h3>
                <p className="text-sm text-gray-400 mb-4">Enviado por: {application.userEmail || application.profileSnapshot?.email || 'Usuário anônimo'}</p>

                <div className="mb-4">
                    <h4 className="font-semibold">Perfil (snapshot)</h4>
                    <div className="text-sm text-gray-300 mt-2 space-y-1">
                        <div><strong>Nome:</strong> {application.profileSnapshot?.nome || '—'}</div>
                        <div><strong>Resumo:</strong> {application.profileSnapshot?.resumo || '—'}</div>
                        <div><strong>Skills:</strong> {(application.profileSnapshot?.habilidadesTecnicas || []).join(', ')}</div>
                        <div><strong>Soft Skills:</strong> {(application.profileSnapshot?.softSkills || []).join(', ')}</div>
                    </div>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold">Mensagem do candidato</h4>
                    <p className="text-sm text-gray-300 mt-2">{application.message || '—'}</p>
                </div>

                <div className="mb-4">
                    <h4 className="font-semibold">Comentários</h4>
                    <div className="max-h-32 overflow-y-auto mt-2 space-y-2">
                        {(application.comments || []).map((c, i) => (
                            <div key={i} className="text-sm text-gray-300 bg-gray-900 p-2 rounded">{c.text} <span className="text-xs text-gray-500">({new Date(c.at?.toDate ? c.at.toDate() : c.at).toLocaleString()})</span></div>
                        ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                        <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Adicionar comentário" className="flex-1 p-2 bg-gray-900 border border-gray-700 rounded text-gray-200" />
                        <Button onClick={handleSendComment} className="bg-indigo-600">Enviar</Button>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleChangeStatus('accepted')} className="bg-green-600">Aceitar</Button>
                    <Button onClick={() => handleChangeStatus('rejected')} className="bg-red-600">Recusar</Button>
                    <Button onClick={() => handleChangeStatus('reviewing')} className="bg-yellow-600">Marcar como Em Revisão</Button>
                    <Button onClick={onClose} variant="secondary" className="ml-auto">Fechar</Button>
                </div>
            </div>
        </Modal>
    );
}
