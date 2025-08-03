const API_BASE = 'https://proxy-server-git-main-devanuchihas-projects.vercel.app';

// Função para obter URL da imagem via proxy (reutilizada)
function getProxyImageUrl(originalUrl) {
  if (!originalUrl) return null;
  return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

// Funções auxiliares para cookies
function getProfileDataFromCookies() {
    return {
        username: Cookies.get('profileUsername') || 'usuario',
        picUrl: Cookies.get('profilePicUrl') || null,
        followers: Cookies.get('followerCount') || '0',
        following: Cookies.get('followingCount') || '0',
        analysisOption: Cookies.get('analysisOption') || 'rastrear_perfil'
    };
}

function saveProfileDataToCookies(profileData) {
    if (profileData.username) Cookies.set('profileUsername', profileData.username, { expires: 7 });
    if (profileData.picUrl) Cookies.set('profilePicUrl', profileData.picUrl, { expires: 7 });
    if (profileData.followers) Cookies.set('followerCount', profileData.followers, { expires: 7 });
    if (profileData.following) Cookies.set('followingCount', profileData.following, { expires: 7 });
    if (profileData.analysisOption) Cookies.set('analysisOption', profileData.analysisOption, { expires: 7 });
}

// Gerenciador de desbloqueio do Upsell
class UnlockManager {
    constructor() {
        this.currentStep = 0;
        this.isProcessing = false;
        this.configJson = null;

        // Carrega dados do cookie
        this.profileData = getProfileDataFromCookies();

        console.log('UnlockManager iniciado com dados:', this.profileData);

        // 1) Mostra nome, foto e contagens imediatamente, sem esperar o config
        this.renderProfile();

        // 2) Depois, carrega o config e, quando pronto, chama initializeProfile()
        this.loadConfig();
    }

    // Renderiza perfil com melhor tratamento de imagens
    renderProfile() {
        // Preenche o nome de usuário
        const displayUsername = this.profileData.username.startsWith('@') 
            ? this.profileData.username 
            : '@' + this.profileData.username;
        
        $('#profileUsername').text(displayUsername);

        // Carrega imagem de perfil
        this.loadProfileImage();

        // Preenche contagem de seguidores/seguindo
        $('#followerCount').text(this.formatCount(this.profileData.followers) + ' seguidores');
        $('#followingCount').text(this.formatCount(this.profileData.following) + ' seguindo');
    }

    // Função dedicada para carregar imagem de perfil
    loadProfileImage() {
        const $img = $('#profilePic');
        const originalUrl = this.profileData.picUrl;

        if (!originalUrl || !$img.length) {
            console.log('Sem URL de imagem ou elemento não encontrado, usando placeholder');
            $img.attr('src', 'https://placehold.co/150?text=Perfil');
            return;
        }

        const proxiedUrl = getProxyImageUrl(originalUrl);
        
        // Adiciona timestamp para evitar cache
        const finalUrl = proxiedUrl + '&t=' + Date.now();

        console.log('Carregando imagem de perfil:', finalUrl);

        // Configura handlers de carregamento
        $img.on('load', function() {
            console.log('Imagem de perfil carregada com sucesso');
        });

        $img.on('error', function() {
            console.error('Erro ao carregar imagem, usando placeholder');
            $(this).attr('src', 'https://placehold.co/150?text=Perfil');
        });

        $img.attr('src', finalUrl);
    }

    // Formata números grandes (ex: 1234 -> 1.2K)
    formatCount(count) {
        const num = parseInt(count) || 0;
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    async loadConfig() {
        try {
            console.log('Carregando config.json...');
            const response = await fetch('../../config.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            this.configJson = await response.json();
            console.log('Config carregado com sucesso:', this.configJson);

            // Só agora adiciona listeners e atualiza alerta
            this.setupEventListeners();
            this.initializeProfile();
        } catch (error) {
            console.error('Erro ao carregar config.json:', error);
            // Mesmo que dê erro, ainda podemos adicionar listeners
            this.setupEventListeners();
        }
    }

    async initializeProfile() {
        if (!this.configJson) {
            console.warn('Config não disponível, pulando inicialização do perfil');
            return;
        }

        // Atualiza a mensagem de alerta que depende do config
        const message = this.configJson.analysisMessages?.[this.profileData.analysisOption];
        if (message && message.alertMessage) {
            $('#alertMessage').html(message.alertMessage);
            console.log('Mensagem de alerta atualizada para:', this.profileData.analysisOption);
        } else {
            console.warn('Mensagem não encontrada para:', this.profileData.analysisOption);
        }
    }

    setupEventListeners() {
        // Remove listeners anteriores para evitar duplicação
        $(document).off('click', '#startUnlock');
        $(document).off('click', '#installButton');
        $(document).off('click', '#checkout');

        $(document).on('click', '#startUnlock', () => {
            if (!this.isProcessing) {
                console.log('Iniciando processo de desbloqueio...');
                this.isProcessing = true;
                this.startUnlockProcess().finally(() => {
                    this.isProcessing = false;
                });
            }
        });

        $(document).on('click', '#installButton', () => {
            if (!this.isProcessing) {
                console.log('Continuando instalação...');
                this.isProcessing = true;
                this.continueInstallation().finally(() => {
                    this.isProcessing = false;
                });
            }
        });

        $(document).on('click', '#checkout', (e) => {
            e.preventDefault();
            this.redirectToCheckout();
        });

        console.log('Event listeners configurados');
    }

    async startUnlockProcess() {
        if (!this.configJson) {
            console.error('Config não carregado, não é possível continuar');
            alert('Erro: Configuração não carregada. Tente recarregar a página.');
            return;
        }

        UI.initTerminal();

        const terminalSteps = [
            'Iniciando análise do sistema de proteção...',
            'Identificando camadas de segurança...',
            'Analisando firewall QuantumGuard™...',
            'Procurando vulnerabilidades...',
            'Preparando script de desbloqueio...',
            'Verificando compatibilidade...',
            'Script pronto para instalação!'
        ];

        for (let i = 0; i < terminalSteps.length; i++) {
            const percentage = (i + 1) * (100 / terminalSteps.length);
            await UI.addTerminalLine(terminalSteps[i]);
            UI.updateProgressBar(percentage, 'Analisando sistema...');
            await this.delay(Math.random() * 1000 + 500);
        }

        await UI.addTerminalLine('Deseja prosseguir com a instalação? [S/N]', 500, true);
        await this.delay(500);

        const message = this.configJson.analysisMessages?.[this.profileData.analysisOption];
        if (message && message.unlockMessage) {
            UI.showInstallState(message.unlockMessage);
        } else {
            UI.showInstallState('Script pronto para instalação!');
        }

        const installButton = document.getElementById('installButton');
        if (installButton) {
            installButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    async continueInstallation() {
        UI.hideInstallState();
        
        await UI.addTerminalLine('S', 500, true);
        await this.delay(800);

        const installSteps = [
            'Iniciando processo de instalação...',
            'Preparando payload do script...',
            'Quebrando primeira camada de proteção...',
            'Bypassando firewall QuantumGuard™...',
            'Injetando script no perfil...',
            'Configurando permissões...',
            'Ocultando rastros...',
            'Instalação concluída com sucesso!'
        ];

        for (let i = 0; i < installSteps.length; i++) {
            const percentage = (i + 1) * (100 / installSteps.length);
            await UI.addTerminalLine(installSteps[i]);
            UI.updateProgressBar(percentage, 'Instalando script...');
            await this.delay(Math.random() * 1000 + 800);
        }

        await this.delay(1000);
        
        // Salva dados atualizados nos cookies antes de mostrar estado final
        saveProfileDataToCookies(this.profileData);
        
        UI.showFinalState(this.profileData);
    }

    // Método para atualizar dados do perfil
    updateProfileData(newData) {
        this.profileData = { ...this.profileData, ...newData };
        saveProfileDataToCookies(this.profileData);
        this.renderProfile();
        console.log('Dados do perfil atualizados:', this.profileData);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    redirectToCheckout() {
        const finalUrl = this.buildFinalUrl();
        if (finalUrl) {
            console.log('Redirecionando para checkout:', finalUrl);
            window.location.href = finalUrl;
        } else {
            console.error('Não foi possível construir URL de checkout');
            alert('Erro ao gerar link de checkout. Tente novamente.');
        }
    }

    getUtmParameters() {
        const utmParams = {};
        const sources = [Cookies, localStorage];
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src'];

        sources.forEach(source => {
            utmKeys.forEach(key => {
                let value;
                if (source === Cookies) {
                    value = source.get(key);
                } else {
                    value = source.getItem(key);
                }
                if (value && !utmParams[key]) {
                    utmParams[key] = value;
                }
            });
        });

        // Aplica defaults do config se disponível
        if (this.configJson && this.configJson.utm_defaults) {
            Object.entries(this.configJson.utm_defaults).forEach(([key, value]) => {
                if (!utmParams[key] && value !== 'null' && value !== null) {
                    utmParams[key] = value;
                }
            });
        }

        console.log('Parâmetros UTM coletados:', utmParams);
        return utmParams;
    }

    buildFinalUrl() {
        if (!this.configJson || !this.configJson.links) {
            console.error('Config ou links não disponíveis');
            return '';
        }

        let baseUrl;
        switch(this.profileData.analysisOption) {
            case 'sinais_traicao':
                baseUrl = this.configJson.links.upsell_traicao;
                break;
            case 'recuperacao_acesso':
                baseUrl = this.configJson.links.upsell_recuperar;
                break;
            case 'rastrear_perfil':
                baseUrl = this.configJson.links.upsell_hackear;
                break;
            default:
                console.error('Opção de análise inválida:', this.profileData.analysisOption);
                baseUrl = this.configJson.links.upsell_hackear; // fallback
        }

        if (!baseUrl) {
            console.error('URL base não encontrada para:', this.profileData.analysisOption);
            return '';
        }

        try {
            const utmParams = this.getUtmParameters();
            const url = new URL(baseUrl);

            Object.entries(utmParams).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.append(key, value);
                }
            });

            return url.toString();
        } catch (error) {
            console.error('Erro ao construir URL:', error);
            return baseUrl; // retorna URL base sem parâmetros em caso de erro
        }
    }
}

// Inicializar quando o documento estiver pronto
$(document).ready(() => {
    console.log('Documento pronto, inicializando UnlockManager...');
    
    window.unlockManager = new UnlockManager();

    // Atualizar o link de checkout com parâmetros UTM
    setTimeout(() => {
        const checkoutLink = $('#checkout');
        if (checkoutLink.length && window.unlockManager) {
            const finalUrl = window.unlockManager.buildFinalUrl();
            if (finalUrl) {
                checkoutLink.attr('href', finalUrl);
                console.log('Link de checkout atualizado:', finalUrl);
            } else {
                console.warn('Não foi possível construir a URL final para o checkout.');
            }
        } else {
            if (!checkoutLink.length) console.warn('Elemento #checkout não encontrado no DOM.');
            if (!window.unlockManager) console.warn('UnlockManager não inicializado.');
        }
    }, 1000); // Aumentei para 1s para dar mais tempo ao config carregar
});