import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    Users, Brain, Globe, Settings, Menu, X, LogOut,
    Home, MessageSquare, Calendar, SlidersHorizontal // Ícone para voltar à Landing e novo ícone para Comunidade
} from 'lucide-react';
import logo from '../../assets/SYNAPSE_semfundo_branco.png';
import GlobalSearch from '../ui/GlobalSearch';

function SidebarLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/app/network', label: 'Rede de Perfis', icon: Users },
        { path: '/app/discovery', label: 'Descoberta', icon: Brain },
        { path: '/app/marketplace', label: 'Mercado', icon: Globe },
        { path: '/app/community', label: 'Comunidade', icon: MessageSquare },
        { path: '/app/planner', label: 'Planner', icon: Calendar },
        { path: '/app/skills', label: 'Gerenciar Skills', icon: SlidersHorizontal },
        { path: '/app/workspace', label: 'Workspace', icon: Settings },
        { path: '/app/publisher', label: 'Minhas Publicações', icon: Globe },
    ];

    const handleLogout = async () => {
        if (window.confirm('Tem certeza que deseja sair?')) {
            await logout();
            navigate('/');
        }
    };

    return (
        <div className="bg-black text-gray-200 min-h-screen flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col h-screen`}>
                <div className="flex items-center gap-2 p-4 border-b border-gray-800">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-9 h-9"
                    />
                    <h2 className="text-xl font-bold text-white">SYNAPSE</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    {/* Menu Items */}
                    {menuItems.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${location.pathname === path
                                    ? 'bg-gray-900 text-white border border-gray-700'
                                    : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                                }`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>
                {/* Logout */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-red-900 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                    {user && (
                        <p className="text-xs text-gray-500 mt-2 truncate" title={user.email}>Logado como: {user.email}</p>
                    )}
                </div>
            </aside>

            {/* Overlay para Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64">
                {/* Header Mobile */}
                <header className="md:hidden flex items-center justify-between p-4 bg-gray-950 border-b border-gray-800">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-400 hover:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                    <GlobalSearch />
                </header>

                {/* Top bar (desktop) with search */}
                <div className="hidden md:flex items-center justify-end p-4 bg-gray-950 border-b border-gray-800">
                    <div>
                        <GlobalSearch />
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
}

export default SidebarLayout;