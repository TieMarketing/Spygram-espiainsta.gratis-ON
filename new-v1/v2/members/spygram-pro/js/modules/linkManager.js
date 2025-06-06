const linkManager = {
    // Cache do config.json
    config: null,

    // Mapeamento de análise para tipo de upsell
    upsellMap: {
        'sinais_traicao': 'upsell_traicao',
        'recuperar_senha': 'upsell_recuperar',
        'hackear_instagram': 'upsell_hackear'
    },

    // URL padrão de fallback
    defaultPaymentUrl: 'https://go.wolfpayment.com.br/rstgvrdpl0',

    // Carregar config.json
    async loadConfig() {
        if (!this.config) {
            try {
                const response = await fetch('../../config.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (!data || !data.links) {
                    throw new Error('Config inválido: links não encontrados');
                }
                this.config = data;
            } catch (error) {
                console.error('Erro ao carregar config.json:', error);
                // Configuração de fallback
                this.config = {
                    links: {
                        payment: this.defaultPaymentUrl,
                        upsell_traicao: this.defaultPaymentUrl,
                        upsell_recuperar: this.defaultPaymentUrl,
                        upsell_hackear: this.defaultPaymentUrl
                    }
                };
            }
        }
        return this.config;
    },

    // Pegar UTMs dos cookies
    getUtmParams() {
        const utmParams = {};
        const cookies = document.cookie.split(';');
        
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name.startsWith('utm_')) {
                utmParams[name] = value;
            }
        });

        // Se não houver UTMs nos cookies, usar os padrões do config
        if (Object.keys(utmParams).length === 0 && this.config && this.config.utm_defaults) {
            return this.config.utm_defaults;
        }

        return utmParams;
    },

    // Construir URL com UTMs
    buildUrl(baseUrl, utmParams) {
        try {
            const url = new URL(baseUrl);
            
            Object.entries(utmParams).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.append(key, value);
                }
            });

            return url.toString();
        } catch (error) {
            console.error('Erro ao construir URL:', error);
            return baseUrl;
        }
    },

    // Pegar URL final do upsell baseado na opção de análise
    async getUpsellUrl(analysisOption) {
        const config = await this.loadConfig();
        
        // Determinar qual link usar baseado na opção de análise
        const upsellType = this.upsellMap[analysisOption] || 'payment';
        const baseUrl = config?.links?.[upsellType] || this.defaultPaymentUrl;

        // Pegar UTMs dos cookies
        const utmParams = this.getUtmParams();

        // Construir URL final
        return this.buildUrl(baseUrl, utmParams);
    }
};
