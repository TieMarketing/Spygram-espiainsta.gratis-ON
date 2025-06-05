import { modalModule } from './modules/modal.js';
import { themeModule } from './modules/theme.js';

document.addEventListener('DOMContentLoaded', function() {
    // Gerenciamento do tema
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    function updateThemeIcon(isDark) {
        themeIcon.innerHTML = isDark 
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
    }

    // Verificar tema atual
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon(false);
    }

    // Toggle do tema
    themeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
        updateThemeIcon(isDark);
    });

    // Inicializa os módulos
    modalModule.init();
    themeModule.init();

    // Gerenciamento de modais para produtos bloqueados
    const produtosBloqueados = document.querySelectorAll('.produto-bloqueado');
    produtosBloqueados.forEach((produto, index) => {
        produto.addEventListener('click', async (e) => {
            e.preventDefault();
            const modalNumber = index + 2; // Começa do 2 pois o primeiro produto não é bloqueado
            const content = await modalModule.loadModalContent(modalNumber);
            modalModule.openModal(`Produto ${modalNumber}`, content);
        });
    });

    // Configurar listeners para itens bloqueados
    document.querySelectorAll('.blocked-product').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            const modalNumber = item.getAttribute('data-modal');
            if (modalNumber) {
                const content = await modalModule.loadModalContent(modalNumber);
                modalModule.openModal('Produto Bloqueado', content);
            }
        });
    });

    // Setup do evento de fechar modal
    const modalContainer = document.getElementById('modalContainer');
    if (modalContainer) {
        // Fechar ao clicar fora do modal
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                modalModule.closeModal();
            }
        });

        // Fechar ao pressionar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
                modalModule.closeModal();
            }
        });
    }
});
