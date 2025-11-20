import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { getAnalytics } from 'firebase/analytics'; // Adicionado conforme seu código

// configurações reais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDcDRDG_BJpLNUJN6bjFctJdk_qbAMI8NQ",
    authDomain: "synapse-app-ddf75.firebaseapp.com",
    projectId: "synapse-app-ddf75",
    storageBucket: "synapse-app-ddf75.firebasestorage.app",
    messagingSenderId: "550422330993",
    appId: "1:550422330993:web:45b7e25a34f9423b1fa5d0",
    measurementId: "G-RDVTSV1WZ0"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);