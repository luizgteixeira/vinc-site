/* ==========================================
   PRINCIPAL SCRIPT DO SISTEMA VINC
========================================== */

/**
 * Normaliza caminhos e limpa parâmetros de query/hash/trailing slashes.
 */
function normalizePath(path) {
  if (!path) return '/';
  let p = path.split('?')[0].split('#')[0];
  if (p !== '/' && p.endsWith('/')) p = p.replace(/\/+$/, '');
  return p || '/';
}

/**
 * Ativa dinamicamente o link do menu correspondente à página atual.
 */
function initActiveMenu() {
  const currentPath = normalizePath(window.location.pathname || '/');
  const menuLinks = document.querySelectorAll('.menu a[href]');

  menuLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (href === '#') return;

    let linkUrl;
    try {
      linkUrl = new URL(href, document.baseURI);
    } catch (err) {
      return;
    }

    const linkPath = normalizePath(linkUrl.pathname);

    const isIndexCurrent = (currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html'));
    const isIndexLink = (linkPath === '/' || linkPath === '/index.html' || linkPath.endsWith('/index.html'));

    const match = (isIndexCurrent && isIndexLink) || (currentPath === linkPath) || (currentPath.endsWith(linkPath));

    if (match) {
      link.classList.add('ativo');
      link.setAttribute('aria-current', 'page');

      const parentDropdown = link.closest('.menu-item-dropdown');
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('.dropdown-toggle') || parentDropdown.querySelector('a');
        if (parentToggle) parentToggle.classList.add('ativo');

        parentDropdown.classList.add('submenu-aberto');
        if (parentToggle) parentToggle.setAttribute('aria-expanded', 'true');

        const submenu = parentDropdown.querySelector('.submenu');
        if (submenu) {
          submenu.style.visibility = 'visible';
          submenu.style.opacity = '1';
          submenu.style.maxHeight = submenu.scrollHeight + 'px';
        }
      }
    }
  });
}

/**
 * Gerencia a lógica do menu dropdown (desktop hover e mobile click/accordion).
 */
function initDropdownMenu() {
  const dropdowns = document.querySelectorAll('.menu-item-dropdown');

  const closeAllDropdowns = (excludeDropdown = null) => {
    dropdowns.forEach((item) => {
      if (item !== excludeDropdown) {
        item.classList.remove('submenu-aberto');
        const toggle = item.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');

        // No mobile, recolhemos o submenu limpando o maxHeight
        if (window.innerWidth <= 1024) {
          const submenu = item.querySelector('.submenu');
          if (submenu) {
            submenu.style.maxHeight = '0px';
          }
        }
      }
    });
  };

  // Desktop: o submenu também abre/fecha com o foco do teclado (antes só abria no :hover,
  // deixando os links internos inalcançáveis por Tab).
  let skipFocusOpen = false;

  const setDesktopOpen = (dropdown, open) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    dropdown.classList.toggle('submenu-aberto', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  };

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    if (!toggle) return;

    dropdown.addEventListener('focusin', () => {
      if (window.innerWidth <= 1024 || skipFocusOpen) return;
      closeAllDropdowns(dropdown);
      setDesktopOpen(dropdown, true);
    });

    dropdown.addEventListener('focusout', (event) => {
      if (window.innerWidth <= 1024) return;
      if (!dropdown.contains(event.relatedTarget)) setDesktopOpen(dropdown, false);
    });

    toggle.addEventListener('click', (event) => {
      if (window.innerWidth > 1024) {
        // Toggle sem destino real (href="#"): evita pular para o topo da página.
        if (toggle.getAttribute('href') === '#') event.preventDefault();
        return;
      }
      if (window.innerWidth <= 1024) {
        event.preventDefault();
        const isOpen = dropdown.classList.contains('submenu-aberto');

        closeAllDropdowns(dropdown);

        dropdown.classList.toggle('submenu-aberto');
        toggle.setAttribute('aria-expanded', String(!isOpen));

        const submenu = dropdown.querySelector('.submenu');
        if (submenu) {
          if (!isOpen) {
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
          } else {
            submenu.style.maxHeight = '0px';
          }
        }
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.menu')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      // Se o foco está dentro de um submenu, devolve-o ao toggle (sem reabrir) antes de fechar.
      const focusedToggle = document.activeElement && document.activeElement.closest('.submenu')
        ? document.activeElement.closest('.menu-item-dropdown')?.querySelector('.dropdown-toggle')
        : null;
      closeAllDropdowns();
      if (focusedToggle) {
        skipFocusOpen = true;
        focusedToggle.focus();
        skipFocusOpen = false;
      }
    }
  });

  // Listener para ajustar e limpar estilos inline ao redimensionar a tela
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove('submenu-aberto');
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        const submenu = dropdown.querySelector('.submenu');
        if (submenu) {
          submenu.style.maxHeight = '';
          submenu.style.visibility = '';
          submenu.style.opacity = '';
        }
      });

      // Garante a limpeza de qualquer classe ativa do menu mobile ao redimensionar para o desktop
      const menu = document.querySelector('.menu');
      const menuToggle = document.getElementById('menuToggle');
      const header = document.querySelector('.header');
      if (menu && menuToggle && header) {
        menu.classList.remove('ativo');
        menuToggle.classList.remove('ativo');
        header.classList.remove('menu-aberto');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    } else {
      // No mobile, garante que submenus abertos possuam maxHeight correto recalculado
      dropdowns.forEach((dropdown) => {
        if (dropdown.classList.contains('submenu-aberto')) {
          const submenu = dropdown.querySelector('.submenu');
          if (submenu) {
            submenu.style.maxHeight = submenu.scrollHeight + 'px';
          }
        }
      });
    }
  });
}

/**
 * Inicializa os Accordions (usados na FAQ e Contatos).
 */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (!header || !content) return;

    const toggleItem = () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      accordionItems.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherHeader = otherItem.querySelector('.accordion-header');
          const otherContent = otherItem.querySelector('.accordion-content');
          otherItem.classList.remove('active');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = '0px';
        }
      });

      if (isExpanded) {
        item.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    };

    header.addEventListener('click', toggleItem);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleItem();
      }
    });

    content.addEventListener('transitionend', () => {
      if (header.getAttribute('aria-expanded') === 'true') {
        content.style.maxHeight = 'none';
      }
    });

    window.addEventListener('resize', () => {
      if (header.getAttribute('aria-expanded') === 'true') {
        content.style.maxHeight = 'none';
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Inicialização central pós DOM pronto.
 */
document.addEventListener('DOMContentLoaded', () => {
  initActiveMenu();
  initDropdownMenu();
  initAccordion();

  const header = document.querySelector('.header');
  if (header) {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
      menuToggle.addEventListener('click', () => {
        const isExpanded = menu.classList.contains('ativo');
        menu.classList.toggle('ativo');
        menuToggle.classList.toggle('ativo');
        header.classList.toggle('menu-aberto');
        menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      });
    }

    header.querySelectorAll('.menu a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
          // Se for o link que apenas expande o dropdown, não fecha o menu mobile
          if (link.classList.contains('dropdown-toggle')) {
            return;
          }
          const menu = document.querySelector('.menu');
          const menuToggle = document.getElementById('menuToggle');
          if (menu && menuToggle) {
            menu.classList.remove('ativo');
            menuToggle.classList.remove('ativo');
            header.classList.remove('menu-aberto');
            menuToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
});
