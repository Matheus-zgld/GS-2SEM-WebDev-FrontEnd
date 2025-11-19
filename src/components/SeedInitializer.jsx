import { useEffect, useState } from 'react';
import { seedDatabase } from '../lib/seedDatabaseUtil';

function SeedInitializer() {
    const [checked, setChecked] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const checkAndSeed = async () => {
            if (checked) return;
            
            try {
                const seedFlag = localStorage.getItem('synapse_seed_completed');
                if (!seedFlag) {
                    console.log('🌱 Iniciando seed do banco de dados...');
                    setNotification({ type: 'info', message: 'Populando banco de dados...' });
                    
                    const success = await seedDatabase();
                    if (success) {
                        localStorage.setItem('synapse_seed_completed', 'true');
                        console.log('✅ Seed concluído com sucesso!');
                        setNotification({ type: 'success', message: '✅ Banco de dados populado com sucesso!' });
                        setTimeout(() => setNotification(null), 3000);
                    } else {
                        setNotification({ type: 'error', message: '❌ Erro ao popular banco de dados' });
                        setTimeout(() => setNotification(null), 3000);
                    }
                }
            } catch (err) {
                console.error('❌ Erro ao fazer seed:', err);
                setNotification({ type: 'error', message: '❌ Erro ao popular banco de dados' });
                setTimeout(() => setNotification(null), 3000);
            } finally {
                setChecked(true);
            }
        };

        checkAndSeed();
    }, []);

    if (!notification) return null;

    return (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white text-sm font-semibold z-50 transition-all ${
            notification.type === 'success' ? 'bg-green-600' :
            notification.type === 'error' ? 'bg-red-600' :
            'bg-blue-600'
        }`}>
            {notification.message}
        </div>
    );
}

export default SeedInitializer;
