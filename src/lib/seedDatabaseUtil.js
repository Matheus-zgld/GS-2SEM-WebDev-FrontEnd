import { db } from './firebase.js';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';
import { seedUsers, seedPublications, seedChallenges } from './seedData.js';

export async function seedDatabase() {
    console.log('Iniciando seed do banco de dados...');
    try {
        // Adicionar usuários
        for (const user of seedUsers) {
            await setDoc(doc(db, 'users', user.id), {
                ...user,
                createdAt: new Date()
            }, { merge: true });
            console.log(`✓ Usuário criado: ${user.nome}`);
        }

        // Adicionar publicações
        for (const pub of seedPublications) {
            const pubId = `pub_${Date.now()}_${Math.random()}`;
            await setDoc(doc(db, 'publications', pubId), {
                ...pub,
                createdAt: new Date()
            });
            console.log(`✓ Publicação criada para ${pub.userId}`);
        }

        // Adicionar desafios
        for (const challenge of seedChallenges) {
            const chalId = `challenge_${Date.now()}_${Math.random()}`;
            await setDoc(doc(db, 'challenges', chalId), {
                ...challenge,
                createdAt: new Date()
            });
            console.log(`✓ Desafio criado: ${challenge.title}`);
        }

        console.log('✓ Seed concluído com sucesso!');
        return true;
    } catch (err) {
        console.error('Erro ao fazer seed:', err);
        return false;
    }
}

export async function checkDatabaseStatus() {
    try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const pubsSnap = await getDocs(collection(db, 'publications'));
        const chalSnap = await getDocs(collection(db, 'challenges'));
        
        return {
            users: usersSnap.size,
            publications: pubsSnap.size,
            challenges: chalSnap.size
        };
    } catch (err) {
        console.error('Erro ao verificar BD:', err);
        return null;
    }
}
