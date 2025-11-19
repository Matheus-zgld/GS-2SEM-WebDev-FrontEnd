import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function GlobalSearch() {
    const [q, setQ] = useState('');
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        if (!q.trim()) return;
        navigate(`/app/search?q=${encodeURIComponent(q.trim())}`);
    };

    return (
        <form onSubmit={onSubmit} className="flex items-center gap-2">
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por pessoas, desafios, habilidades..."
                className="px-3 py-1 rounded-md bg-gray-900 border border-gray-700 text-gray-200 w-[32rem] focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 p-2 rounded-md hover:bg-indigo-700 transition-colors">
                <Search className="w-4 h-4 text-white" />
            </button>
        </form>
    );
}
