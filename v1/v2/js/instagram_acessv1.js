import { setupThemeToggle } from './modules/eventHandlers.js';
import chatMessages from './chat_messages.js';

// ———————— Função utilitária para ler cookie ————————
function getCookieValue(name) {
    // Normalizar espaços e dividir cookies
    const cookies = document.cookie.replace(/\s+/g, '').split(';');

    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name && cookieValue) {
            try {
                return decodeURIComponent(cookieValue);
            } catch (e) {
                console.warn(`Erro ao decodificar cookie ${name}:`, e);
                return cookieValue; // Retorna sem decodificar se houver erro
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
const blurTextClass = 'blurred-text-sm';
const blurImgClass = 'blurred-img-sm';
let isFullyLoaded = false;
let messageClickCount = 0;
let postClickCount = 0;
let blurLevel = 4;
let isProfilePrivate = false;

const API_BASE = 'https://proxy-server-git-main-devanuchihas-projects.vercel.app';

// Elementos DOM frequentemente acessados
const limitedAccessOverlay = document.getElementById('limitedAccessOverlay');
let currentTemporaryMessage = null;

// ———————— Inicialização ————————
document.addEventListener('DOMContentLoaded', function () {
    // 1) Atualizar automaticamente o link do botão “.cta_tracker” com UTMs existentes
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign'];
    const cta = document.querySelector('.cta_tracker');
    if (cta && cta.href) {
    const finalUrl = buildURLWithUTMs(cta.href);
    cta.href = finalUrl;
    console.log('CTA atualizado:', finalUrl);
  }

    // 2) Configurar alternador de tema
    setupThemeToggle();

    // 3) Carregar dados do perfil
    loadProfileData();

    // 4) Timers e listeners
    setupTimers();
    setupEventListeners();

    // 5) Efeito de “digitando” nas mensagens
    setTimeout(simulateTypingEffect, 3000);

    // 6) Carregar seguidores para stories (se aplicável)
    loadFollowersForStories();
});

// ———————— Carregar dados do perfil ————————
function loadProfileData() {
    const profileUsername = localStorage.getItem('profileUsername') || getCookieValue('profileUsername');
    const profilePicUrl = localStorage.getItem('profilePicUrl') || getCookieValue('profilePicUrl');
    const isPrivateStr = localStorage.getItem('isPrivate') || getCookieValue('isPrivate');

    isProfilePrivate = isPrivateStr === 'true' || isPrivateStr === true;

    if (profileUsername) {
        console.log('Perfil carregado:', profileUsername);
    }

    if (profilePicUrl) {
        const profileNavImage = document.getElementById('profileNavImage');
        const storyUserImage = document.getElementById('storyUserImage');

        if (profileNavImage) {
            const proxyUrl = getProxyImageUrl(profilePicUrl);
            profileNavImage.onload = function () {
                profileNavImage.classList.remove('hidden');
                profileNavImage.classList.add('profile-image-loaded');
            };
            profileNavImage.src = proxyUrl;

            if (storyUserImage) {
                storyUserImage.src = proxyUrl;
            }
        }
    }

    setupProfileButton(isProfilePrivate);
    setupUserStoryEvents();

    function fillUsernameConc() {
        document.querySelectorAll('.username-conc').forEach(element => {
            element.textContent = profileUsername;
        });
    }
    if (profileUsername) fillUsernameConc();
}

// ———————— Botão de perfil ————————
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
            profileImageHtml = `<img src="${proxyUrl}" alt="Perfil" class="w-full h-full object-cover">`;
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
          <button id="backButton" class="p-2">
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
        document.getElementById('backButton').addEventListener('click', () => profileView.remove());

        if (profileId) {
            fetchProfileData(profileId);
        } else {
            console.log('profileId não encontrado; usando fallback');
            updateProfileCounts('501', '1', '8');
        }
    }
}

// ———————— Dados de perfil (API ou fallback) ————————
function fetchProfileData(profileId) {
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

// ———————— Eventos de Story ————————
function setupUserStoryEvents() {
    const userStoryItem = document.querySelector('.story-item-user');
    if (userStoryItem) {
        userStoryItem.addEventListener('click', e => {
            e.preventDefault();
            showAccessDialog('Recurso disponível apenas para usuários PRO');
        });
    }
}

// ———————— Timers (fade-in) ————————
function setupTimers() {
    setTimeout(() => {
        isFullyLoaded = true;
        document.querySelectorAll('.message-row, .story-item').forEach((el, i) => {
            setTimeout(() => el.classList.add('fade-in'), i * 100);
        });
    }, 1500);
}

// ———————— Listeners gerais ————————
function setupEventListeners() {
    // Mensagens
    const messageIconContainer = document.querySelector('.message-icon-container');
    if (messageIconContainer) {
        messageIconContainer.addEventListener('click', () => {
            const messageIcon = messageIconContainer.querySelector('.message-icon');
            messageIcon.classList.add('message-icon-flash');
            setTimeout(() => messageIcon.classList.remove('message-icon-flash'), 600);
            showDirectMessagesView();
        });
    }

    // Fechar DM
    const closeDirectBtn = document.getElementById('closeDirectBtn');
    if (closeDirectBtn) {
        closeDirectBtn.addEventListener('click', closeDirectModal);
    }

    // Conteúdo borrado
    document.querySelectorAll('.blurred-text').forEach(el => {
        el.addEventListener('click', handleBlurredContentClick);
    });

    // Imagens restritas / histórias
    document.querySelectorAll('.story-circle, .message-row').forEach(el => {
        el.addEventListener('click', handleRestrictedContentClick);
    });

    // Contatos
    document.querySelectorAll('.contact-row').forEach(el => {
        el.addEventListener('click', () => {
            showAccessDialog('Para ver esta conversa, obtenha acesso Premium.');
        });
    });

    // Preencher username-conc
    const profileUsername = localStorage.getItem('profileUsername') || getCookieValue('profileUsername');
    document.querySelectorAll('.username-conc').forEach(el => {
        el.textContent = profileUsername;
    });
}

// ———————— Funções de blur / cliques ————————
function handleBlurredContentClick(e) {
    messageClickCount++;
    if (messageClickCount === 1) {
        this.style.filter = 'blur(4px)';
        showTemporaryMessage('Clique novamente para tentar visualizar');
    } else if (messageClickCount === 2) {
        this.style.filter = 'blur(3px)';
        showTemporaryMessage('Conteúdo parcialmente visível');
    } else {
        showAccessDialog('Para ver conteúdo completo, obtenha acesso Premium');
        messageClickCount = 0;
    }
}

function handleRestrictedContentClick() {
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
    msg.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-md z-50 max-w-xs text-center';
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
    limitedAccessOverlay.style.display = 'none';
    isOverlayVisible = false;
    const overlayMessage = limitedAccessOverlay.querySelector('p');
    if (overlayMessage) overlayMessage.textContent = message;
}

// ———————— Efeito de “digitando” ————————
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
        textContainer.appendChild(typingIndicator);
        setTimeout(() => {
            typingIndicator.remove();
            setTimeout(simulateTypingEffect, Math.random() * 15000 + 5000);
        }, Math.random() * 3000 + 2000);
    }
}

// ———————— Salvar dados simulados ————————
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
    Cookies.set('instagramAnalysis', JSON.stringify(simulatedData), { expires: 7 });
}
window.addEventListener('beforeunload', saveSimulatedData);

// ———————— Funções de Direct Messages ————————
function showDirectMessagesView() {
    if (!directMessagesView) {
        directMessagesView = document.createElement('div');
        directMessagesView.id = 'directMessagesView';
        directMessagesView.className = 'fixed inset-0 bg-black text-white z-50 flex flex-col';
    }
    directMessagesView.innerHTML = `
    <div class="flex items-center justify-between p-4 border-b border-gray-800">
      <button id="closeDirectBtn" class="text-white p-2">
        <i class="fas fa-arrow-left"></i>
      </button>
      <h2 class="text-lg font-bold">Mensagens</h2>
    </div>
    <div class="contact-list flex-1 overflow-y-auto p-4"></div>
  `;
    if (!directMessagesView.parentNode) document.body.appendChild(directMessagesView);
    document.getElementById('closeDirectBtn').addEventListener('click', hideDirectMessagesView);
    populateDirectMessagesWithFollowers();
    directMessagesView.style.display = 'flex';
}
function hideDirectMessagesView() {
    if (directMessagesView) directMessagesView.style.display = 'none';
}
function populateDirectMessagesWithFollowers() {
    const container = document.getElementById('directMessagesView');
    if (!container) return;
    const profileId = localStorage.getItem('profileId') || getCookieValue('profileId');
    if (profileId) {
        fetch(`${API_BASE}/api/followers?user_id=${encodeURIComponent(profileId)}`)
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(({ followers }) => {
                const listContainer = container.querySelector('.contact-list');
                listContainer.innerHTML = '';
                followers.slice(0, 10).forEach((f, idx) =>
                    addFollowerToDirectMessages(f, listContainer, idx)
                );
            })
            .catch(err => {
                console.error('Erro ao buscar seguidores para DMs:', err);
                let cached = [];
                try {
                    cached = JSON.parse(localStorage.getItem('followersData') || getCookieValue('followersData')) || [];
                } catch { }
                if (cached.length) {
                    cached.slice(0, 10).forEach((f, i) =>
                        addFollowerToDirectMessages(f, listContainer, i)
                    );
                } else {
                    const generic = generateGenericFollowers();
                    generic.slice(0, 10).forEach((f, i) =>
                        addFollowerToDirectMessages(f, listContainer, i)
                    );
                }
            });
    } else {
        const generic = generateGenericFollowers();
        generic.slice(0, 10).forEach((f, i) =>
            addFollowerToDirectMessages(f, container.querySelector('.contact-list'), i)
        );
    }
}
function addFollowerToDirectMessages(follower, container, index) {
    const isUnlocked = index < 3;
    const contactRow = document.createElement('div');
    contactRow.className = 'flex items-center p-3 border-b border-gray-800 relative';
    contactRow.setAttribute('data-index', index);
    if (isUnlocked) contactRow.classList.add('clickable-contact');

    const username = follower.username || `user_${index + 1}`;
    const fullName = follower.full_name || username;
    const isVerified = follower.is_verified || false;
    const profilePicUrl = follower.profile_pic_url || 'https://randomuser.me/api/portraits/lego/1.jpg';
    const proxyImageUrl = getProxyImageUrl(profilePicUrl);

    const regularMessages = [
        'Viu aquela postagem nova?', 'Olá, como vai?', 'Você viu as minhas fotos?',
        'Adorei seu perfil!', 'Podemos conversar?', 'Vou te enviar uma imagem',
        'Preciso da sua opinião', 'Gostaria de colaborar?', 'Você tem Instagram?',
        'Conhece aquele filtro novo?'
    ];
    const provocativeMessages = [
        'Não consigo acreditar no que encontrei...', 'Isso que você me mandou é mesmo real?',
        'Não deveria ter mandado aquela foto...', 'Quer mesmo que eu te mostre tudo?',
        'Veja onde ela estava ontem à noite...', 'Tenho mais fotos daquele lugar secreto',
        'Apaga essa conversa depois de ver!', 'Isso está me deixando preocupada...',
        'Não mostra para ninguém o que te enviei', 'Melhor manter isso em segredo, ok?'
    ];
    const messages = isUnlocked ? provocativeMessages : regularMessages;
    const randomMessage = messages[index % messages.length];
    const hours = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    const time = `${hours}:${minutes}`;

    const lockIconHtml = !isUnlocked
        ? `
      <div class="absolute inset-0 bg-black bg-opacity-50 rounded-full z-10 flex items-center justify-center">
        <i class="fas fa-lock text-white text-sm"></i>
      </div>
      <div class="absolute inset-0 backdrop-blur-sm rounded-full z-0"></div>
    `
        : `
      <div class="absolute inset-0 bg-black bg-opacity-15 rounded-full z-10 flex items-center justify-center"></div>
      <div class="absolute inset-0 backdrop-blur-sm rounded-full z-0"></div>
    `;

    contactRow.innerHTML = `
    <div class="w-12 h-12 relative mr-3 contact-image-container">
      ${lockIconHtml}
      <div class="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center story-image-placeholder">
        <i class="fas fa-user text-gray-500 dark:text-gray-400 text-sm"></i>
      </div>
      <img src="${proxyImageUrl}" alt="${fullName}" class="w-full h-auto object-cover rounded-full contact-image hidden opacity-75 ${blurImgClass}">
    </div>
    <div class="flex-1">
      <div class="flex items-center">
        <span class="font-semibold ${blurTextClass}">${fullName}</span>
        ${isVerified ? '<i class="fas fa-check-circle text-blue-500 text-xs ml-1"></i>' : ''}
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
        <span class="truncate max-w-xs ${blurTextClass}">${randomMessage}</span>
        <span class="mx-1">·</span>
        <span>${time}</span>
      </div>
    </div>
    <div class="text-blue-500">
      ${isUnlocked && index === 0 ? '<span class="animate-pulse h-3 w-3 bg-red-500 rounded-full inline-block"></span>' : ''}
    </div>
  `;
    container.appendChild(contactRow);

    if (isUnlocked) {
        contactRow.addEventListener('click', () => {
            const followerWithIndex = { ...follower, data_index: index };
            showChatView(followerWithIndex);
        });
    } else {
        contactRow.addEventListener('click', () => {
            showTemporaryMessage('Este contato está bloqueado. Obtenha acesso Premium para desbloquear.');
        });
    }

    const contactImage = contactRow.querySelector('.contact-image');
    const imagePlaceholder = contactRow.querySelector('.story-image-placeholder');
    if (contactImage) {
        contactImage.onload = function () {
            contactImage.classList.remove('hidden');
            if (imagePlaceholder) imagePlaceholder.style.display = 'none';
        };
        contactImage.onerror = function () { };
        if (contactImage.complete) {
            contactImage.classList.remove('hidden');
            if (imagePlaceholder) imagePlaceholder.style.display = 'none';
        }
    }
}

function generateGenericFollowers() {
    const genericNames = [
        { username: 'julia_ferreira', full_name: 'Julia Ferreira', is_verified: true },
        { username: 'marcos123', full_name: 'Marcos Oliveira', is_verified: false },
        { username: 'carol.photo', full_name: 'Carolina Santos', is_verified: true },
        { username: 'dev_pedro', full_name: 'Pedro Dev', is_verified: false },
        { username: 'amanda.designs', full_name: 'Amanda Designs', is_verified: false },
        { username: 'bruno_tech', full_name: 'Bruno Tech', is_verified: false },
        { username: 'fitness_ana', full_name: 'Ana Fitness', is_verified: true },
        { username: 'travel.joao', full_name: 'João Viajante', is_verified: false },
        { username: 'mari.cook', full_name: 'Mari Cozinha', is_verified: false },
        { username: 'photo_lucas', full_name: 'Lucas Photographer', is_verified: false },
        { username: 'gamer_paula', full_name: 'Paula Games', is_verified: false },
        { username: 'rodrigo.music', full_name: 'Rodrigo Músico', is_verified: true },
        { username: 'fashion_bia', full_name: 'Bia Fashion', is_verified: false },
        { username: 'carlos.code', full_name: 'Carlos Programmer', is_verified: false },
        { username: 'art_camila', full_name: 'Camila Arts', is_verified: false },
        { username: 'leo_books', full_name: 'Leonardo Writer', is_verified: false },
        { username: 'vanessa.fit', full_name: 'Vanessa Fitness', is_verified: true },
        { username: 'daniel.web', full_name: 'Daniel WebDev', is_verified: false },
        { username: 'natalia.trek', full_name: 'Natália Adventure', is_verified: false },
        { username: 'chef_felipe', full_name: 'Felipe Chef', is_verified: false }
    ];

    return genericNames.map((user, index) => ({
        id: `generic_${index}`,
        username: user.username,
        full_name: user.full_name,
        is_verified: user.is_verified,
        profile_pic_url: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${(index % 8) + 1}.jpg`
    }));
}

function showBlockedContentMessage() {
    showTemporaryMessage('Conteúdo bloqueado. Obtenha acesso Premium para desbloquear.');
}

// ———————— Visualização de chat ————————
function showChatView(followerData) {
    if (!chatView) {
        chatView = document.createElement('div');
        chatView.id = 'chatView';
        chatView.className = 'fixed inset-0 bg-black z-50 flex flex-col';
    }
    currentChatContact = followerData;
    const username = followerData.username || 'user';
    const fullName = followerData.full_name || username;
    const displayName = fullName;
    const profilePicUrl = followerData.profile_pic_url || 'https://randomuser.me/api/portraits/lego/1.jpg';
    const isVerified = followerData.is_verified || false;
    const contactIndex = followerData.data_index !== undefined ? followerData.data_index : 0;

    let chatData = null;
    let chatContent = '';
    let statusText = 'Online agora';
    let statusClass = 'text-green-500';

    if (contactIndex === 0) {
        chatData = chatMessages.chat1;
        setTimeout(updateChatWithUserCity, 100);
    } else if (contactIndex === 1) {
        chatData = chatMessages.chat2;
    } else if (contactIndex === 2) {
        chatData = chatMessages.chat3;
    } else {
        chatContent = `
      <div class="message-item received">
        <div class="message-bubble blurred-text-sm">Lembra de mandar aquela foto de quando a gente estava na festa?</div>
        <div class="message-time">03:15</div>
      </div>
      <div class="message-item sent">
        <div class="message-bubble">Claro, acabei de encontrar aqui, vou te mandar agora</div>
        <div class="message-time">03:17 <i class="fas fa-check text-xs ml-1"></i></div>
      </div>
      <div class="message-item received">
        <div class="message-bubble blurred-text-sm">E aquele evento secreto também, não esquece!</div>
        <div class="message-time">03:18</div>
      </div>
      <div class="message-item received">
        <div class="photo-message-container">
          <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
        </div>
        <div class="message-time">03:20</div>
      </div>
      <div class="message-item sent">
        <div class="message-bubble">Enviado com sucesso</div>
        <div class="message-time">03:22 <i class="fas fa-check text-xs ml-1"></i></div>
      </div>
      <div class="blocked-messages-container">
        <div class="blocked-messages-notice">
          <i class="fas fa-lock mr-2"></i>
          <span>7 mensagens bloqueadas</span>
        </div>
        <button id="viewBlockedBtn" class="view-blocked-button">Ver mensagens</button>
      </div>
    `;
    }

    if (chatData) {
        chatContent = chatData.content;
        statusText = chatData.status || 'Online agora';
        statusClass = chatData.statusClass || 'text-green-500';
    }

    const profilePic = getProxyImageUrl(profilePicUrl);

    chatView.innerHTML = `
    <div class="flex flex-col h-full">
      <div class="p-4 border-b border-gray-800 flex items-center justify-between">
        <div class="flex items-center">
          <button id="backChatButton" class="p-2 text-white">
            <i class="fas fa-arrow-left text-xl"></i>
          </button>
          <div class="flex items-center ml-2">
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-200 to-pink-400 mr-2 relative">
              <img src="${profilePic}" alt="${username}" class="w-full h-full object-cover rounded-full ${blurImgClass}">
              ${isVerified ? '<i class="fas fa-check-circle text-blue-500 text-xs absolute bottom-0 right-0 bg-white rounded-full"></i>' : ''}
            </div>
            <div>
              <div class="flex items-center">
                <h1 class="text-lg font-bold text-white ${blurTextClass}">${displayName}</h1>
                ${isVerified ? '<i class="fas fa-check-circle text-blue-500 text-xs ml-1"></i>' : ''}
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
            <i class="fas fa-microfone"></i>
          </button>
        </div>
      </div>
    </div>
  `;

    if (!chatView.parentNode) {
        document.body.appendChild(chatView);
    } else {
        chatView.style.display = 'flex';
    }
    if (directMessagesView) directMessagesView.style.display = 'none';
    setupChatEvents();

    const viewBlockedBtn = chatView.querySelector('#viewBlockedBtn');
    if (viewBlockedBtn) viewBlockedBtn.addEventListener('click', showBlockedMessagesModal);
}

function setupChatEvents() {
    const backButton = document.getElementById('backChatButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            if (chatView) chatView.style.display = 'none';
            if (directMessagesView) directMessagesView.style.display = 'block';
        });
    }

    // Rolar pro fim
    const chatMessagesContainer = chatView.querySelector('.chat-messages');
    if (chatMessagesContainer) {
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    // Links do chat (telefone, vídeo, etc) mostram alerta
    const phoneButton = chatView.querySelector('.fas.fa-phone')?.parentElement;
    if (phoneButton) phoneButton.addEventListener('click', () => { showTemporaryMessage('Função apenas para usuários PRO'); });

    const videoButton = chatView.querySelector('.fas.fa-video')?.parentElement;
    if (videoButton) videoButton.addEventListener('click', () => { showTemporaryMessage('Função apenas para usuários PRO'); });

    const moreOptionsButton = chatView.querySelector('.fas.fa-ellipsis-v')?.parentElement;
    if (moreOptionsButton) moreOptionsButton.addEventListener('click', () => { showTemporaryMessage('Função apenas para usuários PRO'); });

    const inputField = chatView.querySelector('input[type="text"]');
    if (inputField) {
        inputField.addEventListener('click', () => { showTemporaryMessage('Função apenas para usuários PRO'); });
        inputField.addEventListener('focus', () => { showTemporaryMessage('Função apenas para usuários PRO'); inputField.blur(); });
    }

    const addMediaButton = chatView.querySelector('.fas.fa-plus-circle')?.parentElement;
    if (addMediaButton) addMediaButton.addEventListener('click', () => { showTemporaryMessage('Função apenas para usuários PRO'); });

    const micButton = chatView.querySelector('.fas.fa-microphone')?.parentElement;
    if (micButton) micButton.addEventListener('click', () => { showTemporaryMessage('Função apenas para usuários PRO'); });

    const photoButtons = chatView.querySelectorAll('.photo-button');
    photoButtons.forEach(btn => btn.addEventListener('click', () => showBlockedContentMessage()));

    const videoButtons = chatView.querySelectorAll('.video-button');
    videoButtons.forEach(btn => btn.addEventListener('click', () => showBlockedContentMessage()));

    const locationPreviews = chatView.querySelectorAll('.location-preview');
    locationPreviews.forEach(preview => preview.addEventListener('click', () => showBlockedContentMessage()));
}

function hideChatView() {
    if (chatView) chatView.style.display = 'none';
    if (directMessagesView) directMessagesView.style.display = 'block';
}

// ———————— Stories (seguidores) ————————
function loadFollowersForStories() {
    const profileId = localStorage.getItem('profileId') || getCookieValue('profileId');
    if (!isProfilePrivate && profileId) {
        console.log('Buscando seguidores para stories…');
        const storiesContainer = document.querySelector('.flex.space-x-4.px-4.min-w-max');
        storiesContainer.querySelectorAll('.story-item').forEach(s => s.remove());

        const spinner = document.createElement('div');
        spinner.id = 'storiesLoadingSpinner';
        spinner.className = 'flex items-center justify-center ml-4';
        spinner.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      <span class="ml-2 text-xs">Carregando seguidores...</span>
    `;
        storiesContainer.appendChild(spinner);

        fetch(`${API_BASE}/api/followers?user_id=${encodeURIComponent(profileId)}`)
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(({ followers }) => {
                spinner.remove();
                followers.slice(0, 10).forEach(f => addFollowerStory(f, storiesContainer));
                saveFollowersData(followers);
                console.log(`${followers.length} seguidores carregados.`);
            })
            .catch(err => {
                console.error('Erro ao buscar seguidores:', err);
                spinner.remove();
                addGenericStories(storiesContainer);
            });
    } else {
        console.log('Perfil privado ou sem profileId; pulando fetch de seguidores.');
    }
}

function saveFollowersData(followers) {
    try {
        localStorage.setItem('followersData', JSON.stringify(followers));
        Cookies.set('followersData', JSON.stringify(followers), { expires: 7 });
    } catch (e) {
        console.error('Erro salvando followersData:', e);
    }
}

function addFollowerStory(follower, container) {
    const storyItem = document.createElement('div');
    storyItem.className = 'story-item';

    const isVerified = follower.is_verified;
    const isPrivate = follower.is_private;
    const circleClass = isVerified ? 'story-circle verified-story' : 'story-circle';
    const profilePicUrl = follower.profile_pic_url || 'https://randomuser.me/api/portraits/lego/1.jpg';
    const proxyImageUrl = getProxyImageUrl(profilePicUrl);

    storyItem.innerHTML = `
    <div class="${circleClass}">
      <div class="story-image-container">
        ${isPrivate
            ? `<div class="story-blur-overlay"><i class="fas fa-lock text-sm"></i></div>`
            : ''
        }
        <div class="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center story-image-placeholder">
          <i class="fas fa-user text-gray-500 dark:text-gray-400 text-sm"></i>
        </div>
        <img src="${proxyImageUrl}" alt="${follower.username}" class="w-full h-full object-cover story-follower-image hidden">
      </div>
    </div>
    <span class="text-xs truncate w-16 text-center">
      ${follower.username.substring(0, 10)}${follower.username.length > 10 ? '…' : ''}
    </span>
    ${isVerified ? '<i class="fas fa-check-circle text-blue-500 text-xs absolute -right-1 bottom-6"></i>' : ''}
  `;
    storyItem.addEventListener('click', handleRestrictedContentClick);
    container.appendChild(storyItem);

    const followerImage = storyItem.querySelector('.story-follower-image');
    const imagePlaceholder = storyItem.querySelector('.story-image-placeholder');
    if (followerImage) {
        followerImage.onload = function () {
            if (imagePlaceholder) imagePlaceholder.style.display = 'none';
            followerImage.classList.remove('hidden');
            followerImage.classList.add('fade-in');
        };
        followerImage.onerror = function () {
            console.error(`Erro ao carregar imagem de ${follower.username}`);
        };
    }
    storeFollowerData(follower);
}

function storeFollowerData(follower) {
    try {
        const followersMap = JSON.parse(localStorage.getItem('followersMap') || getCookieValue('followersMap') || '{}');
        followersMap[follower.id] = {
            username: follower.username,
            full_name: follower.full_name,
            is_verified: follower.is_verified,
            is_private: follower.is_private,
            id: follower.id,
            timestamp: Date.now()
        };
        localStorage.setItem('followersMap', JSON.stringify(followersMap));
        Cookies.set('followersMap', JSON.stringify(followersMap));
    } catch (error) {
        console.error('Erro salvando followersMap:', error);
    }
}

function addGenericStories(container) {
    const storyNames = ['sofia_123', 'carlos.js', 'maria_dev', 'pedro_21', 'amanda.web'];
    storyNames.forEach((name, i) => {
        const storyItem = document.createElement('div');
        storyItem.className = 'story-item';
        storyItem.innerHTML = `
      <div class="story-circle">
        <div class="story-image-container">
          <div class="story-blur-overlay">
            <i class="fas fa-lock text-sm"></i>
          </div>
        </div>
      </div>
      <span class="text-xs truncate w-16 text-center">${name}</span>
    `;
        storyItem.addEventListener('click', handleRestrictedContentClick);
        container.appendChild(storyItem);
    });
}

// ———————— Proxy de imagem ————————
function getProxyImageUrl(originalUrl) {
    if (!originalUrl) return null;
    return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

// ———————— Modal de mensagens bloqueadas ————————
function showBlockedMessagesModal() {
  const baseUrl = 'https://go.perfectpay.com.br/PPU38CPPF83';
  const finalUrl = buildURLWithUTMs(baseUrl);

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
  modal.innerHTML = `
    <div class="bg-white dark:bg-black rounded-lg p-4 w-96">
      <h2 class="text-lg font-bold mb-2">Mensagens bloqueadas</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Você precisa do acesso Premium para visualizar essas mensagens.
      </p>
      <a class="cta_tracker" href="${finalUrl}">
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

// ———————— Geolocalização ————————
async function fetchUserLocation() {
    try {
        const response = await fetch('https://ipv4-check-perf.radar.cloudflare.com/');
        if (!response.ok) throw new Error('Falha ao obter localização');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao obter localização:', error);
        return null;
    }
}

function updateChatWithUserCity() {
    fetchUserLocation().then(locationData => {
        const cityElement = document.getElementById('city');
        if (cityElement) {
            if (locationData && locationData.city) {
                cityElement.textContent = `em ${locationData.city}`;
                localStorage.setItem('userCity', locationData.city);
            } else {
                const storedCity = localStorage.getItem('userCity');
                if (storedCity) {
                    cityElement.textContent = `em ${storedCity}`;
                } else {
                    cityElement.style.display = 'none';
                }
            }
        }
    });
}
