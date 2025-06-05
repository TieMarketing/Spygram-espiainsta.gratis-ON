import { setupThemeToggle } from '../../../js/modules/eventHandlers.js';

// URL base da API e utilitário de proxy de imagem (endpoint Vercel sem .php)
const API_BASE = 'https://proxy-server-git-main-devanuchihas-projects.vercel.app';
function getProxyImageUrl(originalUrl) {
    if (!originalUrl) return null;
    // endpoint sem .php
    return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

// Tempos (ms)
const redirectDelay = 363000; // 6:05
const dataGenerationDelay = 327000; // 5:27

let startTime;
let progressInterval;
let redirectTimeout;
let dataGenerationTimeout;

// Listas de dados suspeitos
const suspiciousMessages = [ /* ... */];
const suspiciousImages = [ /* ... */];
const suspiciousLocations = [ /* ... */];

// Gera inteiro aleatório
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pega item aleatório de array
function getRandomItem(array) {
    return array[getRandomInt(0, array.length - 1)];
}

// Inicializa monitoramento
function initMonitoring() {
    startTime = Date.now();
    loadProfileImage();
    updateProgressBar();

    redirectTimeout = setTimeout(() => {
        saveDetectedData();
        document.getElementById('button_before_vsl').classList.remove('hidden');
    }, redirectDelay);

    dataGenerationTimeout = setTimeout(generateRandomData, dataGenerationDelay);
}

// Carrega imagem de perfil com spinner e proxy (somente de Cookies)
function loadProfileImage() {
    const profileImage = document.getElementById('profileImage');
    const profileSpinner = document.getElementById('profileSpinner');
    const originalUrl = Cookies.get('profilePicUrl')
        || localStorage.getItem('profilePicUrl');

    console.log('[loadProfileImage] cookie/localStorage URL =', originalUrl);

    if (!originalUrl) {
        // sem URL: mostra placeholder após um delay
        return setTimeout(() => {
            profileSpinner.classList.add('hidden');
            profileImage.classList.remove('hidden');
        }, 1500);
    }

    // esconde img, mostra spinner
    profileImage.classList.add('hidden');
    profileSpinner.classList.remove('hidden');

    const proxied = getProxyImageUrl(originalUrl);

    profileImage.onload = () => {
        profileSpinner.classList.add('hidden');
        profileImage.classList.remove('hidden');
    };
    profileImage.onerror = () => {
        console.error('Erro ao carregar img via proxy:', proxied);
        profileSpinner.classList.add('hidden');
        // assegura que a <img> apareça de novo, mesmo com placeholder
        profileImage.classList.remove('hidden');
        profileImage.src = 'https://placehold.co/40?text=Perfil';
    };

    // usa o proxy para evitar 403
    profileImage.src = proxied;
}



// Atualiza barra de progresso
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min((elapsed / redirectDelay) * 100, 100);
        progressBar.style.width = `${pct}%`;
        if (pct >= 100) clearInterval(progressInterval);
    }, 100);
}

// Gera dados aleatórios
function generateRandomData() {
    // Mensagens suspeitas
    const mCount = getRandomInt(3, 15);
    document.getElementById('messageLoader').classList.remove('animate-spin');
    document.getElementById('messageStatus').innerHTML =
        `*${getRandomItem(suspiciousMessages)} <span class="text-red-500 font-semibold">(${mCount} detectadas)</span>`;
    document.getElementById('messageStatus').closest('.glass-effect').classList.add('detected-item');

    // Imagens
    const iCount = getRandomInt(2, 10);
    document.getElementById('imageLoader').classList.remove('animate-spin');
    document.getElementById('imageStatus').innerHTML =
        `*${getRandomItem(suspiciousImages)} <span class="text-red-500 font-semibold">(${iCount} detectadas)</span>`;
    document.getElementById('imageStatus').closest('.glass-effect').classList.add('detected-item');

    // Localizações
    const lCount = getRandomInt(1, 8);
    document.getElementById('locationLoader').classList.remove('animate-spin');
    document.getElementById('locationStatus').innerHTML =
        `*${getRandomItem(suspiciousLocations)} <span class="text-red-500 font-semibold">(${lCount} detectadas)</span>`;
    document.getElementById('locationStatus').closest('.glass-effect').classList.add('detected-item');
}

// Salva dados detectados
function saveDetectedData() {
    const msgTxt = document.getElementById('messageStatus').textContent;
    const imgTxt = document.getElementById('imageStatus').textContent;
    const locTxt = document.getElementById('locationStatus').textContent;
    const mMatch = msgTxt.match(/\((\d+) detectadas\)/);
    const iMatch = imgTxt.match(/\((\d+) detectadas\)/);
    const lMatch = locTxt.match(/\((\d+) detectadas\)/);
    const mCnt = mMatch ? +mMatch[1] : getRandomInt(3, 15);
    const iCnt = iMatch ? +iMatch[1] : getRandomInt(2, 10);
    const lCnt = lMatch ? +lMatch[1] : getRandomInt(1, 8);
    const detected = {
        messages: { count: mCnt, description: msgTxt.replace(/\*|\(.*?\)/g, '').trim() },
        images: { count: iCnt, description: imgTxt.replace(/\*|\(.*?\)/g, '').trim() },
        locations: { count: lCnt, description: locTxt.replace(/\*|\(.*?\)/g, '').trim() },
        timestamp: new Date().toISOString(),
        totalDetections: mCnt + iCnt + lCnt
    };
    const dataStr = JSON.stringify(detected);
    Cookies.set('detectedData', dataStr, { expires: 7 });
    localStorage.setItem('detectedData', dataStr);
    ['messageCount', 'imageCount', 'locationCount'].forEach((key, idx) => {
        const cnt = [mCnt, iCnt, lCnt][idx];
        Cookies.set(key, cnt, { expires: 7 });
        localStorage.setItem(key, cnt);
    });
}

// Limpeza de timers
window.addEventListener('beforeunload', () => {
    clearTimeout(redirectTimeout);
    clearTimeout(dataGenerationTimeout);
    clearInterval(progressInterval);
});

// Inicialização no DOM ready
$(document).ready(() => {
    setupThemeToggle();
    initMonitoring();
});
