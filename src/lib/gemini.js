import { GoogleGenerativeAI } from '@google/generative-ai';

// Tenta usar proxy /api/gemini em primeiro lugar (mais seguro — não expõe chave ao cliente)
async function callProxy(prompt) {
    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!res.ok) throw new Error('Proxy response not ok');
        const data = await res.json();
        return data.text;
    } catch (e) {
        console.warn('Proxy call failed, falling back to client SDK:', e.message);
        return null;
    }
}

// 1. Lê a chave de API de forma segura do ambiente (se existir no build)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateResponse(prompt) {
    // Prompt de sistema para IA socrática
    const chatPrompt = `\nVocê é um mentor socrático focado em descobrir o potencial humano.\nSeu objetivo não é dar respostas diretas, mas fazer perguntas inteligentes e curtas (máx 40 palavras) que levem o usuário a refletir.\nSeja breve, perspicaz e encorajador.\nUsuário: ${prompt}\nMentor Socrático:`;

    // 1) Tenta o proxy (servidor)
    const proxyResult = await callProxy(chatPrompt);
    if (proxyResult) return proxyResult;

    // 2) Fallback para SDK cliente (apenas se VITE_GEMINI_API_KEY existir — não recomendado para produção)
    if (!genAI) {
        console.error('Nenhuma configuração de Gemini disponível (proxy falhou e VITE_GEMINI_API_KEY ausente)');
        return 'Desculpe, não foi possível contactar a IA neste momento.';
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-09-2025' });
        const result = await model.generateContent(chatPrompt);
        return (result?.response && typeof result.response.text === 'function') ? result.response.text() : JSON.stringify(result);
    } catch (error) {
        console.error('Erro ao gerar resposta da IA (SDK fallback):', error);
        return 'Desculpe, não consegui processar o seu pedido neste momento.';
    }
}

export async function analyzeSentiment(text) {
    // Simulação de análise de sentimento para monitoramento de bem-estar
    // (Esta função permanece a mesma)
    const positiveWords = ['bom', 'ótimo', 'feliz'];
    const negativeWords = ['ruim', 'triste', 'cansado'];
    const score = positiveWords.filter(w => text.includes(w)).length - negativeWords.filter(w => text.includes(w)).length;
    return score > 0 ? 'Positivo' : score < 0 ? 'Negativo' : 'Neutro';
}