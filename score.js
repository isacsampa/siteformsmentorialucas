function calculateLeadScore(data) {
    let score = 0;

    // Objetivo
    const objMap = { 'renda-extra': 10, 'viver-disso': 20, 'faturar-mais': 30 };
    score += objMap[data.objetivo] || 0;

    // Conhecimento
    score += (data.conhecimento === 'sim') ? 20 : 10;

    // Faturamento
    const fat = parseInt(data.faturamentoAtual) || 0;
    if (fat === 0) score += 5;
    else if (fat < 10000) score += 10;
    else if (fat < 50000) score += 15;
    else score += 25;

    // Meta
    const meta = parseInt(data.metaFaturamento) || 0;
    if (meta < 20000) score += 5;
    else if (meta < 50000) score += 10;
    else if (meta < 100000) score += 15;
    else score += 25;

    // Classificação
    let classification = 'COLD';
    if (score >= 70) classification = 'HOT';
    else if (score >= 40) classification = 'WARM';

    return { score, classification };
}