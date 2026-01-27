document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    setupRealTimeValidation();
    setupPhoneFormatting();
    setupProgressTracking();
}

// Formatação inteligente de telefone (Brasil)
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            
            if (v.length > 2) v = `(${v.substring(0,2)}) ${v.substring(2)}`;
            if (v.length > 9) v = `${v.substring(0,9)}-${v.substring(9)}`; // (XX) 9XXXX-XXXX
            
            e.target.value = v;
        });
    }
}

// Rastreia o progresso para animar a barra
function setupProgressTracking() {
    const inputs = document.querySelectorAll('input, select');
    const progressBar = document.querySelector('.progress-fill');
    
    function updateProgress() {
        const total = 9; // Campos obrigatórios aproximados
        let filled = 0;
        
        // Verifica inputs de texto e selects
        document.querySelectorAll('.form-input, .form-select').forEach(i => {
            if(i.value) filled++;
        });
        
        // Verifica radios (conta 1 por grupo)
        ['conhecimento', 'objetivo', 'horario'].forEach(name => {
            if(document.querySelector(`input[name="${name}"]:checked`)) filled++;
        });

        const pct = Math.min((filled / total) * 100, 100);
        if(progressBar) progressBar.style.width = `${pct}%`;
    }

    inputs.forEach(i => i.addEventListener('change', updateProgress));
    inputs.forEach(i => i.addEventListener('input', updateProgress));
}

function setupRealTimeValidation() {
    // Remove erro ao digitar/selecionar
    document.querySelectorAll('.form-input, .form-select').forEach(el => {
        el.addEventListener('input', () => {
            el.classList.remove('error');
            const errDiv = el.nextElementSibling;
            if(errDiv?.classList.contains('form-error')) errDiv.classList.remove('active');
        });
    });

    // Lógica para Radios
    document.querySelectorAll('.radio-option').forEach(opt => {
        opt.addEventListener('click', function() {
            const radio = this.querySelector('input');
            if(radio) {
                radio.checked = true;
                // Atualiza visual
                const group = this.closest('.form-radio-group');
                group.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
                
                // Remove erro
                const errDiv = group.nextElementSibling;
                if(errDiv) errDiv.classList.remove('active');
                
                // Dispara evento para barra de progresso
                radio.dispatchEvent(new Event('change', {bubbles: true}));
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    
    // Valida Inputs Simples
    form.querySelectorAll('[required]').forEach(field => {
        if (field.type !== 'radio' && !field.value.trim()) {
            showError(field, 'Campo obrigatório');
            isValid = false;
        }
    });

    // Valida Radios
    ['conhecimento', 'objetivo', 'horario'].forEach(name => {
        if (!form.querySelector(`input[name="${name}"]:checked`)) {
            const group = form.querySelector(`input[name="${name}"]`).closest('.form-radio-group');
            const errDiv = group.nextElementSibling;
            if(errDiv) {
                errDiv.innerText = "Selecione uma opção";
                errDiv.classList.add('active');
            }
            isValid = false;
        }
    });

    // Validações Específicas
    const email = form.querySelector('#email');
    if (email.value && !email.value.includes('@')) {
        showError(email, 'Email inválido');
        isValid = false;
    }
    
    const tel = form.querySelector('#telefone');
    if (tel.value && tel.value.replace(/\D/g,'').length < 10) {
        showError(tel, 'Telefone inválido');
        isValid = false;
    }

    return isValid;
}

function showError(field, msg) {
    field.classList.add('error');
    const errDiv = field.nextElementSibling;
    if (errDiv && errDiv.classList.contains('form-error')) {
        errDiv.innerText = msg;
        errDiv.classList.add('active');
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Limpa erros anteriores
    document.getElementById('formAlert').classList.remove('active');

    if (!validateForm(form)) {
        showAlert('Preencha todos os campos corretamente.', 'error');
        return;
    }

    // Coletar dados
    const rawData = new FormData(form);
    const formData = Object.fromEntries(rawData.entries());
    
    // Calcular Score (função do arquivo score.js)
    if (typeof calculateLeadScore === 'function') {
        const scoreData = calculateLeadScore(formData);
        formData.score = scoreData.score;
        formData.classification = scoreData.classification;
    }

    // UI Loading
    const loading = document.getElementById('loadingOverlay');
    loading.classList.add('active');

    try {
        // Enviar para API (api.js)
        await saveLead(formData);
        
        // Salvar dados para a página de obrigado
        sessionStorage.setItem('leadData', JSON.stringify(formData));

        // Redirecionar com segurança (pequeno delay para UX)
        setTimeout(() => {
            window.location.href = 'thanks.html';
        }, 1000);

    } catch (error) {
        console.error(error);
        loading.classList.remove('active');
        showAlert('Erro de conexão. Tente novamente.', 'error');
    }
}

function showAlert(msg, type) {
    const alert = document.getElementById('formAlert');
    alert.className = `alert alert-${type} active`;
    alert.innerText = msg;
    alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
}