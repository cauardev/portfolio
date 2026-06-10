document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const backToTop = document.getElementById('backToTop');
  const navMenu = document.getElementById('navMenu');
  const aboutToggle = document.getElementById('toggleAbout');
  const aboutExtra = document.getElementById('aboutExtra');
  const projectFilters = document.getElementById('projectFilters');
  const projectCount = document.getElementById('projectCount');
  const projectCards = Array.from(document.querySelectorAll('.proj-card[data-category]'));
  const contatoForm = document.querySelector('.contato-form');
  const formFeedback = document.getElementById('formFeedback');
  const messageField = document.getElementById('mensagem');
  const messageCount = document.getElementById('messageCount');

  const themeKey = 'portfolio-theme';

  // Tema com persistência
  const applyTheme = (isDark) => {
    themeToggle.checked = isDark;
    localStorage.setItem(themeKey, isDark ? 'dark' : 'light');
  };

  const savedTheme = localStorage.getItem(themeKey);
  if (savedTheme) {
    applyTheme(savedTheme === 'dark');
  } else {
    // Mantém o comportamento padrão do checkbox se não houver preferência salva
    applyTheme(themeToggle.checked);
  }

  themeToggle.addEventListener('change', () => {
    localStorage.setItem(themeKey, themeToggle.checked ? 'dark' : 'light');
  });

  // Back to top
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
  }

  // Fecha o menu collapse ao clicar em um link (mobile)
  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const collapse = bootstrap.Collapse.getInstance(navMenu);
      if (collapse) collapse.hide();
    });
  });

  // Ver mais / ver menos no Sobre
  if (aboutToggle && aboutExtra) {
    aboutToggle.addEventListener('click', () => {
      const isOpen = !aboutExtra.classList.contains('d-none');
      aboutExtra.classList.toggle('d-none');
      aboutExtra.setAttribute('aria-hidden', String(isOpen));
      aboutToggle.setAttribute('aria-expanded', String(!isOpen));
      aboutToggle.innerHTML = isOpen
        ? '<i class="bi bi-plus-lg me-2"></i> Ver mais'
        : '<i class="bi bi-dash-lg me-2"></i> Ver menos';
    });
  }

  // Filtro de projetos
  const updateProjectCount = () => {
    if (!projectCount) return;
    const visible = projectCards.filter(card => !card.classList.contains('project-hidden')).length;
    projectCount.textContent = `${visible} projeto${visible === 1 ? '' : 's'} exibido${visible === 1 ? '' : 's'}`;
  };

  const setActiveFilter = (filter) => {
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('project-hidden', !match);
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
      btn.setAttribute('aria-pressed', String(btn.dataset.filter === filter));
    });

    updateProjectCount();
  };

  if (projectFilters) {
    projectFilters.addEventListener('click', (event) => {
      const button = event.target.closest('.filter-btn');
      if (!button) return;
      setActiveFilter(button.dataset.filter);
    });

    setActiveFilter('all');
  }

  // Validação do formulário do contato
  const updateMessageCounter = () => {
    if (!messageField || !messageCount) return;
    messageCount.textContent = String(messageField.value.length);
  };

  if (messageField) {
    updateMessageCounter();
    messageField.addEventListener('input', updateMessageCounter);
  }

  if (contatoForm) {
    contatoForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const nome = document.getElementById('nome');
      const email = document.getElementById('email');
      const mensagem = document.getElementById('mensagem');

      const fields = [nome, email, mensagem];
      fields.forEach(field => field.classList.remove('is-valid', 'is-invalid'));

      const nomeValido = nome.value.trim().length >= 3;
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      const mensagemValida = mensagem.value.trim().length >= 10;

      nome.classList.add(nomeValido ? 'is-valid' : 'is-invalid');
      email.classList.add(emailValido ? 'is-valid' : 'is-invalid');
      mensagem.classList.add(mensagemValida ? 'is-valid' : 'is-invalid');

      if (!nomeValido || !emailValido || !mensagemValida) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Preencha os campos corretamente antes de enviar.';
        }
        return;
      }

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <div class="contact-summary">
            <strong>Mensagem enviada com sucesso!</strong><br>
            Obrigado, ${nome.value.trim().split(' ')[0] || 'visitante'}. Vou retornar no e-mail ${email.value.trim()}.
          </div>
        `;
      }

      contatoForm.reset();
      [nome, email, mensagem].forEach(field => field.classList.remove('is-valid', 'is-invalid'));
      updateMessageCounter();
    });
  }
});
