// Modal management
export const modalModule = {
    // FunÃ§Ã£o para processar o link de suporte com parÃ¢metros
    setupSupportLink() {
        console.log('Configurando link de suporte no modal.js');
        
        // Function to get cookie value
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        }

        // Function to get data from cookie or localStorage as fallback
        function getData(key) {
            let value = getCookie(key);
            if (!value && window.localStorage) {
                value = localStorage.getItem(key);
            }
            console.log(`Valor para ${key}: ${value || 'nÃ£o encontrado'}`);
            return value || '';
        }

        // Get all required data
        const dataToCollect = [
            'upsellpurchase',
            'profilepic',
            'mailLogin',
            'upsell-1-purchase',
            'upsell-2-purchase',
            'profilePicUrl',
            'profileUsername',
            'profileId',
            'mediaCount',
            'isPrivate',
            'followingCount',
            'followerCount',
            'analysisOption'
        ];

        // Verificar cookies e localStorage disponÃ­veis
        console.log('Cookies disponÃ­veis:', document.cookie);
        console.log('LocalStorage disponÃ­vel:', Object.keys(localStorage).length > 0);
        
        // Encontra o link de suporte
        const supportLink = document.getElementById('suport_link');
        console.log('Procurando link de suporte:', supportLink);
        
        if (supportLink) {
            supportLink.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Clique no link de suporte detectado');
                
                let queryParams = [];
                dataToCollect.forEach(function(key) {
                    const value = getData(key);
                    if (value) {
                        queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    }
                });
                
                // Get the current href and append parameters
                let href = this.getAttribute('href');
                if (queryParams.length > 0) {
                    href += (href.includes('?') ? '&' : '?') + queryParams.join('&');
                }
                
                console.log('Redirecionando para:', href);
                // Navigate to the URL
                window.location.href = href;
            });
            
            console.log('Support link setup completed');
        } else {
            console.error('Support link not found');
        }
    },

    openModal(title, content) {
        const modalContainer = document.getElementById('modalContainer');
        const modalContent = document.getElementById('modalContent');
        
        if (!modalContainer || !modalContent) {
            console.error('Elementos do modal nÃ£o encontrados');
            return;
        }

        // Atualiza o conteÃºdo do modal
        modalContent.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">${title}</h3>
                <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 close-modal-btn">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        `;

        // Adiciona evento ao botÃ£o de fechar
        const closeButton = modalContent.querySelector('.close-modal-btn');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }

        // Mostra o modal
        modalContainer.classList.remove('hidden');
        modalContainer.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Verifica se o modal contÃ©m o link de suporte e chama a funÃ§Ã£o setupSupportLink
        if (modalContent.querySelector('#suport_link')) {
            setTimeout(() => {
                this.setupSupportLink();
                console.log('setupSupportLink chamado apÃ³s abertura do modal');
            }, 100);
        }
    },

    closeModal() {
        const modalContainer = document.getElementById('modalContainer');
        if (modalContainer) {
            modalContainer.classList.remove('flex');
            modalContainer.classList.add('hidden');
            document.body.style.overflow = '';
        }
    },

    setupEventListeners() {
        const modalContainer = document.getElementById('modalContainer');
        if (modalContainer) {
            // Fechar ao clicar fora do modal
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    this.closeModal();
                }
            });

            // Fechar ao pressionar ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
                    this.closeModal();
                }
            });
        }
    },

    async loadModalContent(modalNumber) {
        try {
            const response = await fetch(`modals/modal${modalNumber}.html`);
            if (!response.ok) throw new Error('Modal nÃ£o encontrado');
            const content = await response.text();
            
            // Verifica se Ã© o modal3
            if (modalNumber === 3) {
                console.log('Modal 3 carregado, a funÃ§Ã£o setupSupportLink serÃ¡ chamada apÃ³s abertura');
                
                // Retornamos o conteÃºdo normal, a funÃ§Ã£o setupSupportLink serÃ¡ chamada em openModal
                return content;
            }
            
            return content;
        } catch (error) {
            console.error('Erro ao carregar modal:', error);
            return 'Este produto estÃ¡ bloqueado. Entre em contato para liberar o acesso.';
        }
    },

    init() {
        this.setupEventListeners();
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    modalModule.init();
});