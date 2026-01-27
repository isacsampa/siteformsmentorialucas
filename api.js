/**
 * Lógica de Integração com Google Sheets (Backend)
 * ================================================
 */

const API_CONFIG = {
    // ⚠️ SUBSTITUA PELA URL DO SEU GOOGLE APPS SCRIPT PUBLICADO (WEB APP)
    // Exemplo: https://script.google.com/macros/s/XXXXXX/exec
    SAVE_LEAD_ENDPOINT: 'https://script.google.com/macros/s/AKfycbziD-6mutCL7glI8qjkCsu9BoYuVSp_nnPeRMiuTM2CNsGPEotMx85fKnulRuoGhLoI/exec', 
};

/**
 * Envia os dados para o Google Sheets.
 * Usa mode: 'no-cors' para evitar bloqueio de segurança do navegador.
 * Nota: Em 'no-cors', não conseguimos ler a resposta (sucesso/erro), 
 * então assumimos sucesso se a rede não falhar.
 */
async function saveLead(leadData) {
    // Adiciona timestamp e user agent para auditoria
    const payload = {
        ...leadData,
        created_at: new Date().toISOString(),
        user_agent: navigator.userAgent
    };

    try {
        await fetch(API_CONFIG.SAVE_LEAD_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors', // CRUCIAL para Google Script
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // CRUCIAL para evitar Preflight OPTION
            },
            body: JSON.stringify(payload)
        });

        console.log('✅ Enviado para fila de processamento');
        return { success: true };

    } catch (error) {
        console.error('❌ Erro de rede:', error);
        
        // Estratégia de Backup: Salvar no LocalStorage para tentar depois
        // (Implementação futura de retry pode ser adicionada aqui)
        localStorage.setItem('failed_lead_' + Date.now(), JSON.stringify(payload));
        
        // Retornamos true para não travar o usuário, já que o erro pode ser momentâneo
        return { success: true };
    }
}