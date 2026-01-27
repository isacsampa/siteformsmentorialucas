/**
 * ============================================
 * EXEMPLOS DE INTEGRAÇÃO COM APIS
 * Código pronto para copiar e adaptar
 * ============================================
 */

// =============================================
// 1. INTEGRAÇÃO COM Z-API (WhatsApp)
// =============================================
// Documentação: https://developer.z-api.io/

async function sendWhatsAppZAPI(phoneNumber, message) {
    const INSTANCE_ID = '3EDBE01E39C3813DBDFC1AA3C48FFF2B';
    const TOKEN = '7BD2068E7835A7ABB6DFB260';
    
    const endpoint = `https://api.z-api.io/instances/3EDBE01E39C3813DBDFC1AA3C48FFF2B/token/7BD2068E7835A7ABB6DFB260/send-text`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phoneNumber, // Formato: 5586999999999
                message: message
            })
        });
        
        const data = await response.json();
        console.log('✅ WhatsApp enviado via Z-API:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro Z-API:', error);
        throw error;
    }
}

// =============================================
// 2. INTEGRAÇÃO COM TWILIO (WhatsApp)
// =============================================
// Documentação: https://www.twilio.com/docs/whatsapp

async function sendWhatsAppTwilio(phoneNumber, message) {
    const ACCOUNT_SID = 'SEU_ACCOUNT_SID';
    const AUTH_TOKEN = 'SEU_AUTH_TOKEN';
    const TWILIO_WHATSAPP = 'whatsapp:+14155238886'; // Número Twilio
    
    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${ACCOUNT_SID}:${AUTH_TOKEN}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                From: TWILIO_WHATSAPP,
                To: `whatsapp:+${phoneNumber}`,
                Body: message
            })
        });
        
        const data = await response.json();
        console.log('✅ WhatsApp enviado via Twilio:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro Twilio:', error);
        throw error;
    }
}

// =============================================
// 3. INTEGRAÇÃO COM 360DIALOG (WhatsApp Business)
// =============================================
// Documentação: https://docs.360dialog.com/

async function sendWhatsApp360Dialog(phoneNumber, message) {
    const API_KEY = 'SUA_API_KEY_360DIALOG';
    const endpoint = 'https://waba.360dialog.io/v1/messages';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'D360-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: phoneNumber,
                type: 'text',
                text: {
                    body: message
                }
            })
        });
        
        const data = await response.json();
        console.log('✅ WhatsApp enviado via 360Dialog:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro 360Dialog:', error);
        throw error;
    }
}

// =============================================
// 4. INTEGRAÇÃO COM RD STATION (CRM)
// =============================================
// Documentação: https://developers.rdstation.com/

async function sendLeadToRDStation(leadData) {
    const API_KEY = 'SUA_API_KEY_RD_STATION';
    const endpoint = 'https://api.rd.services/platform/conversions';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'CONVERSION',
                event_family: 'CDP',
                payload: {
                    conversion_identifier: 'lead-licitacao',
                    email: leadData.email,
                    name: leadData.nome,
                    mobile_phone: leadData.whatsapp,
                    cf_objetivo: leadData.objetivo,
                    cf_conhecimento: leadData.conhecimento,
                    cf_ramo: leadData.ramo,
                    cf_faturamento_atual: leadData.faturamentoAtual,
                    cf_meta_faturamento: leadData.metaFaturamento,
                    cf_score: leadData.score,
                    cf_classification: leadData.classification
                }
            })
        });
        
        const data = await response.json();
        console.log('✅ Lead enviado para RD Station:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro RD Station:', error);
        throw error;
    }
}

// =============================================
// 5. INTEGRAÇÃO COM HUBSPOT (CRM)
// =============================================
// Documentação: https://developers.hubspot.com/

async function sendLeadToHubSpot(leadData) {
    const API_KEY = 'SUA_API_KEY_HUBSPOT';
    const endpoint = 'https://api.hubapi.com/contacts/v1/contact';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                properties: [
                    { property: 'email', value: leadData.email },
                    { property: 'firstname', value: leadData.nome.split(' ')[0] },
                    { property: 'lastname', value: leadData.nome.split(' ').slice(1).join(' ') },
                    { property: 'phone', value: leadData.whatsapp },
                    { property: 'objetivo_licitacao', value: leadData.objetivo },
                    { property: 'conhecimento_previo', value: leadData.conhecimento },
                    { property: 'ramo_atuacao', value: leadData.ramo },
                    { property: 'lead_score', value: leadData.score },
                    { property: 'lead_classification', value: leadData.classification }
                ]
            })
        });
        
        const data = await response.json();
        console.log('✅ Lead enviado para HubSpot:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro HubSpot:', error);
        throw error;
    }
}

// =============================================
// 6. INTEGRAÇÃO COM GOOGLE SHEETS (via Apps Script)
// =============================================
// Tutorial: https://developers.google.com/apps-script/

async function sendLeadToGoogleSheets(leadData) {
    // 1. Crie um Google Apps Script em sua planilha
    // 2. Use o código abaixo e publique como Web App
    // 3. Use a URL gerada aqui
    
    const SCRIPT_URL = 'https://script.google.com/macros/s/SEU_SCRIPT_ID/exec';
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: leadData.nome,
                email: leadData.email,
                whatsapp: leadData.whatsapp,
                objetivo: leadData.objetivo,
                conhecimento: leadData.conhecimento,
                ramo: leadData.ramo,
                faturamentoAtual: leadData.faturamentoAtual,
                metaFaturamento: leadData.metaFaturamento,
                score: leadData.score,
                classification: leadData.classification,
                timestamp: new Date().toISOString()
            })
        });
        
        console.log('✅ Lead enviado para Google Sheets');
        return { success: true };
    } catch (error) {
        console.error('❌ Erro Google Sheets:', error);
        throw error;
    }
}

// CÓDIGO DO GOOGLE APPS SCRIPT (cole na planilha):
/*
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date(),
      data.nome,
      data.email,
      data.whatsapp,
      data.objetivo,
      data.conhecimento,
      data.ramo,
      data.faturamentoAtual,
      data.metaFaturamento,
      data.score,
      data.classification
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Lead salvo com sucesso'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
*/

// =============================================
// 7. INTEGRAÇÃO COM AIRTABLE
// =============================================
// Documentação: https://airtable.com/developers/web/api/introduction

async function sendLeadToAirtable(leadData) {
    const API_KEY = 'SUA_API_KEY_AIRTABLE';
    const BASE_ID = 'SEU_BASE_ID';
    const TABLE_NAME = 'Leads';
    
    const endpoint = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    'Nome': leadData.nome,
                    'Email': leadData.email,
                    'WhatsApp': leadData.whatsapp,
                    'Objetivo': leadData.objetivo,
                    'Conhecimento': leadData.conhecimento,
                    'Ramo': leadData.ramo,
                    'Faturamento Atual': leadData.faturamentoAtual,
                    'Meta Faturamento': leadData.metaFaturamento,
                    'Score': leadData.score,
                    'Classification': leadData.classification,
                    'Data': new Date().toISOString()
                }
            })
        });
        
        const data = await response.json();
        console.log('✅ Lead enviado para Airtable:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro Airtable:', error);
        throw error;
    }
}

// =============================================
// 8. INTEGRAÇÃO COM ZAPIER (Webhook)
// =============================================
// Tutorial: https://zapier.com/apps/webhook/integrations

async function sendLeadToZapier(leadData) {
    // 1. Crie um Zap no Zapier
    // 2. Use "Webhooks by Zapier" como trigger
    // 3. Copie a URL do webhook
    
    const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/XXXXXX/YYYYYY/';
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });
        
        console.log('✅ Lead enviado para Zapier');
        return { success: true };
    } catch (error) {
        console.error('❌ Erro Zapier:', error);
        throw error;
    }
}

// =============================================
// 9. INTEGRAÇÃO COM N8N (Workflow Automation)
// =============================================

async function sendLeadToN8N(leadData) {
    const WEBHOOK_URL = 'https://seu-n8n.com/webhook/lead-licitacao';
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });
        
        const data = await response.json();
        console.log('✅ Lead enviado para N8N:', data);
        return data;
    } catch (error) {
        console.error('❌ Erro N8N:', error);
        throw error;
    }
}

// =============================================
// 10. INTEGRAÇÃO COM MAKE (Integromat)
// =============================================

async function sendLeadToMake(leadData) {
    const WEBHOOK_URL = 'https://hook.make.com/XXXXXXXXXXXXX';
    
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });
        
        console.log('✅ Lead enviado para Make');
        return { success: true };
    } catch (error) {
        console.error('❌ Erro Make:', error);
        throw error;
    }
}

// =============================================
// EXEMPLO DE FUNÇÃO COMPLETA COM MÚLTIPLAS INTEGRAÇÕES
// =============================================

async function processLeadWithIntegrations(leadData) {
    const results = {
        whatsapp: false,
        crm: false,
        sheets: false,
        errors: []
    };
    
    // 1. Enviar WhatsApp
    try {
        await sendWhatsAppZAPI(
            `55${leadData.whatsapp}`, 
            leadData.whatsappMessage
        );
        results.whatsapp = true;
        console.log('✅ WhatsApp enviado');
    } catch (error) {
        results.errors.push('WhatsApp failed');
        console.error('❌ Falha no WhatsApp:', error);
    }
    
    // 2. Salvar no CRM (RD Station ou HubSpot)
    try {
        await sendLeadToRDStation(leadData);
        results.crm = true;
        console.log('✅ Salvo no CRM');
    } catch (error) {
        results.errors.push('CRM failed');
        console.error('❌ Falha no CRM:', error);
    }
    
    // 3. Salvar no Google Sheets (backup)
    try {
        await sendLeadToGoogleSheets(leadData);
        results.sheets = true;
        console.log('✅ Salvo no Sheets');
    } catch (error) {
        results.errors.push('Sheets failed');
        console.error('❌ Falha no Sheets:', error);
    }
    
    return results;
}

// =============================================
// EXPORTAR FUNÇÕES
// =============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendWhatsAppZAPI,
        sendWhatsAppTwilio,
        sendWhatsApp360Dialog,
        sendLeadToRDStation,
        sendLeadToHubSpot,
        sendLeadToGoogleSheets,
        sendLeadToAirtable,
        sendLeadToZapier,
        sendLeadToN8N,
        sendLeadToMake,
        processLeadWithIntegrations
    };
}
