import { useEffect, useState } from 'react';
import SidebarLayout from '../../components/layout/SideBarLayout';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import ApplicationModal from '../../components/features/marketplace/ApplicationModal';

function PublisherApplications() {
    const { user, loading } = useAuth();
    const [challenges, setChallenges] = useState([]);
    const [applicationsByChallenge, setApplicationsByChallenge] = useState({});
    const [loadingState, setLoadingState] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const [selectedApp, setSelectedApp] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            if (!user) return setLoadingState(false);
            setLoadingState(true);
            try {
                const q = query(collection(db, 'challenges'), where('ownerId', '==', user.uid));
                const snap = await getDocs(q);
                const chs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setChallenges(chs);

                const appsSnap = await getDocs(collection(db, 'applications'));
                const allApps = appsSnap.docs.map(a => ({ id: a.id, ...a.data() }));
                const map = {};
                for (const c of chs) {
                    map[c.id] = allApps.filter(a => a.challengeId === c.id);
                }
                setApplicationsByChallenge(map);
            } catch (err) {
                console.error('Erro ao buscar painel do publisher:', err);
            } finally {
                setLoadingState(false);
            }
        };
        if (!loading) fetch();
    }, [user, loading]);

    const updateStatus = async (appId, status) => {
        try {
            await updateDoc(doc(db, 'applications', appId), { status, updatedAt: new Date() });
            const map = { ...applicationsByChallenge };
            for (const key of Object.keys(map)) {
                map[key] = map[key].map(a => a.id === appId ? { ...a, status } : a);
            }
            setApplicationsByChallenge(map);
            alert('Status atualizado.');
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            alert('Erro ao atualizar status. Veja console.');
        }
    };

    const openApplication = (app) => {
        setSelectedApp(app);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedApp(null);
    };

    const exportCsv = () => {
        const rows = [];
        for (const chId of Object.keys(applicationsByChallenge)) {
            for (const a of applicationsByChallenge[chId]) {
                rows.push({ challenge: a.challengeTitle, user: a.userEmail || a.profileSnapshot?.email || '', status: a.status || '', appliedAt: a.appliedAt ? (a.appliedAt.toDate ? a.appliedAt.toDate().toISOString() : new Date(a.appliedAt).toISOString()) : '' });
            }
        }
        if (rows.length === 0) return alert('Nenhuma candidatura para exportar.');
        const header = Object.keys(rows[0]).join(',');
        const csv = [header, ...rows.map(r => Object.values(r).map(v => '"' + (String(v || '')).replace(/"/g,'""') + '"').join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'applications_export.csv'; a.click(); URL.revokeObjectURL(url);
    };

    return (
        <SidebarLayout>
            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Painel de Publicações</h2>
                {loadingState ? <p className="text-gray-400">Carregando...</p> : (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-900 border border-gray-700 text-gray-200 p-2 rounded">
                                    <option value="all">Todos os Status</option>
                                    <option value="applied">Applied</option>
                                    <option value="reviewing">Reviewing</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por email" className="bg-gray-900 border border-gray-700 text-gray-200 p-2 rounded" />
                                <button onClick={exportCsv} className="bg-indigo-600 text-white px-3 py-2 rounded">Exportar CSV</button>
                            </div>
                        </div>

                        {challenges.length === 0 ? <p className="text-gray-500">Nenhuma publicação encontrada.</p> : (
                            challenges.map(c => {
                                const apps = (applicationsByChallenge[c.id] || []).filter(a => (statusFilter === 'all' || (a.status || 'applied') === statusFilter) && ((searchTerm.trim() === '') || (a.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase())));
                                return (
                                    <div key={c.id} className="bg-gray-950 border border-gray-800 rounded p-4 mb-4">
                                        <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                                        <p className="text-sm text-gray-400 mb-2">{c.description}</p>
                                        <div className="space-y-2">
                                            {apps.length === 0 ? <p className="text-gray-500">Nenhuma candidatura até agora.</p> : (
                                                apps.slice((page-1)*pageSize, page*pageSize).map(app => (
                                                    <div key={app.id} className="bg-gray-900 border border-gray-800 rounded p-3 mb-2">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-semibold text-white">{app.userEmail || app.profileSnapshot?.email || 'Usuário'}</h4>
                                                                <p className="text-sm text-gray-400">Mensagem: {app.message || '—'}</p>
                                                                <p className="text-sm text-gray-400">Status: {app.status || 'applied'}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button onClick={() => openApplication(app)} className="bg-blue-600 text-white px-3 py-1 rounded">Abrir</button>
                                                                <button onClick={() => updateStatus(app.id, 'accepted')} className="bg-green-600 text-white px-3 py-1 rounded">Aceitar</button>
                                                                <button onClick={() => updateStatus(app.id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded">Recusar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-400">Página {page}</div>
                            <div className="flex gap-2">
                                <button onClick={() => setPage(p => Math.max(1, p-1))} className="bg-gray-800 text-white px-3 py-1 rounded">Anterior</button>
                                <button onClick={() => setPage(p => p+1)} className="bg-gray-800 text-white px-3 py-1 rounded">Próxima</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}

export default PublisherApplications;
