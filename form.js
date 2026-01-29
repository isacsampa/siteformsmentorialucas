/**
 * ════════════════════════════════════════════
 * FORMULÁRIO DE QUALIFICAÇÃO DE LEADS
 * ════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    setupPhoneMask();
    setupRealTimeValidation();
    setupProgressTracking();
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * MÁSCARA DE TELEFONE BRASILEIRA
 * Formato: (XX) XXXXX-XXXX
 */
function setupPhoneMask() {
    const phoneInput = document.getElementById('telefone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
        
        // Limita a 11 dígitos
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Aplica máscara
        if (value.length > 10) {
            // Formato: (XX) XXXXX-XXXX
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else if (value.length > 6) {
            // Formato intermediário: (XX) XXXX-XXXX
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        } else if (value.length > 2) {
            // Formato intermediário: (XX) XXXX
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            // Formato intermediário: (XX
            value = value.replace(/^(\d*)/, '($1');
        }
        
        e.target.value = value;
    });
}

/**
 * RASTREAMENTO DE PROGRESSO
 * Atualiza a barra de progresso conforme campos são preenchidos
 */
function setupProgressTracking() {
    const progressBar = document.querySelector('.progress-fill');
    if (!progressBar) return;
    
    const totalFields = 8; // Total de campos obrigatórios
    
    function updateProgress() {
        let filledFields = 0;
        
        // Conta inputs de texto e selects preenchidos
        document.querySelectorAll('#nome, #email, #ramo, #telefone').forEach(input => {
            if (input.value.trim()) filledFields++;
        });
        
        document.querySelectorAll('#faturamentoAtual, #metaFaturamento').forEach(select => {
            if (select.value) filledFields++;
        });
        
        // Conta radios selecionados
        ['objetivo', 'conhecimento'].forEach(name => {
            if (document.querySelector(`input[name="${name}"]:checked`)) {
                filledFields++;
            }
        });
        
        const percentage = Math.min((filledFields / totalFields) * 100, 100);
        progressBar.style.width = `${percentage}%`;
    }
    
    // Monitora mudanças em todos os campos
    document.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('input', updateProgress);
        field.addEventListener('change', updateProgress);
    });
}

/**
 * VALIDAÇÃO EM TEMPO REAL
 * Remove erros conforme usuário corrige os campos
 */
function setupRealTimeValidation() {
    // Remove erro de inputs ao digitar
    document.querySelectorAll('.form-input, .form-select').forEach(element => {
        element.addEventListener('input', function() {
            clearFieldError(this);
        });
        
        element.addEventListener('change', function() {
            clearFieldError(this);
        });
    });
    
    // Gerencia radios
    document.querySelectorAll('.radio-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (!radio) return;
            
            // Seleciona o radio
            radio.checked = true;
            
            // Atualiza visual do grupo
            const group = this.closest('.form-radio-group');
            group.querySelectorAll('.radio-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Remove erro do grupo
            const errorDiv = group.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('form-error')) {
                errorDiv.classList.remove('active');
            }
            
            // Dispara evento para progresso
            radio.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('form-error')) {
        errorDiv.classList.remove('active');
    }
}

/**
 * VALIDAÇÃO COMPLETA DO FORMULÁRIO
 */
function validateForm(form) {
    let isValid = true;
    const errors = [];
    
    // Valida Nome
    const nome = form.querySelector('#nome');
    if (!nome.value.trim()) {
        showFieldError(nome, 'Por favor, informe seu nome');
        errors.push('nome');
        isValid = false;
    } else if (nome.value.trim().length < 3) {
        showFieldError(nome, 'Nome deve ter pelo menos 3 caracteres');
        errors.push('nome');
        isValid = false;
    }
    
    // Valida Email
    const email = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError(email, 'Por favor, informe seu e-mail');
        errors.push('email');
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showFieldError(email, 'E-mail inválido');
        errors.push('email');
        isValid = false;
    }
    
    // Valida Telefone
    const telefone = form.querySelector('#telefone');
    const cleanPhone = telefone.value.replace(/\D/g, '');
    if (!telefone.value.trim()) {
        showFieldError(telefone, 'Por favor, informe seu WhatsApp');
        errors.push('telefone');
        isValid = false;
    } else if (cleanPhone.length < 10) {
        showFieldError(telefone, 'WhatsApp inválido (mínimo 10 dígitos)');
        errors.push('telefone');
        isValid = false;
    }
    
    // Valida Ramo
    const ramo = form.querySelector('#ramo');
    if (!ramo.value.trim()) {
        showFieldError(ramo, 'Por favor, informe seu ramo de atuação');
        errors.push('ramo');
        isValid = false;
    }
    
    // Valida Selects
    ['faturamentoAtual', 'metaFaturamento'].forEach(id => {
        const select = form.querySelector(`#${id}`);
        if (!select.value) {
            showFieldError(select, 'Por favor, selecione uma opção');
            errors.push(id);
            isValid = false;
        }
    });
    
    // Valida Radios
    ['objetivo', 'conhecimento'].forEach(name => {
        if (!form.querySelector(`input[name="${name}"]:checked`)) {
            const group = form.querySelector(`input[name="${name}"]`).closest('.form-radio-group');
            const errorDiv = group.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('form-error')) {
                errorDiv.textContent = 'Por favor, selecione uma opção';
                errorDiv.classList.add('active');
            }
            errors.push(name);
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = field.nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('form-error')) {
        errorDiv.textContent = message;
        errorDiv.classList.add('active');
    }
}

/**
 * SUBMIT DO FORMULÁRIO
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const alertDiv = document.getElementById('formAlert');
    
    // Limpa alertas anteriores
    alertDiv.classList.remove('active');
    
    // Valida
    if (!validateForm(form)) {
        showAlert('Por favor, corrija os erros antes de continuar.', 'error');
        
        // Scroll até o primeiro erro
        const firstError = form.querySelector('.error, .form-error.active');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Coleta dados
    const formData = new FormData(form);
    const leadData = {
        nome: formData.get('nome').trim(),
        email: formData.get('email').trim(),
        telefone: formData.get('telefone'),
        objetivo: formData.get('objetivo'),
        conhecimento: formData.get('conhecimento'),
        ramo: formData.get('ramo').trim(),
        faturamentoAtual: formData.get('faturamentoAtual'),
        metaFaturamento: formData.get('metaFaturamento')
    };
    
    // Calcula Score
    if (typeof calculateLeadScore === 'function') {
        const scoreData = calculateLeadScore(leadData);
        leadData.score = scoreData.score;
        leadData.classification = scoreData.classification;
    }
    
    // Mostra loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    try {
        // Envia para API
        if (typeof saveLead === 'function') {
            await saveLead(leadData);
        }
        
        // Salva no sessionStorage para página de obrigado
        sessionStorage.setItem('leadData', JSON.stringify(leadData));
        
        // Redireciona
        setTimeout(() => {
            window.location.href = 'thanks.html';
        }, 800);
        
    } catch (error) {
        console.error('Erro ao enviar:', error);
        
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
        
        showAlert('Erro ao enviar. Por favor, tente novamente.', 'error');
    }
}

function showAlert(message, type) {
    const alertDiv = document.getElementById('formAlert');
    if (!alertDiv) return;
    
    alertDiv.className = `alert alert-${type} active`;
    alertDiv.textContent = message;
    
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove após 5 segundos
    setTimeout(() => {
        alertDiv.classList.remove('active');
    }, 5000);
}
