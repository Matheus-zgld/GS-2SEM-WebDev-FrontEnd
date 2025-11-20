import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
    return useAuthContext(); // Redireciona para o contexto para consistência.
}