// sidebar.js - Controle completo do sidebar responsivo
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.getElementById('menuButton');
    const closeButton = document.getElementById('closeSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    // Verifica se estamos no desktop (lg breakpoint do Tailwind)
    function isDesktop() {
        return window.innerWidth >= 1024;
    }
    
    // Alterna a visibilidade do sidebar
    function toggleSidebar() {
        if (isDesktop()) {
            // No desktop: simplesmente mostrar/ocultar com classe customizada (opcional)
            sidebar.classList.toggle('lg:hidden'); // Apenas se quiser colapsável no desktop
        } else {
            // No mobile: alternar entre mostrar e ocultar
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                sidebar.classList.add('translate-x-0');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.remove('translate-x-0');
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        }
    }
    
    
    // Configura o estado inicial
    function setInitialState() {
        if (isDesktop()) {
            // Desktop - sidebar visível por padrão
            sidebar.classList.remove('-translate-x-full');
            sidebar.classList.add('lg:w-64');
            overlay.classList.add('hidden');
            document.querySelector('main').classList.add('lg:ml-64');
        } else {
            // Mobile - sidebar oculto por padrão
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        }
    }
    
    // Configura os event listeners
    function setupEventListeners() {
        if (menuButton) menuButton.addEventListener('click', toggleSidebar);
        if (closeButton) closeButton.addEventListener('click', toggleSidebar);
        if (overlay) overlay.addEventListener('click', toggleSidebar);
        
        // Redimensionamento da janela
        window.addEventListener('resize', function() {
            if (isDesktop()) {
                // Garante que no desktop o overlay esteja escondido
                overlay.classList.add('hidden');
            }
        });
    }
    
    // Inicializa tudo
    setInitialState();
    setupEventListeners();
});