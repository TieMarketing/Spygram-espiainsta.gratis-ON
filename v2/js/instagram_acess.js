import { setupThemeToggle } from './modules/eventHandlers.js';

// Adicionar estilos CSS para as novas classes
document.addEventListener('DOMContentLoaded', function() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .message-item {
            display: flex;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        
        .message-item.received {
            justify-content: flex-start;
        }
        
        .message-item.sent {
            justify-content: flex-end;
            flex-direction: row-reverse;
        }
        
        .message-avatar {
            margin-right: 8px;
            flex-shrink: 0;
        }
        
        .message-sender {
            font-size: 12px;
            color: #8e8e8e;
            margin-bottom: 2px;
        }
        
        .message-bubble {
            background-color: #262626;
            border-radius: 18px;
            padding: 8px 12px;
            max-width: 70%;
            word-wrap: break-word;
        }
        
        .message-item.sent .message-bubble {
            background-color: #0095f6;
            color: white;
        }
        
        .message-time {
            font-size: 11px;
            color: #8e8e8e;
            margin-top: 2px;
        }
    `;
    document.head.appendChild(styleElement);
});

// Definindo um objeto de fallback para mensagens de chat
const chatMessagesFallback = {
    chat1: {
        content: (contact) => `
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">Oi, tudo bem? Estou <span id="city">em sua cidade</span> hoje!</div>
                    <div class="message-time">01:15</div>
                </div>
            </div>
            <div class="message-item sent">
                <div>
                    <div class="message-bubble">Oi! Tudo bem e você?</div>
                    <div class="message-time">01:17 <i class="fas fa-check text-xs ml-1"></i></div>
                </div>
            </div>
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">Estou bem! Queria te mostrar umas fotos...</div>
                    <div class="message-time">01:18</div>
                </div>
            </div>
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="photo-message-container">
                        <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
                    </div>
                    <div class="message-time">01:20</div>
                </div>
            </div>
            <div class="blocked-messages-container">
                <div class="blocked-messages-notice">
                    <i class="fas fa-lock mr-2"></i>
                    <span>5 mensagens bloqueadas</span>
                </div>
                <button id="viewBlockedBtn" class="view-blocked-button">Ver mensagens</button>
            </div>
        `,
        status: 'Online agora',
        statusClass: 'text-green-500'
    },
    chat2: {
        content: (contact) => `
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">Ei, você viu aquela foto que te mandei?</div>
                    <div class="message-time">22:30</div>
                </div>
            </div>
            <div class="message-item sent">
                <div>
                    <div class="message-bubble">Ainda não, qual foto?</div>
                    <div class="message-time">22:32 <i class="fas fa-check text-xs ml-1"></i></div>
                </div>
            </div>
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">Aquela da festa de ontem à noite...</div>
                    <div class="message-time">22:33</div>
                </div>
            </div>
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="photo-message-container">
                        <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
                    </div>
                    <div class="message-time">22:34</div>
                </div>
            </div>
            <div class="blocked-messages-container">
                <div class="blocked-messages-notice">
                    <i class="fas fa-lock mr-2"></i>
                    <span>8 mensagens bloqueadas</span>
                </div>
                <button id="viewBlockedBtn" class="view-blocked-button">Ver mensagens</button>
            </div>
        `,
        status: 'Visto há 30 min',
        statusClass: 'text-gray-400'
    },
    chat3: {
        content: (contact) => `
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">Preciso te contar um segredo...</div>
                    <div class="message-time">15:45</div>
                </div>
            </div>
            <div class="message-item sent">
                <div>
                    <div class="message-bubble">Pode falar</div>
                    <div class="message-time">15:46 <i class="fas fa-check text-xs ml-1"></i></div>
                </div>
            </div>
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">É sobre aquela pessoa que você conhece...</div>
                    <div class="message-time">15:47</div>
                </div>
            </div>
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">Descobri algo que você não vai acreditar!</div>
                    <div class="message-time">15:48</div>
                </div>
            </div>
            <div class="blocked-messages-container">
                <div class="blocked-messages-notice">
                    <i class="fas fa-lock mr-2"></i>
                    <span>12 mensagens bloqueadas</span>
                </div>
                <button id="viewBlockedBtn" class="view-blocked-button">Ver mensagens</button>
            </div>
        `,
        status: 'Offline',
        statusClass: 'text-gray-400'
    }
};

// Usar o fallback diretamente
const chatMessages = chatMessagesFallback;

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

    // Remover TODOS os seguidores fictícios (elementos com cadeado)
    container.querySelectorAll('.story-item:not(.story-item-user)').forEach(el => {
        // Verifica se é um seguidor fictício (tem ícone de cadeado)
        if (el.querySelector('.fa-lock')) {
            el.remove();
        }
    });

    // Limpar também os stories dinâmicos anteriores antes de adicionar novos
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
        
        // Adiciona o novo story ao container
        container.appendChild(storyItem);
    });
    
    // Salvar os seguidores para uso nas mensagens diretas
    localStorage.setItem('realFollowers', JSON.stringify(followers));
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
    document.querySelectorAll('.contact-row').forEach(el => {
        el.addEventListener('click', () => {
            showAccessDialog('Para ver esta conversa, obtenha acesso Premium.');
        });
    });

    // Preencher username-conc
    const profileUsername = localStorage.getItem('profileUsername') || getCookieValue('profileUsername');
    document.querySelectorAll('.username-conc').forEach(el => {
        el.textContent = profileUsername || 'usuario';
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

// ———————— Efeito de "digitando" (sem alterações) ————————
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

// ———————— Funções de Direct Messages ————————
// IMPLEMENTAÇÃO SIMPLIFICADA PARA EVITAR TELA PRETA
function showDirectMessagesView() {
    if (!directMessagesView) {
        directMessagesView = document.createElement('div');
        directMessagesView.id = 'directMessagesView';
        directMessagesView.className = 'fixed inset-0 bg-black text-white z-50 flex flex-col';
    }
    
    // Conteúdo básico garantido
    directMessagesView.innerHTML = `
        <div class="flex items-center justify-between p-4 border-b border-gray-800">
            <button id="closeDirectBtn" class="text-white p-2">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 class="text-lg font-bold">Mensagens</h2>
        </div>
        <div class="contact-list flex-1 overflow-y-auto p-4">
            <!-- Contatos serão adicionados aqui -->
        </div>
    `;
    
    // Adicionar ao DOM se ainda não estiver
    if (!directMessagesView.parentNode) {
        document.body.appendChild(directMessagesView);
    }
    
    // Configurar botão de fechar
    const closeBtn = document.getElementById('closeDirectBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (directMessagesView) directMessagesView.style.display = 'none';
        });
    }
    
    // Exibir contatos simulados diretamente
    const contactList = directMessagesView.querySelector('.contact-list');
    if (contactList) {
        // Limpar qualquer conteúdo anterior
        contactList.innerHTML = '';
        
        // Tentar obter seguidores reais do localStorage
        let realFollowers = [];
        try {
            const savedFollowers = localStorage.getItem('realFollowers');
            if (savedFollowers) {
                realFollowers = JSON.parse(savedFollowers);
            }
        } catch (error) {
            console.error('Erro ao obter seguidores reais:', error);
        }
        
        // Mensagens padrão para os contatos
        const defaultMessages = [
            { message: 'Não consigo acreditar no que encontrei...', time: '12:45', unread: true },
            { message: 'Viu aquela postagem nova?', time: '10:30', unread: false },
            { message: 'Isso que você me mandou é mesmo real?', time: '09:15', unread: true },
            { message: 'Olá, como vai?', time: 'Ontem', unread: false },
            { message: 'Não deveria ter mandado aquela foto...', time: 'Ontem', unread: false }
        ];
        
        // Usar seguidores reais se disponíveis, caso contrário usar contatos simulados
        const contacts = realFollowers.length > 0 ? realFollowers.slice(0, 5).map((follower, index) => {
            return {
                username: follower.username,
                full_name: follower.full_name || follower.username,
                is_verified: follower.is_verified || Math.random() > 0.7,
                profile_pic_url: follower.profile_pic_url,
                ...defaultMessages[index % defaultMessages.length]
            };
        }) : [
            { username: 'julia_ferreira', full_name: 'Julia Ferreira', is_verified: true, message: 'Não consigo acreditar no que encontrei...', time: '12:45', unread: true },
            { username: 'marcos123', full_name: 'Marcos Oliveira', is_verified: false, message: 'Viu aquela postagem nova?', time: '10:30', unread: false },
            { username: 'carol.photo', full_name: 'Carolina Santos', is_verified: true, message: 'Isso que você me mandou é mesmo real?', time: '09:15', unread: true },
            { username: 'dev_pedro', full_name: 'Pedro Dev', is_verified: false, message: 'Olá, como vai?', time: 'Ontem', unread: false },
            { username: 'amanda.designs', full_name: 'Amanda Designs', is_verified: false, message: 'Não deveria ter mandado aquela foto...', time: 'Ontem', unread: false }
        ];
        
        contacts.forEach((contact, index) => {
            const isUnlocked = index < 3;
            const contactRow = document.createElement('div');
            contactRow.className = 'flex items-center p-3 border-b border-gray-800 relative';
            if (isUnlocked) contactRow.classList.add('clickable-contact');
            
            // Gerar HTML para o contato
            let profileImageHtml = '';
            if (contact.profile_pic_url) {
                const proxyUrl = getProxyImageUrl(contact.profile_pic_url);
                if (proxyUrl) {
                    profileImageHtml = `<img src="${proxyUrl}" alt="${contact.username}" class="w-full h-full object-cover rounded-full">`;
                } else {
                    profileImageHtml = `
                        <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                            <span class="text-white text-sm">${contact.username[0].toUpperCase()}</span>
                        </div>
                    `;
                }
            } else {
                profileImageHtml = `
                    <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                        <span class="text-white text-sm">${contact.username[0].toUpperCase()}</span>
                    </div>
                `;
            }
            
            contactRow.innerHTML = `
                <div class="w-12 h-12 relative mr-3">
                    ${!isUnlocked ? `
                        <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full z-10 flex items-center justify-center">
                            <i class="fas fa-lock text-white text-sm"></i>
                        </div>
                    ` : ''}
                    ${profileImageHtml}
                </div>
                <div class="flex-1">
                    <div class="flex items-center">
                        <span class="font-semibold ${blurTextClass}">${contact.full_name}</span>
                        ${contact.is_verified ? '<i class="fas fa-check-circle text-blue-500 text-xs ml-1"></i>' : ''}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <span class="truncate max-w-xs ${blurTextClass}">${contact.message}</span>
                        <span class="mx-1">·</span>
                        <span>${contact.time}</span>
                    </div>
                </div>
                <div class="text-blue-500">
                    ${contact.unread ? '<span class="h-3 w-3 bg-blue-500 rounded-full inline-block"></span>' : ''}
                </div>
            `;
            
            // Adicionar evento de clique
            contactRow.addEventListener('click', () => {
                if (isUnlocked) {
                    showChatView(contact, index);
                } else {
                    showTemporaryMessage('Este contato está bloqueado. Obtenha acesso Premium para desbloquear.');
                }
            });
            
            contactList.appendChild(contactRow);
        });
    }
    
    // Exibir a view
    directMessagesView.style.display = 'flex';
}

// Função simplificada para exibir chat
function showChatView(contact, index) {
    if (!chatView) {
        chatView = document.createElement('div');
        chatView.id = 'chatView';
        chatView.className = 'fixed inset-0 bg-black z-50 flex flex-col';
    }
    
    // Obter dados do chat
    let chatContent = '';
    let statusText = 'Online agora';
    let statusClass = 'text-green-500';
    
    // Gerar HTML para a imagem do contato
    let profileImageHtml = '';
    if (contact.profile_pic_url) {
        const proxyUrl = getProxyImageUrl(contact.profile_pic_url);
        if (proxyUrl) {
            profileImageHtml = `<img src="${proxyUrl}" alt="${contact.username}" class="w-full h-full object-cover rounded-full">`;
        } else {
            profileImageHtml = `
                <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                    <span class="text-white">${contact.username[0].toUpperCase()}</span>
                </div>
            `;
        }
    } else {
        profileImageHtml = `
            <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                <span class="text-white">${contact.username[0].toUpperCase()}</span>
            </div>
        `;
    }
    
    // Gerar HTML para a imagem do contato nas mensagens
    let messageAvatarHtml = '';
    if (contact.profile_pic_url) {
        const proxyUrl = getProxyImageUrl(contact.profile_pic_url);
        if (proxyUrl) {
            messageAvatarHtml = `<img src="${proxyUrl}" alt="${contact.username}" class="w-full h-full object-cover rounded-full">`;
        } else {
            messageAvatarHtml = `
                <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                    <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
                </div>
            `;
        }
    } else {
        messageAvatarHtml = `
            <div class="w-full h-full flex items-center justify-center bg-gray-600 rounded-full">
                <span class="text-white text-xs">${contact.username[0].toUpperCase()}</span>
            </div>
        `;
    }
    
    // Usar dados do chatMessages se disponíveis
    if (chatMessages && chatMessages[`chat${index + 1}`]) {
        const chatData = chatMessages[`chat${index + 1}`];
        // Usar a função content com o objeto contact como parâmetro
        if (typeof chatData.content === 'function') {
            chatContent = chatData.content(contact);
        } else if (typeof chatData.content === 'string') {
            chatContent = chatData.content;
        } else {
            chatContent = '';
        }
        statusText = chatData.status || statusText;
        statusClass = chatData.statusClass || statusClass;
    } else {
        // Conteúdo padrão se não houver dados específicos
        chatContent = `
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        ${messageAvatarHtml}
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">Olá, como você está?</div>
                    <div class="message-time">12:15</div>
                </div>
            </div>
            <div class="message-item sent">
                <div>
                    <div class="message-bubble">Estou bem, e você?</div>
                    <div class="message-time">12:17 <i class="fas fa-check text-xs ml-1"></i></div>
                </div>
            </div>
            <div class="message-item received">
                <div class="message-avatar">
                    <div class="w-8 h-8 rounded-full overflow-hidden">
                        ${messageAvatarHtml}
                    </div>
                </div>
                <div>
                    <div class="message-sender">${contact.full_name}</div>
                    <div class="message-bubble blurred-text-sm">Também estou bem! Viu aquela foto que te mandei?</div>
                    <div class="message-time">12:20</div>
                </div>
            </div>
            <div class="blocked-messages-container">
                <div class="blocked-messages-notice">
                    <i class="fas fa-lock mr-2"></i>
                    <span>5 mensagens bloqueadas</span>
                </div>
                <button id="viewBlockedBtn" class="view-blocked-button">Ver mensagens</button>
            </div>
        `;
    }
    
    // Construir interface do chat
    chatView.innerHTML = `
        <div class="flex flex-col h-full">
            <div class="p-4 border-b border-gray-800 flex items-center justify-between">
                <div class="flex items-center">
                    <button id="backChatButton" class="p-2 text-white">
                        <i class="fas fa-arrow-left text-xl"></i>
                    </button>
                    <div class="flex items-center ml-2">
                        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-200 to-pink-400 mr-2 relative">
                            ${profileImageHtml}
                        </div>
                        <div>
                            <div class="flex items-center">
                                <h1 class="text-lg font-bold text-white ${blurTextClass}">${contact.full_name}</h1>
                                ${contact.is_verified ? '<i class="fas fa-check-circle text-blue-500 text-xs ml-1"></i>' : ''}
                            </div>
                            <div class="text-xs ${statusClass}">${statusText}</div>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-4 text-white">
                    <i class="fas fa-phone"></i>
                    <i class="fas fa-video"></i>
                    <i class="fas fa-ellipsis-v"></i>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 chat-messages">
                ${chatContent}
            </div>

            <div class="p-3 border-t border-gray-800 chat-input-bar">
                <div class="flex items-center">
                    <button class="text-2xl text-blue-500 mr-3">
                        <i class="fas fa-plus-circle"></i>
                    </button>
                    <div class="flex-1 bg-gray-800 rounded-full py-2 px-4">
                        <input type="text" placeholder="Mensagem..." class="bg-transparent w-full text-white focus:outline-none">
                    </div>
                    <button class="text-xl text-blue-500 ml-3">
                        <i class="fas fa-microphone"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar ao DOM se necessário
    if (!chatView.parentNode) {
        document.body.appendChild(chatView);
    }
    
    // Ocultar a view de mensagens diretas
    if (directMessagesView) directMessagesView.style.display = 'none';
    
    // Exibir o chat
    chatView.style.display = 'flex';
    
    // Configurar eventos
    setupChatEvents();
}

// Configurar eventos do chat
function setupChatEvents() {
    // Botão de voltar
    const backButton = document.getElementById('backChatButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            if (chatView) chatView.style.display = 'none';
            if (directMessagesView) directMessagesView.style.display = 'flex';
        });
    }
    
    // Rolar para o fim da conversa
    const chatMessagesContainer = document.querySelector('.chat-messages');
    if (chatMessagesContainer) {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    
    // Botão de mensagens bloqueadas
    const viewBlockedBtn = document.getElementById('viewBlockedBtn');
    if (viewBlockedBtn) {
        viewBlockedBtn.addEventListener('click', showBlockedMessagesModal);
    }
    
    // Aplicar blur aos textos
    document.querySelectorAll('.blurred-text-sm').forEach(el => {
        el.style.filter = `blur(${blurLevel}px)`;
        el.addEventListener('click', handleBlurredContentClick);
    });
    
    // Outros botões mostram mensagem de recurso premium
    const premiumButtons = chatView.querySelectorAll('.fas.fa-phone, .fas.fa-video, .fas.fa-ellipsis-v, .fas.fa-plus-circle, .fas.fa-microphone');
    premiumButtons.forEach(btn => {
        const parent = btn.parentElement;
        if (parent) {
            parent.addEventListener('click', () => {
                showTemporaryMessage('Função disponível apenas para usuários Premium');
            });
        }
    });
    
    // Campo de entrada
    const inputField = chatView.querySelector('input');
    if (inputField) {
        inputField.addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                showTemporaryMessage('Envio de mensagens disponível apenas para usuários Premium');
            }
        });
    }
}

// Modal de mensagens bloqueadas
function showBlockedMessagesModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    modal.innerHTML = `
        <div class="bg-white dark:bg-black rounded-lg p-4 w-96">
            <h2 class="text-lg font-bold mb-2">Mensagens bloqueadas</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Você precisa do acesso Premium para visualizar essas mensagens.
            </p>
            <a class="cta_tracker" href="https://go.perfectpay.com.br/PPU38CPPF83">
                <button class="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg px-4 py-2 w-full">
                    Obter acesso Premium
                </button>
            </a>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.remove();
    });
}

// Função utilitária para adicionar UTMs a URLs
function buildURLWithUTMs(baseUrl) {
    // Implementação da função buildURLWithUTMs se necessário
    return baseUrl;
}

console.log('Script principal carregado e inicializado.');

