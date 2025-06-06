// Configurações do Upsell
const config = {
    proxyImagePath: 'https://proxy-server-git-main-devanuchihas-projects.vercel.app/api/proxy-image',
    analysisMessages: {
        'sinais_traicao': {
            alert: 'Detectamos padrões de comportamento suspeitos típicos de infidelidade neste perfil.',
            percentage: '99.3%',
            alertMessage: '<span class="font-bold">99.3%</span> dos perfis com esta proteção foram confirmados em casos de infidelidade.',
            unlockMessage: 'Após aceito, o script será automaticamente instalado no perfil do usuário.',
            price: {
                installments: {
                    times: 6,
                    value: 6.27
                },
                fullPrice: 97.00,
                discountPrice: 34.00
            }
        },
        'rastrear_perfil': {
            alert: 'Este perfil possui camadas avançadas de proteção que impedem o rastreamento convencional.',
            percentage: '97.8%',
            alertMessage: '<span class="font-bold">97.8%</span> dos perfis protegidos possuem atividades suspeitas ocultas.',
            unlockMessage: 'Após aceito, o acesso completo será liberado para este perfil.',
            price: {
                installments: {
                    times: 12,
                    value: 9.90
                },
                fullPrice: 197.00,
                discountPrice: 97.00
            }
        },
        'recuperacao_acesso': {
            alert: 'Identificamos métodos de recuperação alternativos disponíveis para este perfil.',
            percentage: '98.5%',
            alertMessage: '<span class="font-bold">98.5%</span> dos perfis podem ser recuperados usando nosso método avançado.',
            unlockMessage: 'Após aceito, iniciaremos o processo de recuperação do perfil.',
            price: {
                installments: {
                    times: 12,
                    value: 12.47
                },
                fullPrice: 297.00,
                discountPrice: 127.00
            }
        }
    },
    unlockSteps: [
        'Iniciando processo de desbloqueio...',
        'Analisando firewall do Instagram...',
        'Identificando camadas de proteção...',
        'Preparando script de desbloqueio...',
        'Quebrando firewall...',
        'Injetando script no perfil...',
        'Configurando acesso seguro...',
        'Finalizando processo...'
    ],
    countdownTime: 500 // 5 minutos em segundos
};

// Exportar para o escopo global
window.config = config;
