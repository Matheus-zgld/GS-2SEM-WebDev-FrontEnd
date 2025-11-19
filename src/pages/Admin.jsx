import { useState } from 'react';
import { seedDatabase, checkDatabaseStatus } from '../lib/seedDatabaseUtil.js';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

function Admin() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [result, setResult] = useState(null);

    const handleSeed = async () => {
        setLoading(true);
        setResult(null);
        try {
            const success = await seedDatabase();
            setResult({
                success,
                message: success ? '✓ Seed completado com sucesso!' : '✗ Erro ao fazer seed'
            });
            if (success) {
                setTimeout(() => checkStatus(), 1000);
            }
        } catch (err) {
            setResult({
                success: false,
                message: `Erro: ${err.message}`
            });
        } finally {
            setLoading(false);
        }
    };

    const checkStatus = async () => {
        try {
            const dbStatus = await checkDatabaseStatus();
            setStatus(dbStatus);
        } catch (err) {
            console.error('Erro ao verificar status:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 p-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">🔧 Admin - Seed Database</h1>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-6">
                    <p className="text-gray-300 text-lg">
                        Clique abaixo para popular o banco de dados com dados de exemplo:
                    </p>

                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={handleSeed}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            💾 Fazer Seed
                        </button>

                        <button
                            onClick={checkStatus}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                        >
                            📊 Verificar Status
                        </button>
                    </div>

                    {result && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                            {result.success ? (
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className={result.success ? 'text-green-300' : 'text-red-300'}>
                                    {result.message}
                                </p>
                            </div>
                        </div>
                    )}

                    {status && (
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-3">
                            <h3 className="text-xl font-bold text-white mb-4">Status do Database</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-900/50 p-4 rounded">
                                    <p className="text-gray-400 text-sm">Usuários</p>
                                    <p className="text-3xl font-bold text-indigo-400">{status.users}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded">
                                    <p className="text-gray-400 text-sm">Publicações</p>
                                    <p className="text-3xl font-bold text-purple-400">{status.publications}</p>
                                </div>
                                <div className="bg-gray-900/50 p-4 rounded">
                                    <p className="text-gray-400 text-sm">Desafios</p>
                                    <p className="text-3xl font-bold text-green-400">{status.challenges}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                        <p className="text-blue-300 text-sm">
                            <strong>ℹ️ Info:</strong> Esta página faz seed com 10 usuários, 10 publicações e 10 desafios.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
