// Gerenciador de loading
export const loadingMessages = [
    "Estabelecendo conexÃ£o segura...",
    "Verificando disponibilidade...",
    "Iniciando processo..."
];

let currentMessageIndex = 0;
let messageInterval;

export function showLoading() {
    $('#loadingOverlay').css('display', 'flex').hide().fadeIn(300);
    
    messageInterval = setInterval(() => {
        currentMessageIndex = (currentMessageIndex + 1) % loadingMessages.length;
        $('#loadingText').fadeOut(200, function() {
            $(this).text(loadingMessages[currentMessageIndex]).fadeIn(200);
        });
    }, 1000);
}

export function hideLoading() {
    clearInterval(messageInterval);
    $('#loadingOverlay').fadeOut(300);
}