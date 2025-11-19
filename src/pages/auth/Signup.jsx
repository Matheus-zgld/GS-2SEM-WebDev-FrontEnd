import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase.js'; 
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, AlertCircle } from 'lucide-react';
import logo from '../../assets/SYNAPSE_semtexto.png';

// --- Funções Auxiliares (fora do componente) ---

/**
 * Traduz códigos de erro do Firebase para mensagens amigáveis.
 * @param {string} code - O código de erro do Firebase (ex: 'auth/email-already-in-use')
 * @returns {string} - A mensagem amigável para o usuário.
 */
const getFriendlyErrorMessage = (code) => {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso por outra conta.';
        case 'auth/invalid-email':
            return 'O formato do e-mail é inválido.';
        case 'auth/weak-password':
            return 'A senha é muito fraca. Use pelo menos 6 caracteres.';
        default:
            return 'Ocorreu um erro ao criar a conta. Tente novamente.';
    }
};

// --- Componente Principal ---

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Novo estado
    const [error, setError] = useState(''); // Para erros
    const [loading, setLoading] = useState(false); // Para estado de carregamento
    const navigate = useNavigate();

    /**
     * Manipulador para o envio do formulário de cadastro.
     */
    const handleSignup = async (e) => {
        e.preventDefault();
        setError(''); // Limpa erros anteriores
        
        // 1. Validação de senha
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true); // Ativa o estado de carregamento

        // 2. Tenta criar o usuário no Firebase Auth
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // 3. Cria o documento do usuário no Firestore
            // Usamos 'users' como coleção (o mesmo do seu código original)
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: email,
                pontosGamificacao: 0,
                createdAt: new Date() // Adiciona um carimbo de data
            });
            
            // 4. Redireciona para a plataforma
            navigate('/app/network'); // Ou para onde o usuário deve ir após o cadastro

        } catch (firebaseError) {
            // 5. Trata erros do Firebase
            console.error("Erro no cadastro:", firebaseError.code, firebaseError.message);
            setError(getFriendlyErrorMessage(firebaseError.code));
        } finally {
            setLoading(false); // Desativa o carregamento
        }
    };

    // Estilo de fundo (o mesmo do Landing.jsx)
    const backgroundStyle = {
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 255, 255, 0.02), transparent),
          linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)
        `,
        backgroundSize: 'auto, 70px 70px, 70px 70px',
        backgroundAttachment: 'fixed'
    };

    return (
        <div 
            className="flex items-center justify-center min-h-screen bg-black text-gray-200 font-sans p-4"
            style={backgroundStyle}
        >
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-950 border border-gray-800 rounded-xl shadow-2xl">
                
                {/* 1. Espaço do Logo */}
                <div className="flex justify-center mb-4">
                    <Link to="/" className="flex items-center gap-2" aria-label="Voltar para a Home">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-9 h-9"
                        />
                        <span className="text-2xl font-bold text-white">SYNAPSE</span>
                    </Link>
                </div>
                
                <h1 className="text-2xl font-bold text-center text-white">
                    Crie sua conta
                </h1>
                
                {/* 2. Mensagem de Erro (no lugar do alert) */}
                {error && (
                    <div className="w-full p-3 flex items-center gap-2 bg-red-900/50 text-red-300 border border-red-800 rounded-lg text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                
                {/* 3. Formulário Estilizado */}
                <form onSubmit={handleSignup} className="space-y-4">
                    
                    {/* Input de Email */}
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-400 mb-1"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="w-5 h-5 text-gray-500" />
                            </span>
                            <input 
                                id="email"
                                type="email" 
                                placeholder="seu@email.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Input de Senha */}
                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-400 mb-1"
                        >
                            Senha (mín. 6 caracteres)
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="w-5 h-5 text-gray-500" />
                            </span>
                            <input 
                                id="password"
                                type="password" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* 4. Input de Confirmar Senha */}
                    <div>
                        <label 
                            htmlFor="confirm-password" 
                            className="block text-sm font-medium text-gray-400 mb-1"
                        >
                            Confirmar Senha
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="w-5 h-5 text-gray-500" />
                            </span>
                            <input 
                                id="confirm-password"
                                type="password" 
                                placeholder="••••••••" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* 5. Botão de Envio (com estado de loading) */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full mt-2 px-5 py-3 text-sm font-semibold text-gray-900 bg-white rounded-lg shadow-lg shadow-white/5 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Criando conta...' : 'Criar conta'}
                    </button>

                </form>

                {/* 6. Link para Login */}
                <div className="text-sm text-center text-gray-500">
                    Já tem uma conta?{' '}
                    <Link 
                        to="/auth/login" 
                        className="font-medium text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Fazer Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;