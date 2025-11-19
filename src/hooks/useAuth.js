// Este arquivo agora é obsoleto; use o contexto AuthContext. Mas se quiser manter, atualize:
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
    return useAuthContext(); // Redireciona para o contexto para consistência.
}