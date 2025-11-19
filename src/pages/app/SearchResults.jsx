import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SidebarLayout from '../../components/layout/SideBarLayout';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResults() {
    const q = useQuery().get('q') || '';
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [odsOptions, setOdsOptions] = useState([]);
    const [selectedOds, setSelectedOds] = useState([]);
    const [skillFilter, setSkillFilter] = useState('');
    const [usersPage, setUsersPage] = useState(1);
    const [usersPageSize, setUsersPageSize] = useState(6);
    const [challengesPage, setChallengesPage] = useState(1);
    const [challengesPageSize, setChallengesPageSize] = useState(6);
    const [odsCounts, setOdsCounts] = useState({});

    useEffect(() => {
        const doSearch = async () => {
            setLoading(true);
            try {
                const usersSnap = await getDocs(collection(db, 'users'));
                const challengesSnap = await getDocs(collection(db, 'challenges'));
                const qLower = q.toLowerCase();

                let usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                let challengesData = challengesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                // build ODS options & counts
                const allOds = {};
                challengesData.forEach(c => (c.ods || []).forEach(o => { allOds[o] = (allOds[o] || 0) + 1; }));
                setOdsOptions(Object.keys(allOds));
                setOdsCounts(allOds);

                // basic text filter
                if (qLower) {
                    usersData = usersData.filter(u => (u.nome || '').toLowerCase().includes(qLower) || (u.areaInteresses || []).join(' ').toLowerCase().includes(qLower));
                    challengesData = challengesData.filter(c => (c.title || '').toLowerCase().includes(qLower) || (c.description || '').toLowerCase().includes(qLower));
                }

                // skill filter for users
                if (skillFilter.trim()) {
                    const sf = skillFilter.toLowerCase();
                    usersData = usersData.filter(u => (u.habilidadesTecnicas || []).join(' ').toLowerCase().includes(sf));
                }

                // ods filter for challenges
                if (selectedOds.length > 0) {
                    challengesData = challengesData.filter(c => (c.ods || []).some(o => selectedOds.includes(o)));
                }

                setUsers(usersData);
                setChallenges(challengesData);
                // reset paging when search/filter changes
                setUsersPage(1);
                setChallengesPage(1);
            } catch (err) {
                console.error('Erro na busca:', err);
            } finally {
                setLoading(false);
            }
        };
        doSearch();
    }, [q, selectedOds, skillFilter]);

    return (
        <SidebarLayout>
            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Resultados da busca: "{q}"</h2>
                {loading ? <p className="text-gray-400">Buscando...</p> : (
                    <div className="grid md:grid-cols-3 gap-6">
                        <aside className="col-span-1">
                            <div className="bg-gray-950 border border-gray-800 rounded p-4 mb-4">
                                <h4 className="text-white font-semibold mb-2">Filtros</h4>
                                <div className="mb-3">
                                    <label className="text-sm text-gray-300">Skill</label>
                                    <input value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} placeholder="Filtrar por skill" className="w-full p-2 mt-1 bg-gray-900 border border-gray-700 rounded text-gray-200" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-300">ODS</label>
                                    <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
                                        {odsOptions.length === 0 ? <div className="text-gray-500 text-sm">Nenhum ODS disponível</div> : odsOptions.map(o => (
                                            <label key={o} className="flex items-center gap-2 text-sm text-gray-300">
                                                <input type="checkbox" checked={selectedOds.includes(o)} onChange={() => setSelectedOds(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o])} className="accent-indigo-500" />
                                                <span>{o}</span>
                                                <span className="text-xs text-gray-500">({odsCounts[o] || 0})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>
                        <div className="col-span-2 grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg text-white mb-2">Pessoas</h3>
                                {users.length === 0 ? <p className="text-gray-500">Nenhum perfil encontrado.</p> : (
                                    <>
                                        {users.slice((usersPage-1)*usersPageSize, usersPage*usersPageSize).map(u => (
                                            <div key={u.id} className="bg-gray-950 border border-gray-800 rounded p-3 mb-2">
                                                <h4 className="font-semibold text-white">{u.nome}</h4>
                                                <p className="text-sm text-gray-400">{u.areaInteresses?.join(', ')}</p>
                                                <p className="text-sm text-gray-400">Skills: {(u.habilidadesTecnicas || []).join(', ')}</p>
                                            </div>
                                        ))}

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-sm text-gray-400">Total: {users.length}</div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm text-gray-300">Por página</label>
                                                <select value={usersPageSize} onChange={(e) => { setUsersPageSize(Number(e.target.value)); setUsersPage(1); }} className="bg-gray-900 border border-gray-700 text-gray-200 p-1 rounded">
                                                    <option value={4}>4</option>
                                                    <option value={6}>6</option>
                                                    <option value={12}>12</option>
                                                </select>
                                                <button onClick={() => setUsersPage(p => Math.max(1, p-1))} className="bg-gray-800 text-white px-2 py-1 rounded">‹</button>
                                                <div className="text-sm text-gray-300">{usersPage}</div>
                                                <button onClick={() => setUsersPage(p => p+1)} className="bg-gray-800 text-white px-2 py-1 rounded">›</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg text-white mb-2">Desafios</h3>
                                {challenges.length === 0 ? <p className="text-gray-500">Nenhum desafio encontrado.</p> : (
                                    <>
                                        {challenges.slice((challengesPage-1)*challengesPageSize, challengesPage*challengesPageSize).map(c => (
                                            <div key={c.id} className="bg-gray-950 border border-gray-800 rounded p-3 mb-2">
                                                <h4 className="font-semibold text-white">{c.title}</h4>
                                                <p className="text-sm text-gray-400">{c.description}</p>
                                                <p className="text-xs text-gray-500">ODS: {(c.ods || []).join(', ')}</p>
                                                <Link to="/app/marketplace" className="text-indigo-400 text-sm">Ver no mercado</Link>
                                            </div>
                                        ))}

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-sm text-gray-400">Total: {challenges.length}</div>
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm text-gray-300">Por página</label>
                                                <select value={challengesPageSize} onChange={(e) => { setChallengesPageSize(Number(e.target.value)); setChallengesPage(1); }} className="bg-gray-900 border border-gray-700 text-gray-200 p-1 rounded">
                                                    <option value={4}>4</option>
                                                    <option value={6}>6</option>
                                                    <option value={12}>12</option>
                                                </select>
                                                <button onClick={() => setChallengesPage(p => Math.max(1, p-1))} className="bg-gray-800 text-white px-2 py-1 rounded">‹</button>
                                                <div className="text-sm text-gray-300">{challengesPage}</div>
                                                <button onClick={() => setChallengesPage(p => p+1)} className="bg-gray-800 text-white px-2 py-1 rounded">›</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}

export default SearchResults;
