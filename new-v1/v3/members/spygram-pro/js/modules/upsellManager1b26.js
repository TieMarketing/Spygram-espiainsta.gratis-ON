const upsellManager = {
    messages: {
        sinais_traicao: {
            title: "🔒 Autenticação em Duas Etapas Detectada",
            description: `
                <p class="mb-4 text-gray-800 dark:text-gray-100">Este perfil está protegido por um código extra que é enviado por e-mail ou SMS para o dono do perfil.</p>
                <p class="mb-4 text-gray-800 dark:text-gray-100 font-medium">Mas oque isso significa?</p>
                <p class="mb-4 text-gray-800 dark:text-gray-100">Significa que, além da senha padrão, o usuário dono do perfil recebe um código no e-mail ou SMS no celular para validar o acesso à conta.</p>
                <p class="mb-4 text-red-500 font-semibold">⚠️ ALERTA IMPORTANTE: 99.3% dos perfis com esta proteção foram confirmados em casos de infidelidade.</p>
                
                <p class="mb-4 text-gray-800 dark:text-gray-100">Mas não se preocupe... ainda dá para hackear!</p>

                <p class="mb-4 text-gray-800 dark:text-gray-100">Nossa equipe de programadores desenvolveu um sistema capaz de interceptar essa mensagem de forma anônima e captar o código para desbloquear e acessar o perfil sem que o usuário perceba!</p>

                <p class="text-xs font-mono text-gray-800 dark:text-gray-200 text-center mb-6">
                    Obs: Infelizmente só é possível acessar a conta selecionada utilizando o Sistema Interceptador Código
                </p>

                <p class="mb-4 bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg text-gray-800 dark:text-gray-100">⚡ <span class="font-semibold">Tempo Limitado:</span> Desbloqueie agora com 70% OFF</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Mais de 15.847 pessoas já desbloquearam seus perfis esta semana</p>
            `,
            buttonText: "DESBLOQUEAR AGORA COM 70% OFF"
        },
        rastrear_perfil: {
            title: "🔒 Autenticação em Duas Etapas Detectada",
            description: `
                <p class="mb-4 text-gray-800 dark:text-gray-100">Este perfil está protegido por um código extra que é enviado por e-mail ou SMS para o dono do perfil.</p>
                <p class="mb-4 text-gray-800 dark:text-gray-100 font-medium">Mas oque isso significa?</p>
                <p class="mb-4 text-gray-800 dark:text-gray-100">Significa que, além da senha padrão, o usuário dono do perfil recebe um código no e-mail ou SMS no celular para validar o acesso à conta.</p>
                <p class="mb-4 text-red-500 font-semibold">⚠️ ALERTA IMPORTANTE: 99.3% dos perfis com esta proteção foram confirmados em casos de infidelidade.</p>
                
                <p class="mb-4 text-gray-800 dark:text-gray-100">Mas não se preocupe... ainda dá para hackear!</p>

                <p class="mb-4 text-gray-800 dark:text-gray-100">Nossa equipe de programadores desenvolveu um sistema capaz de interceptar essa mensagem de forma anônima e captar o código para desbloquear e acessar o perfil sem que o usuário perceba!</p>

                <p class="text-xs font-mono text-gray-800 dark:text-gray-200 text-center mb-6">
                    Obs: Infelizmente só é possível acessar a conta selecionada utilizando o Sistema Interceptador Código
                </p>

                <p class="mb-4 bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg text-gray-800 dark:text-gray-100">⚡ <span class="font-semibold">Tempo Limitado:</span> Desbloqueie agora com 70% OFF</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Mais de 15.847 pessoas já desbloquearam seus perfis esta semana</p>
            `,
            buttonText: "DESBLOQUEAR AGORA COM 70% OFF"
        },
        recuperacao_acesso: {
            title: "🔒 Autenticação em Duas Etapas Detectada",
            description: `
                <p class="mb-4 text-gray-800 dark:text-gray-100">Este perfil está protegido por um código extra que é enviado por e-mail ou SMS para o dono do perfil.</p>
                <p class="mb-4 text-gray-800 dark:text-gray-100 font-medium">Mas oque isso significa?</p>
                <p class="mb-4 text-gray-800 dark:text-gray-100">Significa que, além da senha padrão, o usuário dono do perfil recebe um código no e-mail ou SMS no celular para validar o acesso à conta.</p>
                <p class="mb-4 text-red-500 font-semibold">⚠️ ALERTA IMPORTANTE: 99.3% dos perfis com esta proteção foram confirmados em casos de infidelidade.</p>
                
                <p class="mb-4 text-gray-800 dark:text-gray-100">Mas não se preocupe... ainda dá para hackear!</p>

                <p class="mb-4 text-gray-800 dark:text-gray-100">Nossa equipe de programadores desenvolveu um sistema capaz de interceptar essa mensagem de forma anônima e captar o código para desbloquear e acessar o perfil sem que o usuário perceba!</p>

                <p class="text-xs font-mono text-gray-800 dark:text-gray-200 text-center mb-6">
                    Obs: Infelizmente só é possível acessar a conta selecionada utilizando o Sistema Interceptador Código
                </p>

                <p class="mb-4 bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg text-gray-800 dark:text-gray-100">⚡ <span class="font-semibold">Tempo Limitado:</span> Desbloqueie agora com 70% OFF</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">Mais de 15.847 pessoas já desbloquearam seus perfis esta semana</p>
            `,
            buttonText: "DESBLOQUEAR AGORA COM 70% OFF"
        }
    },

    getBlockMessage(analysisOption) {
        // Verificar se a opção existe nos messages, senão usar rastrear_perfil como padrão
        return this.messages[analysisOption] || this.messages.rastrear_perfil;
    },

    createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 backdrop-blur-md';
        overlay.innerHTML = `
            <div class="absolute inset-0 bg-white/90 dark:bg-black/90"></div>
            <div class="relative z-10 h-full flex flex-col items-center justify-center p-4">
                <!-- Spinner -->
                <div class="w-16 h-16 mb-8">
                    <svg class="animate-spin w-full h-full text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                
                <!-- Texto -->
                <div class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">
                    Acessando perfil, aguarde...
                </div>
                
                <!-- Progress Bar Container -->
                <div class="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div id="progressBar" class="bg-purple-500 h-2.5 rounded-full transition-all duration-100" style="width: 0%"></div>
                </div>
                
                <!-- Progress Text -->
                <div id="progressText" class="text-sm text-gray-600 dark:text-gray-400">
                    0%
                </div>
            </div>
        `;
        return overlay;
    },

    createBlockOverlay(analysisOption) {
        const message = this.getBlockMessage(analysisOption);
        const overlay = document.createElement('div');
        overlay.className = 'absolute inset-0 backdrop-blur-md';
        
        // Criar elemento temporário para o botão
        const tempButton = document.createElement('button');
        tempButton.className = 'w-full sm:w-auto transform hover:scale-105 transition-transform px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl text-sm sm:text-base';
        tempButton.textContent = message.buttonText;
        
        // Configurar o onclick do botão após obter a URL
        linkManager.getUpsellUrl(analysisOption).then(url => {
            tempButton.onclick = () => window.location.href = url;
        });

        overlay.innerHTML = `
            <div class="absolute inset-0 bg-white/90 dark:bg-black/90"></div>
            <div class="relative z-10 h-[1240px] sm:h-[1020px] overflow-y-auto p-4 sm:p-6">
                <div class="max-w-2xl mx-auto">
                    <h3 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">${message.title}</h3>
                    <div class="prose dark:prose-invert max-w-none">
                        ${message.description}
                    </div>
                    <div id="upsellButton" class="mt-6 sm:mt-8 flex justify-center">
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar o botão depois que o overlay for criado
        overlay.querySelector('#upsellButton').appendChild(tempButton);

        // Ajustar altura do blockableContent após um pequeno delay
        const blockableContent = document.getElementById('blockableContent');
        if (blockableContent) {
            blockableContent.style.height = window.innerWidth < 640 ? '500px' : '750px';
            
            // Mudar para altura final após o delay
            setTimeout(() => {
                blockableContent.style.height = window.innerWidth < 640 ? '1240px' : '750px';
            }, 100);
        }
        
        return overlay;
    },

    init() {
        if (typeof linkManager === 'undefined') {
            console.error('linkManager não está definido. Certifique-se de que linkManager.js está carregado antes do upsellManager.js');
            return;
        }
        // Inicialização normal continua aqui...
    },

    async applyContentRestrictions() {
        // Encontrar o elemento blockableContent
        const blockableContent = document.getElementById('blockableContent');
        if (!blockableContent) {
            console.error('Elemento blockableContent não encontrado');
            return;
        }
        
        // Remover qualquer blur anterior do conteúdo
        blockableContent.classList.remove('blur-md');
        
        // Primeiro mostrar o loading
        const loadingOverlay = this.createLoadingOverlay();
        blockableContent.appendChild(loadingOverlay);
        
        // Atualizar a progress bar durante 15 segundos
        const progressBar = loadingOverlay.querySelector('#progressBar');
        const progressText = loadingOverlay.querySelector('#progressText');
        const duration = 15000; // 15 segundos
        const interval = 100; // Atualizar a cada 100ms
        const steps = duration / interval;
        let currentStep = 0;
        
        await new Promise(resolve => {
            const timer = setInterval(() => {
                currentStep++;
                const progress = (currentStep / steps) * 100;
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${Math.round(progress)}%`;
                
                if (currentStep >= steps) {
                    clearInterval(timer);
                    resolve();
                }
            }, interval);
        });
        
        // Remover o loading e mostrar o overlay de bloqueio
        loadingOverlay.remove();
        
        // Pegar a opção de análise (prioriza cookies, fallback para localStorage)
        let analysisOption;
        const profileData = cookieManager.loadProfileData();
        if (profileData && profileData.analysisOption) {
            analysisOption = profileData.analysisOption;
        } else {
            analysisOption = localStorage.getItem('analysisOption');
        }
        const blockOverlay = this.createBlockOverlay(analysisOption);
        blockableContent.appendChild(blockOverlay);
    }
};
