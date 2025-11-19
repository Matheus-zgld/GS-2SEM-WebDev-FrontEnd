export function matchArchetypes(profiles, challenge) {
    // Algoritmo ético: Filtra perfis cujos interesses incluem ODS do desafio, sem vieses.
    return profiles.filter(p => p.areaInteresses.some(i => challenge.ods.some(ods => ods.includes(i))));
}

export function simulateSmartContract(payment) {
    // Simulação de smart contract: Retorna string com detalhes (expanda para blockchain real se necessário).
    return `Contrato inteligente gerado: Pagamento de ${payment} USD via Ethereum. Status: Pendente.`;
}

export function generateBadge(points) {
    if (points >= 300) return 'Mestre Inovador';
    if (points >= 200) return 'Especialista';
    if (points >= 100) return 'Intermediário';
    return 'Iniciante';
}

export function calculateWellnessScore(messages) {
    // Análise simples de bem-estar baseada em mensagens (integre com Gemini para análise real).
    const positive = messages.filter(m => m.includes('bom') || m.includes('ótimo')).length;
    const negative = messages.filter(m => m.includes('cansado') || m.includes('ruim')).length;
    return positive - negative; // Score positivo = bem-estar bom.
}