import { statsManager } from './modules/stats.js';

// Inicializa todos os módulos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o módulo de estatísticas
    statsManager.init();

    // Os módulos agora se auto-inicializam
    // themeModule, sidebarModule, e modalModule são globais

    // Expõe a função openModal globalmente para os links dos produtos
    window.openModal = (modalId) => {
        if (typeof modalModule !== 'undefined') {
            modalModule.openModal(modalId);
        }
    };

    // Função para alternar a sidebar
    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        sidebar.classList.toggle('translate-x-0');
        overlay.classList.toggle('hidden');
    }

    // Event listener para o botão de menu
    document.getElementById('menuButton').addEventListener('click', toggleSidebar);

    // Expõe a função toggleSidebar globalmente
    window.toggleSidebar = toggleSidebar;
});
