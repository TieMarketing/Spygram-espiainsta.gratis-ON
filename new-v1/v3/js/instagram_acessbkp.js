import { setupThemeToggle } from './modules/eventHandlers.js';


// ———————— Função utilitária para ler cookie ————————
function getCookieValue(name) {
    const cookies = document.cookie.replace(/\s+/g, '').split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name && cookieValue) {
            try {
                return decodeURIComponent(cookieValue);
            } catch (e) {
                console.warn(`Erro ao decodificar cookie ${name}:`, e);
                return cookieValue;
            }
        }
    }
    return null;
}

// ———————— Variáveis de estado ————————
let isOverlayVisible = false;
let hasClickedButton = false;
let isChangingAvatar = false;
let directMessagesView = null;
let chatView = null;
let currentChatContact = null;
const blurTextClass = 'blurred-text-sm'; // Classe para texto borrado
const blurImgClass = 'blurred-img-sm'; // Classe para imagem borrada (se necessário)
let isFullyLoaded = false;
let messageClickCount = 0;
let postClickCount = 0;
let blurLevel = 4; // Nível inicial de blur (ex: 4px)
let isProfilePrivate = false;

// URL base do seu proxy Vercel
const API_BASE = 'https://proxy-server-git-main-devanuchihas-projects.vercel.app';

// Elementos DOM frequentemente acessados
const limitedAccessOverlay = document.getElementById('limitedAccessOverlay');
let currentTemporaryMessage = null;

// ———————— Função para obter URL da imagem via Proxy ————————
function getProxyImageUrl(originalUrl) {
    if (!originalUrl || typeof originalUrl !== 'string') {
        console.warn('URL original da imagem inválida:', originalUrl);
        return '';
    }
    return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(originalUrl)}&t=${Date.now()}`;
}

// ———————— Inicialização ————————
document.addEventListener('DOMContentLoaded', function () {
    // ... (código de inicialização como antes: CTA, tema) ...
    setupThemeToggle();
    loadProfileData();
    setupTimers();
    setupEventListeners(); // Garante que os listeners para chat borrado sejam adicionados
    setTimeout(simulateTypingEffect, 3000);
});

// ———————— Carregar dados do perfil e Seguidores ————————
async function loadProfileData() {
    const profileUsername = localStorage.getItem('profileUsername') || getCookieValue('profileUsername');
    const profilePicUrl = localStorage.getItem('profilePicUrl') || getCookieValue('profilePicUrl');
    const isPrivateStr = localStorage.getItem('isPrivate') || getCookieValue('isPrivate');

    isProfilePrivate = isPrivateStr === 'true' || isPrivateStr === true;

    if (profileUsername) {
        console.log('Perfil carregado:', profileUsername);
        document.querySelectorAll('.username-conc').forEach(element => {
            element.textContent = profileUsername;
        });
        // Busca seguidores APÓS ter o username
        fetchAndDisplayFollowers(profileUsername);
    } else {
        console.warn('Username do perfil não encontrado.');
        // Limpa apenas os stories dinâmicos se não houver usuário
        clearDynamicStories();
    }

    if (profilePicUrl) {
        const profileNavImage = document.getElementById('profileNavImage');
        const storyUserImage = document.getElementById('storyUserImage');
        if (profileNavImage) {
            const proxyUrl = getProxyImageUrl(profilePicUrl);
            if (proxyUrl) {
                profileNavImage.onload = () => profileNavImage.classList.remove('hidden');
                profileNavImage.onerror = () => console.error('Erro ao carregar imagem de perfil principal via proxy.');
                profileNavImage.src = proxyUrl;
                if (storyUserImage) storyUserImage.src = proxyUrl;
            } else {
                 console.error('Não foi possível gerar URL de proxy para a imagem de perfil principal.');
            }
        }
    } else {
        console.warn('URL da foto de perfil não encontrada.');
    }

    setupProfileButton(isProfilePrivate);
    setupUserStoryEvents();
}

// ———————— Buscar e Exibir Seguidores (Mantendo Stories Estáticos) ————————
async function fetchAndDisplayFollowers(username) {
    const followers = await fetchFollowers(username);
    if (followers && followers.length > 0) {
        displayFollowers(followers);
    } else {
        console.log('Nenhum seguidor encontrado ou erro ao buscar.');
        // Não limpa o container, apenas não adiciona nada
    }
}

async function fetchFollowers(username) {
    if (!username) return [];
    const RAPIDAPI_KEY = '4f9decdf1cmsha8e3c875cf114cfp10297fjsnf1451941f64f'; // <-- Mova para backend!
    const url = `https://instagram-social-api.p.rapidapi.com/v1/followers?username_or_id_or_url=${encodeURIComponent(username)}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'instagram-social-api.p.rapidapi.com'
        }
    };
    try {
        console.log(`Buscando seguidores para ${username}...`);
        const response = await fetch(url, options);
        if (!response.ok) {
            console.error(`Erro da API de seguidores: ${response.status}`);
            const errorText = await response.text();
            console.error('Detalhe do erro:', errorText);
            return [];
        }
        const result = await response.json();
        console.log('Resposta da API de seguidores:', result);
        return result?.data?.items || [];
    } catch (error) {
        console.error('Erro ao buscar seguidores:', error);
        return [];
    }
}

// Função para limpar APENAS stories adicionados dinamicamente (seguidores)
function clearDynamicStories() {
    const container = document.getElementById('storiesContainer');
    if (container) {
        // Seleciona apenas os stories que foram adicionados dinamicamente (assumindo uma classe específica)
        container.querySelectorAll('.dynamic-story-item').forEach(el => el.remove());
    }
}

function displayFollowers(followers) {
    const container = document.getElementById('storiesContainer');
    if (!container) {
        console.error('Container de stories (#storiesContainer) não encontrado.');
        return;
    }

    // **MODIFICAÇÃO:** Limpa apenas os stories dinâmicos anteriores antes de adicionar novos
    clearDynamicStories();

    const followersToDisplay = followers.slice(0, 10);

    followersToDisplay.forEach(follower => {
        const storyItem = document.createElement('div');
        // Adiciona uma classe para identificar stories dinâmicos
        storyItem.className = 'story-item dynamic-story-item flex flex-col items-center space-y-1 flex-shrink-0';

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'story-circle w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600';
        const imageContainer = document.createElement('div');
        imageContainer.className = 'w-full h-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700';
        const img = document.createElement('img');
        img.alt = follower.username;
        img.className = 'w-full h-full object-cover';
        const proxyUrl = getProxyImageUrl(follower.profile_pic_url);

        if (proxyUrl) {
            img.onerror = () => {
                console.warn(`Erro ao carregar imagem para ${follower.username}, usando fallback.`);
                const fallbackLetter = follower.username ? follower.username[0].toUpperCase() : '?';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = 'w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-bold text-xl';
                fallbackDiv.textContent = fallbackLetter;
                imageContainer.innerHTML = '';
                imageContainer.appendChild(fallbackDiv);
            };
            img.src = proxyUrl;
            imageContainer.appendChild(img);
        } else {
            const fallbackLetter = follower.username ? follower.username[0].toUpperCase() : '?';
            const fallbackDiv = document.createElement('div');
            fallbackDiv.className = 'w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-bold text-xl';
            fallbackDiv.textContent = fallbackLetter;
            imageContainer.appendChild(fallbackDiv);
        }
        imageWrapper.appendChild(imageContainer);
        const usernameText = document.createElement('span');
        usernameText.className = 'text-xs text-center text-gray-800 dark:text-gray-200 truncate w-16';
        usernameText.textContent = follower.username || 'desconhecido';
        storyItem.appendChild(imageWrapper);
        storyItem.appendChild(usernameText);
        storyItem.addEventListener('click', () => {
            // Mantém o comportamento de mostrar diálogo de acesso premium para stories de seguidores
            showAccessDialog(`Visualizar story de ${follower.username} requer acesso Premium.`);
        });
        // **MODIFICAÇÃO:** Adiciona o novo story ao final do container, sem limpar o conteúdo existente
        container.appendChild(storyItem);
    });
}


// ———————— Botão de perfil (sem alterações) ————————
// ... (código de setupProfileButton e showProfileView como antes) ...
function setupProfileButton(isPrivate) {
    const profileButton = document.getElementById('profileButton');
    if (profileButton && isPrivate) {
        profileButton.classList.add('cursor-pointer', 'hover:opacity-80');
        profileButton.addEventListener('click', showProfileView);
    }
}

function showProfileView() {
    let profileView = document.getElementById('profileView');
    if (!profileView) {
        profileView = document.createElement('div');
        profileView.id = 'profileView';
        profileView.className = 'fixed inset-0 bg-black text-white z-50 overflow-auto';

        const profileUsername = localStorage.getItem('profileUsername') || getCookieValue('profileUsername') || 'usuario';
        const profilePicUrl = localStorage.getItem('profilePicUrl') || getCookieValue('profilePicUrl');
        const profileId = localStorage.getItem('profileId') || getCookieValue('profileId');

        let followerCount = '<i class="fas fa-spinner fa-spin"></i>';
        let followingCount = '<i class="fas fa-spinner fa-spin"></i>';
        let mediaCount = '<i class="fas fa-spinner fa-spin"></i>';

        let profileImageHtml = '';
        if (profilePicUrl) {
            const proxyUrl = getProxyImageUrl(profilePicUrl);
            if (proxyUrl) {
                 profileImageHtml = `<img src="${proxyUrl}" alt="Perfil" class="w-full h-full object-cover">`;
            } else {
                 profileImageHtml = `
                    <div class="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <i class="fas fa-user text-gray-500 dark:text-gray-400 text-2xl"></i>
                    </div>`;
            }
        } else {
            profileImageHtml = `
              <div class="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <i class="fas fa-user text-gray-500 dark:text-gray-400 text-2xl"></i>
              </div>`;
        }

        profileView.innerHTML = `
      <div class="p-4">
        <!-- Cabeçalho -->
        <div class="flex items-center justify-between mb-6">
          <button id="backButtonProfileView" class="p-2">
            <i class="fas fa-arrow-left text-xl"></i>
          </button>
          <h1 class="text-lg font-bold">${profileUsername}</h1>
          <button class="p-2"><i class="fas fa-ellipsis-v"></i></button>
        </div>

        <!-- Info perfil -->
        <div class="flex items-center mb-6">
          <div class="w-20 h-20 rounded-full overflow-hidden mr-6">${profileImageHtml}</div>
          <div class="flex space-x-4 text-center">
            <div>
              <p class="font-bold" id="mediaCountDisplay">${mediaCount}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Publicações</p>
            </div>
            <div>
              <p class="font-bold" id="followerCountDisplay">${followerCount}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Seguidores</p>
            </div>
            <div>
              <p class="font-bold" id="followingCountDisplay">${followingCount}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Seguindo</p>
            </div>
          </div>
        </div>

        <!-- Privacidade -->
        <div class="flex items-center mb-4">
          <div class="mr-3"><i class="fas fa-lock text-lg"></i></div>
          <div>
            <p class="font-bold">Essa conta é privada</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Siga esta conta para ver conteúdo.</p>
          </div>
        </div>

        <!-- Botão Editar -->
        <div class="mb-6">
          <button class="w-full glass-effect py-2 rounded-lg font-semibold">Editar</button>
        </div>

        <!-- Conteúdo bloqueado -->
        <div class="flex flex-col items-center justify-center p-6 border-t border-gray-800">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <i class="fas fa-lock text-gray-400 text-2xl"></i>
          </div>
          <p class="font-bold mb-1">Conta privada</p>
          <p class="text-center text-gray-500 dark:text-gray-400 mb-4">
            Obtenha acesso premium para ver o perfil completo.
          </p>
          <a class="cta_tracker" href="">
            <button class="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg px-4 py-2 w-full">
              Obter acesso completo R$ 37,90
            </button>
          </a>
        </div>
      </div>
    `;
        document.body.appendChild(profileView);
        document.getElementById('backButtonProfileView').addEventListener('click', () => profileView.remove());
        fetchProfileDataFromStorage();
    }
}

// ———————— Dados de perfil (sem alterações) ————————
function fetchProfileDataFromStorage() {
    const followerCount = localStorage.getItem('followerCount') || getCookieValue('followerCount') || '501';
    const followingCount = localStorage.getItem('followingCount') || getCookieValue('followingCount') || '1';
    const mediaCount = localStorage.getItem('mediaCount') || getCookieValue('mediaCount') || '8';
    updateProfileCounts(followerCount, followingCount, mediaCount);
}
function updateProfileCounts(followerCount, followingCount, mediaCount) {
    const followerDisplay = document.getElementById('followerCountDisplay');
    const followingDisplay = document.getElementById('followingCountDisplay');
    const mediaDisplay = document.getElementById('mediaCountDisplay');
    if (followerDisplay) followerDisplay.textContent = followerCount;
    if (followingDisplay) followingDisplay.textContent = followingCount;
    if (mediaDisplay) mediaDisplay.textContent = mediaCount;
}

// ———————— Eventos de Story (sem alterações) ————————
function setupUserStoryEvents() {
    const userStoryItem = document.querySelector('.story-item-user');
    if (userStoryItem) {
        userStoryItem.addEventListener('click', e => {
            e.preventDefault();
            showAccessDialog('Recurso disponível apenas para usuários PRO');
        });
    }
}

// ———————— Timers (fade-in) (sem alterações) ————————
function setupTimers() {
    setTimeout(() => {
        isFullyLoaded = true;
        // Ajustado para não afetar stories adicionados dinamicamente se já tiverem fade-in
        document.querySelectorAll('.message-row:not(.fade-in), .story-item:not(.fade-in):not(.dynamic-story-item)').forEach((el, i) => {
            setTimeout(() => el.classList.add('fade-in'), i * 100);
        });
    }, 1500);
}

// ———————— Listeners gerais (Revisado para garantir chat borrado) ————————
function setupEventListeners() {
    // Mensagens (Ícone)
    const messageIconContainer = document.querySelector('.message-icon-container');
    if (messageIconContainer) {
        messageIconContainer.addEventListener('click', () => {
            const messageIcon = messageIconContainer.querySelector('.message-icon');
            if (messageIcon) messageIcon.classList.add('message-icon-flash');
            setTimeout(() => messageIcon?.classList.remove('message-icon-flash'), 600);
            showDirectMessagesView();
        });
    }

    // Conteúdo de MENSAGEM borrado
    // **IMPORTANTE:** Certifique-se que suas mensagens de chat no HTML têm a classe 'blurred-text'
    // Se o chat for carregado dinamicamente, adicione este listener após carregar as mensagens.
    document.querySelectorAll('.blurred-text').forEach(el => {
        // Remove listener antigo para evitar duplicação se setupEventListeners for chamado mais de uma vez
        el.removeEventListener('click', handleBlurredContentClick);
        // Adiciona o listener
        el.addEventListener('click', handleBlurredContentClick);
        // Garante que o estilo inicial de blur seja aplicado
        el.style.filter = `blur(${blurLevel}px)`;
    });

    // Stories ESTÁTICOS borrados/restritos (os dinâmicos têm listener próprio)
    document.querySelectorAll('#storiesContainer .story-item:not(.dynamic-story-item) .story-circle').forEach(el => {
        el.removeEventListener('click', handleRestrictedContentClick);
        el.addEventListener('click', handleRestrictedContentClick);
    });

    // Contatos (sem alterações)
    // ... (código dos contatos como antes) ...
    document.querySelectorAll('.contact-row').forEach(el => {
        el.addEventListener('click', () => {
            showAccessDialog('Para ver esta conversa, obtenha acesso Premium.');
        });
    });
}

// ———————— Funções de blur / cliques (Restaurada e Verificada) ————————
function handleBlurredContentClick(event) {
    // 'this' se refere ao elemento clicado (o texto borrado)
    messageClickCount++;
    if (messageClickCount === 1) {
        this.style.filter = `blur(${blurLevel - 1}px)`; // Reduz um pouco o blur
        showTemporaryMessage('Clique novamente para tentar visualizar');
    } else if (messageClickCount === 2) {
        this.style.filter = `blur(${blurLevel - 2}px)`; // Reduz mais o blur
        showTemporaryMessage('Conteúdo parcialmente visível');
    } else {
        // Volta ao blur máximo e mostra diálogo
        this.style.filter = `blur(${blurLevel}px)`;
        showAccessDialog('Para ver conteúdo completo, obtenha acesso Premium');
        messageClickCount = 0; // Reseta contador
    }
}

function handleRestrictedContentClick() {
    // Lógica para stories estáticos/bloqueados
    postClickCount++;
    if (postClickCount >= 2) {
        showAccessDialog('Conteúdo completo só para Premium');
        postClickCount = 0;
    } else {
        showTemporaryMessage('Conteúdo bloqueado. Clique novamente para mais detalhes.');
    }
}

function showTemporaryMessage(message) {
    if (currentTemporaryMessage) {
        currentTemporaryMessage.remove();
        currentTemporaryMessage = null;
        clearTimeout(window.temporaryMessageTimeout);
    }
    const msg = document.createElement('div');
    msg.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md z-50 max-w-xs text-center shadow-lg';
    msg.textContent = message;
    document.body.appendChild(msg);
    currentTemporaryMessage = msg;
    window.temporaryMessageTimeout = setTimeout(() => {
        msg.classList.add('fade-out');
        setTimeout(() => {
            if (msg === currentTemporaryMessage) {
                msg.remove();
                currentTemporaryMessage = null;
            }
        }, 500);
    }, 3000);
}

function showAccessDialog(message) {
    const overlay = document.getElementById('limitedAccessOverlay');
    if (overlay) {
        const overlayMessage = overlay.querySelector('p');
        if (overlayMessage) overlayMessage.textContent = message;
        overlay.style.display = 'flex';
        isOverlayVisible = true;
        // Adicionar listener para fechar o overlay se necessário (ex: botão ou clique fora)
        // Exemplo: overlay.querySelector('.close-button').onclick = () => overlay.style.display = 'none';
    } else {
        alert(message);
    }
}

// ———————— Efeito de “digitando” (sem alterações) ————————
// ... (código de simulateTypingEffect como antes) ...
function simulateTypingEffect() {
    const messageRows = document.querySelectorAll('.message-row');
    if (!messageRows.length) return;
    const i = Math.floor(Math.random() * messageRows.length);
    const row = messageRows[i];
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'text-xs text-gray-500 mt-1 fade-in';
    typingIndicator.innerHTML = '<span class="inline-block animate-pulse">digitando...</span>';
    const textContainer = row.querySelector('.flex-1');
    if (textContainer) {
        // Verifica se já existe um indicador antes de adicionar outro
        if (!textContainer.querySelector('.animate-pulse')) {
            textContainer.appendChild(typingIndicator);
            setTimeout(() => {
                typingIndicator.remove();
                setTimeout(simulateTypingEffect, Math.random() * 15000 + 5000);
            }, Math.random() * 3000 + 2000);
        }
    }
}

// ———————— Salvar dados simulados (sem alterações) ————————
// ... (código de saveSimulatedData como antes) ...
function saveSimulatedData() {
    const simulatedData = {
        suspiciousMessages: {
            count: 5,
            descriptions: [
                "Mensagens contendo contexto sexual",
                "Mensagens com pedidos de encontro",
                "Compartilhamento de localização suspeita"
            ]
        },
        suspiciousLocations: {
            count: 3,
            locations: ["Local desconhecido", "Região suspeita", "Horário noturno"]
        },
        suspiciousContacts: {
            count: 2,
            riskLevel: "Alto"
        },
        lastActivity: "03:24 - Madrugada",
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('instagramAnalysis', JSON.stringify(simulatedData));
}
window.addEventListener('beforeunload', saveSimulatedData);


// ———————— Funções de Direct Messages (sem alterações significativas) ————————
// ... (código de showDirectMessagesView, closeDirectModal, displaySimulatedContacts como antes) ...
function showDirectMessagesView() {
    if (!directMessagesView) {
        directMessagesView = document.createElement('div');
        directMessagesView.id = 'directMessagesView';
        directMessagesView.className = 'fixed inset-0 bg-black text-white z-50 flex flex-col';
        directMessagesView.innerHTML = `
      <div class="flex items-center justify-between p-4 border-b border-gray-800">
        <button id="closeDirectBtnInternal" class="text-white p-2">
          <i class="fas fa-arrow-left"></i>
        </button>
        <h2 class="text-lg font-bold">Mensagens</h2>
        <div class="w-8"></div> <!-- Espaçador -->
      </div>
      <div class="contact-list flex-1 overflow-y-auto p-4">
        <p class="text-gray-500 text-center py-10">Carregando contatos...</p>
      </div>
    `;
        document.body.appendChild(directMessagesView);
        const closeBtnInternal = document.getElementById('closeDirectBtnInternal');
        if (closeBtnInternal) {
            closeBtnInternal.addEventListener('click', closeDirectModal);
        }
        displaySimulatedContacts();
    }
    directMessagesView.style.display = 'flex';
}

function closeDirectModal() {
    if (directMessagesView) {
        directMessagesView.style.display = 'none';
    }
    // Se houver uma view de chat aberta, feche-a também
    // if (chatView) {
    //     chatView.style.display = 'none';
    // }
}

function displaySimulatedContacts() {
    const contactList = directMessagesView.querySelector('.contact-list');
    if (!contactList) return;
    const contacts = [
        { username: 'amigo_proximo', profile_pic_url: '', last_message: 'Viu aquilo? 🤔', unread: true },
        { username: 'contato_novo', profile_pic_url: '', last_message: 'Obrigado pela ajuda!', unread: false },
        { username: 'grupo_familia', profile_pic_url: '', last_message: 'Foto enviada', unread: true },
    ];
    contactList.innerHTML = '';
    contacts.forEach(contact => {
        const contactRow = document.createElement('div');
        contactRow.className = 'contact-row flex items-center p-2 space-x-3 hover:bg-gray-800 rounded-lg cursor-pointer';
        const imageContainer = document.createElement('div');
        imageContainer.className = 'w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0';
        const fallbackLetter = contact.username ? contact.username[0].toUpperCase() : '?';
        imageContainer.innerHTML = `<div class="w-full h-full flex items-center justify-center text-gray-400 font-bold">${fallbackLetter}</div>`;
        const textContainer = document.createElement('div');
        textContainer.className = 'flex-1 min-w-0';
        const usernameP = document.createElement('p');
        usernameP.className = `font-semibold truncate ${contact.unread ? 'text-white' : 'text-gray-300'}`;
        usernameP.textContent = contact.username;
        const messageP = document.createElement('p');
        // **IMPORTANTE:** Adiciona a classe blurred-text aqui se estas mensagens devem ser borradas
        messageP.className = `text-sm truncate ${contact.unread ? 'text-white' : 'text-gray-500'} blurred-text`; // Adicionado blurred-text
        messageP.textContent = contact.last_message;
        textContainer.appendChild(usernameP);
        textContainer.appendChild(messageP);
        contactRow.appendChild(imageContainer);
        contactRow.appendChild(textContainer);
        if (contact.unread) {
            const unreadDot = document.createElement('div');
            unreadDot.className = 'w-2 h-2 bg-blue-500 rounded-full ml-auto';
            contactRow.appendChild(unreadDot);
        }
        contactRow.addEventListener('click', () => {
            showAccessDialog(`Para ver a conversa com ${contact.username}, obtenha acesso Premium.`);
        });
        contactList.appendChild(contactRow);
    });
    // **IMPORTANTE:** Reaplicar listeners para o conteúdo borrado APÓS adicionar os contatos
    setupEventListeners();
}


console.log('Script principal carregado e inicializado.');


