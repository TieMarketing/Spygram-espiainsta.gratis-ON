// analyse.js - Versão adaptada para a nova API Instagram-Social-API com correções de imagem

import { setupThemeToggle } from './modules/eventHandlers.js';

const API_BASE = 'https://proxy-server-git-main-devanuchihas-projects.vercel.app';

let analysisStarted = false;
let currentProfileIndex = 0;
let profiles = [];

// ======================================================
// NOVA FUNÇÃO PARA LIMPAR URLs DO INSTAGRAM
// ======================================================
function cleanInstagramUrl(url) {
  // Em vez de remover quase tudo, apenas devolvemos a URL bruta.
  return String(url || '');
}

// ======================================================
// NOVA FUNÇÃO PARA FETCH COM RETRY E TIMEOUT
// ======================================================
async function fetchImageWithRetry(url, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[fetchImageWithRetry] Tentativa ${attempt}/${maxRetries} para:`, url);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'image/*,*/*;q=0.8',
          'Cache-Control': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`[fetchImageWithRetry] Sucesso na tentativa ${attempt}`);
        return response;
      } else {
        console.warn(`[fetchImageWithRetry] Erro HTTP ${response.status} na tentativa ${attempt}`);
        if (attempt === maxRetries) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

    } catch (error) {
      console.warn(`[fetchImageWithRetry] Erro na tentativa ${attempt}:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Aguarda antes de tentar novamente (backoff exponencial)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// ======================================================
// FUNÇÃO CORRIGIDA PARA CARREGAR IMAGEM COM FALLBACK ROBUSTO
// ======================================================
async function loadProfileImage(container, profilePicUrl, username, fallbackLetter) {
  const spinnerWrapper = container.querySelector('.image-spinner');

  // 1) Se não houver URL, exibe fallback
  if (!profilePicUrl || typeof profilePicUrl !== 'string' || profilePicUrl.trim() === '') {
    if (spinnerWrapper) spinnerWrapper.remove();
    const fallback = document.createElement('div');
    fallback.className =
      'w-full h-full flex items-center justify-center ' +
      'bg-gradient-to-br from-purple-500 to-pink-500 ' +
      'text-white text-4xl font-bold';
    fallback.textContent = fallbackLetter;
    container.appendChild(fallback);
    return;
  }

  // 2) Tenta carregar diretamente primeiro (sem proxy)
  console.log(`[loadProfileImage] Tentando carregamento direto para ${username}:`, profilePicUrl);
  
  try {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous'; // Tenta carregar com CORS
    img.src = profilePicUrl;
    img.alt = `${username} Profile Picture`;
    img.className = 'w-full h-full object-cover transition-opacity duration-300';

    // Aguarda carregamento direto
    await new Promise((resolve, reject) => {
      img.onload = () => {
        console.log(`[loadProfileImage] Carregamento direto bem-sucedido para ${username}`);
        resolve();
      };
      img.onerror = () => {
        reject(new Error('Falha no carregamento direto'));
      };
      setTimeout(() => reject(new Error('Timeout no carregamento direto')), 5000);
    });

    // Se chegou aqui, o carregamento direto funcionou
    if (spinnerWrapper) spinnerWrapper.remove();
    container.appendChild(img);
    return;

  } catch (directError) {
    console.warn(`[loadProfileImage] Carregamento direto falhou para ${username}:`, directError.message);
    
    // 3) Fallback para o proxy com headers CORS corretos
    try {
      const cleanedUrl = cleanInstagramUrl(profilePicUrl);
      const proxyUrl = `${API_BASE}/api/proxy-image?url=${encodeURIComponent(cleanedUrl)}`;
      
      const response = await fetch(proxyUrl, { 
        method: 'GET',
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'omit', // Don't send credentials
        headers: {
          'Accept': 'image/*,*/*;q=0.8',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Proxy retornou HTTP ${response.status}`);
      }
      
      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.startsWith('image/')) {
        throw new Error(`Conteúdo não é imagem: ${contentType}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const img = document.createElement('img');
      img.src = objectUrl;
      img.alt = `${username} Profile Picture`;
      img.className = 'w-full h-full object-cover transition-opacity duration-300';

      await new Promise((resolve, reject) => {
        img.onload = () => {
          console.log(`[loadProfileImage] Proxy carregamento bem-sucedido para ${username}`);
          resolve();
        };
        img.onerror = () => {
          reject(new Error('Erro ao carregar imagem via proxy'));
        };
        setTimeout(() => reject(new Error('Timeout no proxy')), 10000);
      });

      if (spinnerWrapper) spinnerWrapper.remove();
      container.appendChild(img);
      return;

    } catch (proxyError) {
      console.warn(`[loadProfileImage] Proxy também falhou para ${username}:`, proxyError.message);
    }
  }

  // 4) Fallback final se tudo falhar
  console.log(`[loadProfileImage] Usando fallback final para ${username}`);
  if (spinnerWrapper) spinnerWrapper.remove();
  const fallback = document.createElement('div');
  fallback.className =
    'w-full h-full flex items-center justify-center ' +
    'bg-gradient-to-br from-purple-500 to-pink-500 ' +
    'text-white text-4xl font-bold';
  fallback.textContent = fallbackLetter;
  container.appendChild(fallback);
}
// ======================================================
// 1) FUNÇÃO PARA LIMPAR E VALIDAR UTMs
//    (permanece inalterada)
// ======================================================

function cleanAndValidateUTMs(queryString) {
  if (!queryString) return '';

  let cleaned = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  const params = new URLSearchParams();
  const pairs = cleaned.split('&');

  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value && !params.has(key)) {
      params.set(key, decodeURIComponent(value));
    }
  });

  const result = params.toString();
  return result ? '?' + result : '';
}

function getUTMQuery() {
  let utmQuery = window.location.search || '';
  utmQuery = cleanAndValidateUTMs(utmQuery);

  console.log('=== DEBUG UTMs DETALHADO ===');
  console.log('URL original:', window.location.href);
  console.log('window.location.search original:', window.location.search);
  console.log('UTMs limpos e validados:', utmQuery);

  if (!utmQuery) {
    const stored = sessionStorage.getItem('utmQuery');
    if (stored) {
      utmQuery = cleanAndValidateUTMs(stored);
      console.log('UTMs recuperados do sessionStorage:', utmQuery);
    }
  }

  if (!utmQuery && document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      if (referrerUrl.search) {
        utmQuery = cleanAndValidateUTMs(referrerUrl.search);
        console.log('UTMs extraídos do referrer:', utmQuery);
      }
    } catch (e) {
      console.warn('Erro ao processar referrer:', e);
    }
  }

  if (utmQuery) {
    sessionStorage.setItem('utmQuery', utmQuery);
    sessionStorage.setItem('utmQuery_timestamp', Date.now().toString());
  }

  console.log('UTMs finais a serem usados:', utmQuery);
  console.log('==============================');

  return utmQuery;
}

const utmQuery = getUTMQuery();

// ======================================================
// 2) FUNÇÃO PARA CRIAR URLs VÁLIDAS
//    (permanece inalterada)
// ======================================================

function createUrlWithUTMs(basePath) {
  const currentUTMs = getUTMQuery();

  let cleanBasePath = basePath;
  if (cleanBasePath.includes('?')) {
    const [path, existingQuery] = cleanBasePath.split('?');
    const existingParams = new URLSearchParams('?' + existingQuery);
    const utmParams = new URLSearchParams(currentUTMs);

    utmParams.forEach((value, key) => {
      existingParams.set(key, value);
    });

    cleanBasePath = path;
    const finalQuery = existingParams.toString();
    const finalUrl = cleanBasePath + (finalQuery ? '?' + finalQuery : '');

    console.log(`[createUrlWithUTMs] Base original: ${basePath}`);
    console.log(`[createUrlWithUTMs] Path limpo: ${cleanBasePath}`);
    console.log(`[createUrlWithUTMs] Query final: ${finalQuery}`);
    console.log(`[createUrlWithUTMs] URL final: ${finalUrl}`);

    return finalUrl;
  } else {
    const finalUrl = cleanBasePath + currentUTMs;

    console.log(`[createUrlWithUTMs] Base: ${cleanBasePath}`);
    console.log(`[createUrlWithUTMs] UTMs: ${currentUTMs}`);
    console.log(`[createUrlWithUTMs] Final: ${finalUrl}`);

    return finalUrl;
  }
}

// ======================================================
// 3) FUNÇÃO PARA REDIRECIONAMENTO SEGURO
//    (permanece inalterada)
// ======================================================

function safeRedirect(targetUrl) {
  console.log(`[safeRedirect] Iniciando redirecionamento para: ${targetUrl}`);

  const currentUTMs = getUTMQuery();
  if (currentUTMs) {
    sessionStorage.setItem('utmQuery_backup', currentUTMs);
    sessionStorage.setItem('utmQuery_backup_timestamp', Date.now().toString());
  }

  setTimeout(() => {
    console.log(`[safeRedirect] Executando redirecionamento: ${targetUrl}`);
    window.location.href = targetUrl;
  }, 100);
}

// ======================================================
// 4) FUNÇÕES ADAPTADAS PARA A NOVA API
// ======================================================

async function fetchProfileImages(username) {
  try {
    // 1) Exibe spinner e esconde texto inicial
    document.getElementById('profileSpinner').classList.remove('hidden');
    document.getElementById('profileInitial').classList.add('hidden');

    // ===================================================================
    // 2) PRIMEIRA TENTATIVA: busca múltiplos via `/v1/search_users`
    // ===================================================================
    const searchUrl = `${API_BASE}/api/search?username=${encodeURIComponent(username)}`;
    const searchResp = await fetch(searchUrl);

    console.log('[fetchProfileImages] status HTTP (search_users):', searchResp.status);
    let searchJson;
    try {
      searchJson = await searchResp.json();
    } catch {
      searchJson = null;
    }
    console.log('[fetchProfileImages] corpo do JSON recebido (search_users):', searchJson);

    // Agora verificamos se data.items existe e é array
    const hasItemsArray = searchResp.ok 
      && searchJson?.data 
      && Array.isArray(searchJson.data.items);
    const arrayVazio = hasItemsArray && searchJson.data.items.length === 0;

    if (hasItemsArray && searchJson.data.items.length > 0) {
      // NORMALIZA ATÉ 5 PERFIS vindos de data.items
      const rawList = searchJson.data.items.slice(0, 5);
      profiles = rawList.map(raw => ({
        username: raw.username || raw.user_name || raw.name || '',
        full_name: raw.full_name || raw.fullName || raw.display_name || raw.username || '',
        // aqui pegamos a melhor URL disponível
        profile_pic_url: raw.profile_pic_url_hd
          || raw.profile_pic_url
          || raw.profile_picture
          || raw.avatar_url
          || '',
        id: raw.pk ? raw.pk.toString()
          : raw.id ? raw.id.toString()
            : raw.user_id ? raw.user_id.toString()
              : '',
        is_private: raw.is_private === true || raw.private === true,
        is_verified: raw.is_verified === true || raw.verified === true
      }));

      console.log('[fetchProfileImages] Perfis normalizados (search_users):', profiles);

      await createCarouselSlots(profiles);
      showProfile(0);

      const modal = document.getElementById('confirmationModal');
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
      return;
    }

    // ===================================================================
    // 3) SE CHEGOU AQUI, search_users veio vazio (ou não retornou items)
    //    → TENTAMOS BUSCAR O PERFIL EXATO VIA `/v1/info`
    // ===================================================================
    const infoUrl = `${API_BASE}/api/info?username=${encodeURIComponent(username)}`;
    const infoResp = await fetch(infoUrl);

    console.log('[fetchProfileImages] status HTTP (info):', infoResp.status);
    let infoJson;
    try {
      infoJson = await infoResp.json();
    } catch {
      infoJson = null;
    }
    console.log('[fetchProfileImages] corpo do JSON recebido (info):', infoJson);

    const hasInfoObject = infoResp.ok && infoJson?.data && typeof infoJson.data === 'object';
    if (hasInfoObject) {
      const raw = infoJson.data;
      const normalizedProfile = {
        username: raw.username || '',
        full_name: raw.full_name || raw.username || '',
        profile_pic_url: raw.hd_profile_pic_url_info?.url
          || raw.profile_pic_url_hd
          || raw.profile_pic_url
          || '',
        id: raw.id ? raw.id.toString() : '',
        is_private: raw.is_private === true,
        is_verified: raw.is_verified === true
      };

      profiles = [normalizedProfile];
      console.log('[fetchProfileImages] Perfil normalizado (info):', normalizedProfile);

      await createCarouselSlots(profiles);
      showProfile(0);

      const modal = document.getElementById('confirmationModal');
      modal.style.display = 'flex';
      setTimeout(() => modal.classList.add('show'), 10);
      return;
    }

    // ===================================================================
    // 4) AQUI: NENHUM PERFIL ENCONTRADO
    // ===================================================================
    document.getElementById('profileSpinner').classList.add('hidden');
    document.getElementById('profileInitial').classList.remove('hidden');
    alert('Nenhum perfil encontrado para esse nome de usuário.');
  } catch (error) {
    console.error('[fetchProfileImages] Erro completo:', error);
    document.getElementById('profileSpinner').classList.add('hidden');
    document.getElementById('profileInitial').classList.remove('hidden');
    alert(`Erro ao carregar perfis: ${error.message || 'Tente novamente mais tarde.'}`);
  }
}

// ======================================================
// FUNÇÃO CREATECAROUSELSLOTS COMPLETAMENTE REESCRITA
// ======================================================
async function createCarouselSlots(profiles) {
  const track = document.getElementById('carouselTrack');
  const indicators = document.getElementById('carouselIndicatorsModal');
  track.innerHTML = '';
  indicators.innerHTML = '';

  profiles.forEach((profile, index) => {
    const slot = document.createElement('div');
    slot.className = 'flex-shrink-0 w-full flex flex-col items-center space-y-4';

    // Container circular
    const container = document.createElement('div');
    container.className = 'w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 relative';

    // Spinner lá dentro
    const spinnerWrapper = document.createElement('div');
    spinnerWrapper.className = 'absolute inset-0 flex items-center justify-center image-spinner';
    spinnerWrapper.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-solid border-purple-500 border-t-transparent"></div>
    `;
    container.appendChild(spinnerWrapper);

    slot.appendChild(container);
    track.appendChild(slot);

    const indicator = document.createElement('button');
    indicator.className = `
      w-2 h-2 rounded-full transition-colors duration-300
      ${index === 0 ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
    `;
    indicator.onclick = () => showProfile(index);
    indicators.appendChild(indicator);
  });

  const imagePromises = profiles.map(async (profile, index) => {
    const slot = track.children[index];
    const container = slot.firstElementChild;
    const fallbackLetter = profile.username && profile.username.length > 0 
      ? profile.username[0].toUpperCase() 
      : '?';

    try {
      await loadProfileImage(container, profile.profile_pic_url, profile.username, fallbackLetter);
    } catch (error) {
      console.error(`[createCarouselSlots] Erro crítico ao carregar imagem ${index}:`, error);
      // Fallback emergencial
      const spinner = container.querySelector('.image-spinner');
      if (spinner) spinner.remove();
      const emergencyFallback = document.createElement('div');
      emergencyFallback.className = 'w-full h-full flex items-center justify-center bg-gray-400 text-white text-4xl font-bold';
      emergencyFallback.textContent = '?';
      container.appendChild(emergencyFallback);
    }
  });

  await Promise.allSettled(imagePromises);
  console.log('[createCarouselSlots] Todas as imagens processadas');
}



function showProfile(index) {
  if (index < 0 || index >= profiles.length) return;
  currentProfileIndex = index;
  const profile = profiles[index];

  console.log(`[showProfile] Exibindo perfil ${index}:`, profile);

  document.getElementById('carouselTrack')
    .style.transform = `translateX(-${index * 100}%)`;

  Array.from(document.getElementById('carouselIndicatorsModal').children)
    .forEach((indicator, i) => {
      indicator.className = `
        w-2 h-2 rounded-full transition-colors duration-300
        ${i === index ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}
      `;
    });

  document.getElementById('modalUsername').textContent = '@' + profile.username;
  document.getElementById('modalFullName').textContent = profile.full_name || profile.username;
}

/**
 * A função fetchAndStoreFollowers permanece, mas caso você
 * adapte esse endpoint /api/followers em seu backend para
 * chamar a nova RapidAPI, verifique se a estrutura de retorno
 * segue algo como { followers: [...] }.
 */
async function fetchAndStoreFollowers(profileId) {
  try {
    console.log('[fetchAndStoreFollowers] Buscando seguidores para ID:', profileId);
    const url = `${API_BASE}/api/followers?user_id=${encodeURIComponent(profileId)}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn('[fetchAndStoreFollowers] Erro na resposta:', response.status, response.statusText);
      throw new Error(response.statusText);
    }

    const data = await response.json();
    console.log('[fetchAndStoreFollowers] Dados dos seguidores recebidos:', data);

    // Adapta para diferentes estruturas de resposta possíveis
    let followersArray = [];
    if (data.status === 'success' && Array.isArray(data.data)) {
      followersArray = data.data;
    } else if (Array.isArray(data.followers)) {
      followersArray = data.followers;
    } else if (Array.isArray(data.data)) {
      followersArray = data.data;
    } else if (Array.isArray(data)) {
      followersArray = data;
    }

    if (followersArray.length > 0) {
      const followers = followersArray.slice(0, 10);
      localStorage.setItem('followersData', JSON.stringify(followers));
      Cookies.set('followersData', JSON.stringify(followers));
      console.log('[fetchAndStoreFollowers] Seguidores salvos:', followers.length);
    } else {
      console.log('[fetchAndStoreFollowers] Nenhum seguidor encontrado');
    }
  } catch (err) {
    console.error('[fetchAndStoreFollowers] Erro ao buscar seguidores:', err);
    // Não bloqueia o fluxo se não conseguir buscar seguidores
  }
}

// ======================================================
// 5) SETUP JQUERY COM CORREÇÕES
// ======================================================

$(document).ready(function () {
  setupThemeToggle();

  const profileName = Cookies.get('profileName') || '';
  $('#profileName').text(profileName ? '@' + profileName : '');
  $('#profileInitial').text(profileName ? profileName[0].toUpperCase() : '');
  $('.progress-section').hide();
  $('#activityLog').hide();

  if (profileName) {
    console.log('[jQuery Ready] Iniciando busca para perfil:', profileName);
    fetchProfileImages(profileName);
  } else {
    console.log('[jQuery Ready] Nenhum nome de perfil encontrado nos cookies');
  }

  document.getElementById('prevProfile').addEventListener('click', () =>
    showProfile(currentProfileIndex - 1)
  );
  document.getElementById('nextProfile').addEventListener('click', () =>
    showProfile(currentProfileIndex + 1)
  );

  // ======================================================
  // BOTÃO "VOLTAR" - COM REDIRECIONAMENTO SEGURO
  // ======================================================
  document.getElementById('rejectProfile').addEventListener('click', () => {
    const targetUrl = createUrlWithUTMs('index.html');
    console.log('[BOTÃO VOLTAR] URL de destino:', targetUrl);
    safeRedirect(targetUrl);
  });

  // ======================================================
  // BOTÃO "CONFIRMAR PERFIL" - COM TRATAMENTO DE IMAGEM MELHORADO
  // ======================================================
  document.getElementById('confirmProfile').addEventListener('click', async () => {
    if (analysisStarted) return;
    const selected = profiles[currentProfileIndex];

    console.log('[CONFIRMAR PERFIL] Perfil selecionado:', selected);

    // Salva dados do perfil nos cookies e no localStorage
    Cookies.set('profileFullName', selected.full_name);
    Cookies.set('profileUsername', selected.username);
    Cookies.set('profilePicUrl', selected.profile_pic_url, { path: '/' });
    Cookies.set('profileId', selected.id);
    Cookies.set('isPrivate', selected.is_private);
    Cookies.set('isVerified', selected.is_verified);

    localStorage.setItem('profileId', selected.id);
    localStorage.setItem('isPrivate', selected.is_private);
    localStorage.setItem('isVerified', selected.is_verified);
    localStorage.setItem('profileUsername', selected.username);
    localStorage.setItem('profilePicUrl', selected.profile_pic_url);

    await fetchAndStoreFollowers(selected.id);

    // Exibe avatar no fluxo de análise com tratamento melhorado
    const profileImage = document.getElementById('profileImage');
    const profileSpinner = document.getElementById('profileSpinner');
    const profileInitial = document.getElementById('profileInitial');

    if (profileImage && profileSpinner && profileInitial) {
      try {
        if (selected.profile_pic_url && selected.profile_pic_url.trim() !== '') {
          const cleanedUrl = cleanInstagramUrl(selected.profile_pic_url);
          const proxyUrl = `${API_BASE}/api/proxy-image?url=${encodeURIComponent(cleanedUrl)}`;

          // Testa se a imagem carrega antes de definir como src
          await fetchImageWithRetry(proxyUrl);

          profileImage.onload = () => {
            profileSpinner.classList.add('hidden');
            profileInitial.classList.add('hidden');
            profileImage.classList.remove('hidden');
          };

          profileImage.onerror = () => {
            console.warn('[CONFIRMAR PERFIL] Erro ao carregar imagem do perfil, usando fallback');
            profileImage.classList.add('hidden');
            profileSpinner.classList.add('hidden');
            profileInitial.textContent = selected.username[0].toUpperCase();
            profileInitial.classList.remove('hidden');
          };

          profileImage.src = proxyUrl;
        } else {
          throw new Error('URL da imagem está vazia');
        }
      } catch (error) {
        console.log('[CONFIRMAR PERFIL] Usando fallback para avatar:', error.message);
        profileImage.classList.add('hidden');
        profileSpinner.classList.add('hidden');
        profileInitial.textContent = selected.username[0].toUpperCase();
        profileInitial.classList.remove('hidden');
      }
    }

    analysisStarted = true;
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
      $('.progress-section').fadeIn();
      $('#activityLog').fadeIn();
      startAnalysis();
    }, 300);
  });

  // ======================================================
  // CONFIGURAÇÃO DA ANÁLISE
  // ======================================================

  const analysisSteps = [
    { message: 'Iniciando conexão segura com servidores...', duration: 2000 },
    { message: 'Verificando existência do perfil...', duration: 3000 },
    { message: 'Acessando dados públicos...', duration: 2500 },
    { message: 'Analisando padrões de atividade...', duration: 3500 },
    { message: 'Verificando conexões e seguidores...', duration: 2800 },
    { message: 'Processando histórico de interações...', duration: 3200 },
    { message: 'Executando análise de vulnerabilidades...', duration: 4000 },
    { message: 'Preparando relatório detalhado...', duration: 3000 },
    { message: 'Aplicando protocolos de segurança...', duration: 2500 },
    { message: 'Finalizando processo de investigação...', duration: 2000 }
  ];

  let currentStep = 0;

  function addLog(message) {
    const logEntry = $('<div class="typewriter"></div>');
    $('#activityLog').append(logEntry);
    let i = 0;
    const typer = setInterval(() => {
      if (i < message.length) {
        logEntry.text(logEntry.text() + message[i++]);
        $('#activityLog').scrollTop($('#activityLog')[0].scrollHeight);
      } else {
        clearInterval(typer);
        logEntry.removeClass('typewriter');
      }
    }, 30);
  }

  function updateProgress(p) {
    $('#progressBar').css('width', p + '%');
    $('#progressPercentage').text(p + '%');
  }

  function updateStatus(text) {
    $('#statusText').text(text);
  }

  // ======================================================
  // FINALIZAÇÃO - REDIRECIONAMENTO PARA WATCH_VSL
  // ======================================================
  function startAnalysis() {
    if (currentStep >= analysisSteps.length) {
      console.log('[ANÁLISE FINALIZADA] Preparando redirecionamento final...');

      setTimeout(() => {
        const targetUrl = createUrlWithUTMs('../recuperar/watch_vsl/index.html');
        console.log('[REDIRECIONAMENTO FINAL] URL de destino:', targetUrl);

        console.log('=== DEBUG FINAL ===');
        console.log('UTMs atuais:', getUTMQuery());
        console.log('SessionStorage UTMs:', sessionStorage.getItem('utmQuery'));
        console.log('URL final construída:', targetUrl);
        console.log('==================');

        safeRedirect(targetUrl);
      }, 1500);
      return;
    }

    const step = analysisSteps[currentStep++];
    addLog(step.message);
    updateProgress(Math.round((currentStep / analysisSteps.length) * 100));
    updateStatus(step.message.replace('...', ''));
    setTimeout(startAnalysis, step.duration);
  }
});

// ======================================================
// 6) MONITORAMENTO DE ERROS E FALLBACKS
//    (permanece inalterada)
// ======================================================

window.addEventListener('beforeunload', function (e) {
  const currentUTMs = getUTMQuery();
  if (currentUTMs) {
    sessionStorage.setItem('utmQuery_final_backup', currentUTMs);
  }
});

// Log de inicialização
console.log('[analyse.js] Script inicializado com UTMs:', utmQuery);