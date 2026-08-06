/* ==========================================
   FORMULÁRIO DE SOLICITAÇÃO DE CHAVE (WEB3FORMS)
========================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('request-form');
  const feedback = document.getElementById('request-form-feedback');
  const submitButton = document.getElementById('request-form-submit');
  if (!form || !feedback || !submitButton) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Honeypot: se o campo estiver preenchido, é um bot. Ignora silenciosamente.
    if (form.botcheck && form.botcheck.checked) return;

    submitButton.disabled = true;
    feedback.textContent = 'Enviando solicitação...';
    feedback.className = 'newsletter-feedback';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Falha no envio.');
      }

      feedback.textContent = 'Solicitação enviada com sucesso! Nossa equipe entrará em contato pelo e-mail informado em breve.';
      feedback.className = 'newsletter-feedback success';
      form.reset();
    } catch (error) {
      feedback.innerHTML = 'Não foi possível enviar sua solicitação agora. Tente novamente em instantes ou <a href="mailto:contato@vincapp.com.br">escreva diretamente para nós</a>.';
      feedback.className = 'newsletter-feedback error';
    } finally {
      submitButton.disabled = false;
    }
  });
});
