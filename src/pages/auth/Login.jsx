import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
// Precisamos do 'db' e do 'getDoc' e 'doc' para verificar o Firestore
import { auth, db } from '../../lib/firebase.js'; // Adicionada a extensão .js
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, AlertCircle } from 'lucide-react'; // Ícones do Lucide
import logo from '../../assets/SYNAPSE_semtexto.png';

// --- Funções Auxiliares (fora do componente) ---

/**
 * Traduz códigos de erro do Firebase Auth para mensagens amigáveis.
 * @param {string} code - O código de erro do Firebase (ex: 'auth/wrong-password')
 * @returns {string} - A mensagem amigável para o usuário.
 */
const getFriendlyErrorMessage = (code) => {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/invalid-email':
            return 'Nenhum utilizador encontrado com este e-mail.';
        case 'auth/wrong-password':
            return 'Senha incorreta. Por favor, tente novamente.';
        case 'auth/invalid-credential':
            return 'Credenciais inválidas. Verifique o e-mail e a senha.';
        default:
            return 'Ocorreu um erro ao fazer login. Tente novamente.';
    }
};

// --- Componente Principal ---

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Manipulador para o envio do formulário de login.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Tenta fazer login no Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. VERIFICAÇÃO NO BANCO DE DADOS (Firestore)
            // Se o login no Auth foi bem-sucedido, verificamos o Firestore.
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // SUCESSO: Usuário existe no Auth E no Firestore
                navigate('/app/network');
            } else {
                // ERRO: Usuário existe no Auth, mas não no Firestore (conta órfã/incompleta)
                setError('A sua conta foi autenticada, mas não encontramos o seu perfil na base de dados. Por favor, contacte o suporte ou tente criar a conta novamente.');
                // Opcionalmente, pode deslogar o usuário aqui: await auth.signOut();
            }

        } catch (firebaseError) {
            // 3. ERRO: Falha no login do Auth (senha errada, usuário não existe no Auth)
            console.error("Erro no login:", firebaseError.code, firebaseError.message);
            setError(getFriendlyErrorMessage(firebaseError.code));
        } finally {
            setLoading(false);
        }
    };

    // Estilo de fundo (o mesmo do Landing/Signup)
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

                {/* Logo */}
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
                    Acesse sua conta
                </h1>

                {/* Mensagem de Erro (no lugar do alert) */}
                {error && (
                    <div className="w-full p-3 flex items-center gap-2 bg-red-900/50 text-red-300 border border-red-800 rounded-lg text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Formulário Estilizado */}
                <form onSubmit={handleLogin} className="space-y-4">

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
                            Senha
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

                    {/* Botão de Envio (com estado de loading) */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 px-5 py-3 text-sm font-semibold text-gray-900 bg-white rounded-lg shadow-lg shadow-white/5 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Acessando...' : 'Entrar'}
                    </button>

                </form>

                {/* Link para Cadastro */}
                <div className="text-sm text-center text-gray-500">
                    Não tem uma conta?{' '}
                    <Link
                        to="/auth/signup"
                        className="font-medium text-gray-300 hover:text-white transition-colors duration-200"
                    >
                        Crie uma agora
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;