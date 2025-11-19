import { Leaf } from 'lucide-react';

const PositiveImpactHistory = ({ impacts }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold text-lg mb-4">Histórico de Impacto Positivo</h3>
            <ul className="space-y-3">
                {impacts.map((impact, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                        <Leaf className="w-5 h-5 text-green-500 mt-1" />
                        <p className="text-gray-300">{impact.description}</p>
                    </li>
                ))}
            </ul>
            {impacts.length === 0 && (
                <p className="text-gray-500 text-center">Nenhum impacto registrado ainda.</p>
            )}
        </div>
    );
};

export default PositiveImpactHistory;