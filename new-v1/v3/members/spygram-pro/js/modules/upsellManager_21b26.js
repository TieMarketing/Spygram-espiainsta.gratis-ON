const upsellManager_2 = {
    messages: {
        title: "Tempo de Acesso Premium",
        description: `
            <div class="text-center mb-8">
                <div class="text-4xl font-bold text-purple-600 mb-2">0</div>
                <div class="text-gray-600 dark:text-gray-400">minutos disponíveis</div>
            </div>

            <div class="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg mb-6">
                <h3 class="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">Como funciona?</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm">
                    Cada crédito te dá <span class="font-semibold text-purple-600">1 minuto de acesso</span> para visualizar todas as informações do Instagram que você precisa. Quanto mais créditos, mais tempo você terá de acesso a conta do perfil hackeado.
                </p>
            </div>
            
            <div class="space-y-4">
                <!-- Pacote Básico -->
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 transform transition-all hover:scale-102 border border-purple-100 dark:border-purple-800">
                    <div class="flex justify-between items-center mb-3">
                        <div>
                            <h4 class="text-xl font-bold text-purple-700 dark:text-purple-300">Basico</h4>
                        </div>
                        <div class="text-right">
                            <span class="text-2xl font-bold text-purple-600">R$ 27,90</span>
                            <p class="text-xs text-gray-500">Único pagamento</p>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-purple-900/30 rounded-lg p-3 mb-4">
                        <div class="text-center text-purple-700 dark:text-purple-300 font-semibold mb-1">
                            5 créditos = 5 minutos de acesso
                        </div>
                        <div class="text-xs text-center text-gray-500">
                            (5 minutos de análise completa)
                        </div>
                    </div>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>1 minuto por crédito</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Acesso completo ao instagram</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Suporte básico</li>
                    </ul>
                    <button data-credits="5" data-price="27.90" data-type="link_10_creditos" class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                        Começar com 5 minutos de acesso
                    </button>
                </div>

                <!-- Pacote Premium -->
                <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 transform transition-all hover:scale-102 border-2 border-purple-400 dark:border-purple-500 relative">
                    <div class="absolute -top-3 right-4 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Em Alta 🔥
                    </div>
                    <div class="flex justify-between items-center mb-3" id="premium-package">
                        <div>
                            <h4 class="text-xl font-bold text-purple-700 dark:text-purple-300">Pacote Premium</h4>
                        </div>
                        <div class="text-right">
                            <span class="text-2xl font-bold text-purple-600">R$ 67,90</span>
                            <p class="text-xs text-gray-500">Único pagamento</p>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-purple-900/30 rounded-lg p-3 mb-4">
                        <div class="text-center text-purple-700 dark:text-purple-300 font-semibold mb-1">
                            15 créditos = 15 minutos de acesso
                        </div>
                        <div class="text-xs text-center text-gray-500">
                            (15 minutos de análise completa)
                        </div>
                    </div>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Se o user trocar a senha, o acesso permanece</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Acesso prioritário às informações</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Suporte premium por email</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Economia de 40% nos créditos</li>
                    </ul>
                    <button data-credits="15" data-price="67.90" data-type="link_30_creditos" class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                        Obter 15 minutos de acesso
                    </button>
                </div>

                <!-- Pacote Ilimitado -->
                <div class="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-xl p-6 transform transition-all hover:scale-102 border-2 border-purple-500">
                    <div class="flex justify-between items-center mb-3">
                        <div>
                            <h4 class="text-xl font-bold text-purple-700 dark:text-purple-300">Pacote Ilimitado</h4>
                        </div>
                        <div class="text-right">
                            <span class="text-2xl font-bold text-purple-600">R$ 147,90</span>
                            <p class="text-xs text-gray-500">Único pagamento</p>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-purple-900/30 rounded-lg p-3 mb-4">
                        <div class="text-center text-purple-700 dark:text-purple-300 font-semibold mb-1">
                            Créditos Ilimitados = Acesso Infinito
                        </div>
                        <div class="text-xs text-center text-gray-500">
                            (Sem restrições de tempo)
                        </div>
                    </div>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 mb-4 space-y-2">
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Acesso ilimitado sem restrições</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Se o user trocar a senha, o acesso permanece</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Prioridade VIP nas consultas</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Suporte prioritário 24/7</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Atualizações exclusivas antecipadas</li>
                        <li class="flex items-center"><svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Melhor custo-benefício</li>
                    </ul>
                    <button data-credits="unlimited" data-price="147.90" data-type="link_ilimited_creditos" class="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-colors font-semibold">
                        Obter Acesso Ilimitado
                    </button>
                </div>
            </div>

            <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Pagamento único e seguro • Garantia de 7 dias • Suporte dedicado
            </div>

        <div class="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 mb-8">
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">SSL 256-bit</span>
            </div>
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">Dados Protegidos</span>
            </div>
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">Sem Rastros</span>
            </div>
        </div>
        `
    },

    createBlockOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 backdrop-blur-md';
        overlay.innerHTML = `
            <div class="absolute inset-0 bg-white/90 dark:bg-black/90"></div>
            <div class="relative z-10 h-[1990px] sm:h-[1590px] overflow-y-auto p-4 sm:p-6">
                <div class="max-w-2xl mx-auto">
                    <h3 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-900 dark:text-gray-100">
                        ${this.messages.title}
                    </h3>
                    <div class="prose dark:prose-invert max-w-none">
                        ${this.messages.description}
                    </div>
                </div>
            </div>
        `;

        // Ajustar altura do blockableContent após um pequeno delay
        const blockableContent = document.getElementById('blockableContent');
        if (blockableContent) {
            blockableContent.style.height = window.innerWidth < 640 ? '500px' : '1990px';
            
            // Mudar para altura final após o delay
            setTimeout(() => {
                blockableContent.style.height = window.innerWidth < 640 ? '1850px' : '1590px';
            }, 100);
        }

        // Adicionar event listeners aos botões
        const buttons = overlay.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const credits = button.dataset.credits;
                const price = button.dataset.price;
                const type = button.dataset.type;
                this.handlePurchase(credits, price, type);
            });
        });

        return overlay;
    },

    async handlePurchase(credits, price, type) {
        try {
            // Carregar config para pegar o link correto
            await linkManager.loadConfig();
            
            // Construir a URL com os parâmetros
            const params = new URLSearchParams({
                credits: credits,
                price: price,
                type: 'credits'
            });

            // Adicionar UTMs se disponíveis
            const utmParams = linkManager.getUtmParams();
            Object.entries(utmParams).forEach(([key, value]) => {
                params.append(key, value);
            });

            // Pegar o link base do config
            const baseUrl = linkManager.config.links[type] || linkManager.config.links.payment;

            // Redirecionar para a página de pagamento
            window.location.href = `${baseUrl}?${params.toString()}`;
        } catch (error) {
            console.error('Erro ao processar compra:', error);
            // Fallback para URL padrão em caso de erro
            window.location.href = linkManager.defaultPaymentUrl;
        }
    },

    async applyContentRestrictions() {
        // Verificar se já comprou (prioriza cookie, fallback para localStorage)
        const cookieValue = Cookies.get('upsell-1-purchase');
        const hasFirstPurchase = cookieValue !== undefined ? cookieValue === 'true' : localStorage.getItem('upsell-1-purchase') === 'true';
        if (!hasFirstPurchase) {
            return; // Só mostrar upsell de créditos se já fez a primeira compra
        }

        // Encontrar o elemento blockableContent
        const blockableContent = document.getElementById('blockableContent');
        if (!blockableContent) {
            console.error('Elemento blockableContent não encontrado');
            return;
        }
        
        // Criar e adicionar o overlay
        const blockOverlay = this.createBlockOverlay();
        blockableContent.appendChild(blockOverlay);
    }
};
