import { useState } from 'react';
import { Tag, Loader2 } from 'lucide-react';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../ui/Button';

function PublishChallengeForm({ onSuccess }) {
    const { user } = useAuth();
    const [form, setForm] = useState({ 
        titulo: '', 
        descricao: '', 
        ods: [], 
        dificuldade: 'Intermediário', 
        pontos: 100,
        inclusionGuaranteed: false,
        potentialSalary: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const odsOptions = [
        'Educação de Qualidade', 'Inclusão Social', 'Sustentabilidade', 'Tecnologia', 
        'Energias Renováveis', 'Saúde e Bem-estar', 'Inovação'
    ];
    const difficultyOptions = ['Iniciante', 'Intermediário', 'Avançado'];

    const handleOdsChange = (ods) => {
        setForm(prev => ({
            ...prev,
            ods: prev.ods.includes(ods) ? prev.ods.filter(o => o !== ods) : [...prev.ods, ods]
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.titulo.trim()) newErrors.titulo = 'Título obrigatório';
        if (!form.descricao.trim()) newErrors.descricao = 'Descrição obrigatória';
        if (form.ods.length === 0) newErrors.ods = 'Selecione pelo menos um ODS';
        if (!form.dificuldade) newErrors.dificuldade = 'Selecione a dificuldade';
        if (form.pontos <= 0) newErrors.pontos = 'Pontos devem ser positivos';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'challenges'), {
                ...form,
                createdAt: new Date(),
                ownerId: user?.uid || null,
                ownerEmail: user?.email || null,
                participants: 0,
                likes: 0,
                comments: 0,
            });
            alert('Desafio publicado com sucesso!');
            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Erro ao publicar: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-2">
            <h3 className="text-2xl font-bold mb-6 text-white text-center">📢 Publicar Novo Desafio</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-gray-400 text-sm font-bold mb-2 block">Título do Desafio</label>
                    <input
                        name="titulo"
                        placeholder="Ex: App de meditação para iniciantes"
                        value={form.titulo}
                        onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:border-indigo-500"
                    />
                    {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
                </div>
                <div>
                    <label className="text-gray-400 text-sm font-bold mb-2 block">Descrição</label>
                    <textarea
                        name="descricao"
                        placeholder="Detalhe o que precisa ser feito, objetivos e tecnologias sugeridas."
                        value={form.descricao}
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:border-indigo-500"
                        rows="4"
                    />
                    {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-400 text-sm font-bold mb-2 block">Dificuldade</label>
                        <select value={form.dificuldade} onChange={e => setForm({...form, dificuldade: e.target.value})} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200">
                            {difficultyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 text-sm font-bold mb-2 block">Pontos de Recompensa</label>
                        <input type="number" value={form.pontos} onChange={e => setForm({...form, pontos: parseInt(e.target.value)})} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200" />
                    </div>
                </div>
                <div>
                    <label className="text-gray-400 text-sm font-bold mb-2 block">Salário Potencial (opcional)</label>
                    <input
                        name="potentialSalary"
                        placeholder="Ex: R$ 5.000 - R$ 8.000"
                        value={form.potentialSalary}
                        onChange={(e) => setForm({ ...form, potentialSalary: e.target.value })}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="flex items-center gap-2 text-gray-300">
                        <input
                            type="checkbox"
                            checked={form.inclusionGuaranteed}
                            onChange={(e) => setForm({ ...form, inclusionGuaranteed: e.target.checked })}
                            className="accent-purple-600"
                        />
                        Inclusão Garantida
                    </label>
                </div>
                <div>
                    <label className="text-gray-400 text-sm font-bold mb-2 block">ODS Relacionados</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {odsOptions.map(ods => (
                            <label key={ods} className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${form.ods.includes(ods) ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-gray-700'}`}>
                                <input type="checkbox" checked={form.ods.includes(ods)} onChange={() => handleOdsChange(ods)} className="hidden" />
                                <span className="text-sm">{ods}</span>
                            </label>
                        ))}
                    </div>
                    {errors.ods && <p className="text-red-500 text-xs mt-1">{errors.ods}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publicar Desafio'}
                </Button>
            </form>
        </div>
    );
}

export default PublishChallengeForm;
