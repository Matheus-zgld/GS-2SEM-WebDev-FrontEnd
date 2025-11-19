import { useEffect, useState } from 'react';
import SidebarLayout from '../../components/layout/SideBarLayout';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Applications() {
    const { user, loading } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!user) return setLoadingApps(false);
            setLoadingApps(true);
            try {
                const q = query(collection(db, 'applications'), where('userId', '==', user.uid));
                const snap = await getDocs(q);
                const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setApplications(data);
            } catch (err) {
                console.error('Erro ao buscar candidaturas:', err);
            } finally {
                setLoadingApps(false);
            }
        };
        if (!loading) fetchApplications();
    }, [user, loading]);

    return (
        <SidebarLayout>
            <div className="p-6 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Minhas Candidaturas</h2>
                {loadingApps ? (
                    <p className="text-gray-400">Carregando candidaturas...</p>
                ) : (
                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="bg-gray-950 border border-gray-800 rounded p-4 text-gray-400">Nenhuma candidatura encontrada.</div>
                        ) : (
                            applications.map(app => (
                                <div key={app.id} className="bg-gray-950 border border-gray-800 rounded p-4">
                                    <h4 className="font-semibold text-white">{app.challengeTitle}</h4>
                                    <p className="text-sm text-gray-400">Status: {app.status}</p>
                                    <p className="text-sm text-gray-400">Enviado em: {app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleString() : (new Date(app.appliedAt).toLocaleString())}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}

export default Applications;
