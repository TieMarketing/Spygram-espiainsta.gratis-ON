// Função para capturar parâmetros UTM da URL atual
function getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    
    // Lista de parâmetros UTM comuns
    const utmParamNames = [
        'utm_source', 
        'utm_medium', 
        'utm_campaign', 
        'utm_term', 
        'utm_content',
        'utm_id'
    ];
    
    // Captura todos os parâmetros UTM presentes na URL
    utmParamNames.forEach(param => {
        if (urlParams.has(param)) {
            utmParams[param] = urlParams.get(param);
        }
    });
    
    return utmParams;
}

// Função para adicionar parâmetros UTM a uma URL
function addUTMToURL(url) {
    const utmParams = getUTMParameters();
    
    // Se não houver parâmetros UTM, retorna a URL original
    if (Object.keys(utmParams).length === 0) {
        return url;
    }
    
    // Cria um objeto URL para manipular a URL de destino
    const targetUrl = new URL(url);
    const targetParams = targetUrl.searchParams;
    
    // Adiciona os parâmetros UTM à URL de destino
    Object.entries(utmParams).forEach(([key, value]) => {
        targetParams.set(key, value);
    });
    
    return targetUrl.toString();
}

// Função para modificar todos os links de checkout
function setupUTMRedirection() {
    // Seleciona todos os links com a classe cta_tracker
    document.querySelectorAll('a.cta_tracker').forEach(link => {
        // Salva a URL original
        const originalHref = link.getAttribute('href');
        
        // Modifica o comportamento do clique
        link.addEventListener('click', function(event) {
            // Previne o comportamento padrão do link
            event.preventDefault();
            
            // Adiciona os parâmetros UTM à URL original
            const newUrl = addUTMToURL(originalHref);
            
            // Redireciona para a nova URL
            window.location.href = newUrl;
        });
    });
}

// Adiciona o evento para configurar o redirecionamento quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    setupUTMRedirection();
});

