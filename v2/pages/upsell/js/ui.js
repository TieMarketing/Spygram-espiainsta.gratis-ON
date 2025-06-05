// URL base da API/Proxy
const PROXY_API_BASE = 'https://proxy-server-git-main-devanuchihas-projects.vercel.app';

function getProxyImageUrl(originalUrl) {
  if (!originalUrl) return null;
  return `${PROXY_API_BASE}/api/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

// Função para obter URL da imagem de perfil do cookie
function getProfileImageFromCookie() {
  const profilePicUrl = Cookies.get('profilePicUrl');
  console.log('Cookie profilePicUrl encontrado:', profilePicUrl);
  return profilePicUrl || null;
}

// Função para salvar URL da imagem no cookie
function saveProfileImageToCookie(imageUrl) {
  if (imageUrl) {
    Cookies.set('profilePicUrl', imageUrl, { expires: 7 }); // Expira em 7 dias
    console.log('URL da imagem salva no cookie:', imageUrl);
  }
}

// UI Manager
const UI = {
  createProgressBar() {
    return `
      <div class="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div id="progressBar" class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
      </div>
      <p id="progressText" class="text-center text-sm text-gray-400"></p>
    `;
  },

  updateProgressBar(percentage, text) {
    $('#progressBar').css('width', percentage + '%');
    $('#progressText').text(text || '');
  },

  createPriceSection(price) {
    return `
      <div class="text-center space-y-4">
        <div class="text-2xl font-bold">
          ${price.installments.times}x de R$${price.installments.value.toFixed(2)}
        </div>
        <div class="text-gray-500">
          ou R$${price.discountPrice.toFixed(2)} à vista
        </div>
        <a id="checkout" href="#" class="block w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105">
          Ativar Agora
        </a>
      </div>
    `;
  },

  initTerminal() {
    $('#initialState').addClass('hidden');
    $('#terminalState').removeClass('hidden').show();
    $('#finalState').addClass('hidden');
    $('#progressContainer').html(this.createProgressBar());
  },

  showTerminal() {
    $('#terminalState').removeClass('hidden').show();
  },

  addTerminalLine(text, delay = 500, isInput = false) {
    return new Promise(resolve => {
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour12: false });
        let line;

        if (isInput) {
          line = `<div class="terminal-line opacity-0 transition-opacity duration-200">
            <span class="text-gray-500">[${timestamp}]</span> <span class="text-yellow-500">$</span> ${text}
          </div>`;
        } else {
          line = `<div class="terminal-line opacity-0 transition-opacity duration-200">
            <span class="text-gray-500">[${timestamp}]</span> ${text}
          </div>`;
        }

        const $line = $(line);
        $('#terminalOutput').append($line);

        // Forçar reflow para animação
        $line[0].offsetHeight;
        $line.addClass('opacity-100');

        // Auto scroll
        const terminal = $('#terminalOutput');
        terminal.scrollTop(terminal.prop('scrollHeight'));

        resolve();
      }, delay);
    });
  },

  showInstallState(message) {
    $('#installState').removeClass('hidden').show();
    $('#installMessage').text(message);
  },

  hideInstallState() {
    $('#installState').addClass('hidden');
  },

  // Função auxiliar para carregar imagem com fallback
  loadProfileImage(imageUrl, $img, $spinner, fallbackCallback) {
    if (!imageUrl) {
      console.log('Nenhuma URL de imagem fornecida, usando fallback');
      fallbackCallback();
      return;
    }

    const proxiedUrl = getProxyImageUrl(imageUrl);
    const imgEl = $img.get(0);

    // Mostra spinner e esconde imagem
    $img.addClass('hidden');
    $spinner.removeClass('hidden');

    // Configura handlers
    imgEl.onload = () => {
      console.log('Imagem carregada com sucesso:', proxiedUrl);
      $spinner.addClass('hidden');
      $img.removeClass('hidden');
    };

    imgEl.onerror = () => {
      console.error('Erro ao carregar imagem via proxy:', proxiedUrl);
      fallbackCallback();
    };

    // Inicia carregamento
    imgEl.src = proxiedUrl;
  },

  showFinalState(profileData) {
    // 1) Esconde terminal e install, mostra finalState
    $('#terminalState').addClass('hidden');
    $('#installState').addClass('hidden');
    $('#finalState').removeClass('hidden').show();

    // 2) Tenta obter URL do cookie primeiro, depois de profileData
    let originalUrl = getProfileImageFromCookie();
    
    if (!originalUrl && profileData && profileData.picUrl) {
      originalUrl = profileData.picUrl;
      // Salva no cookie para próximas vezes
      saveProfileImageToCookie(originalUrl);
    }

    console.log('showFinalState → URL final escolhida:', originalUrl);

    // 3) Captura referências ao spinner e à imagem
    const $img = $('#profilePicFinal');
    const $spinner = $('#profileSpinner');

    // 4) Função de fallback para caso a imagem não carregue
    const useFallback = () => {
      $spinner.addClass('hidden');
      $img
        .removeClass('hidden')
        .attr('src', 'https://placehold.co/40?text=Perfil');
    };

    // 5) Tenta carregar a imagem
    this.loadProfileImage(originalUrl, $img, $spinner, useFallback);

    // 6) Preenche dados do usuário
    const username = profileData?.username || 'usuario';
    $('#profileUsernameFinal').text('@' + username);
    $('#profileUsernameAlert').text('@' + username);

    // 7) Inicia contagem regressiva
    this.startCountdown();
  },

  // Método para atualizar imagem de perfil (pode ser chamado de outras partes do código)
  updateProfileImage(newImageUrl) {
    if (newImageUrl) {
      saveProfileImageToCookie(newImageUrl);
      
      // Se estiver na tela final, atualiza a imagem imediatamente
      if (!$('#finalState').hasClass('hidden')) {
        const $img = $('#profilePicFinal');
        const $spinner = $('#profileSpinner');
        
        this.loadProfileImage(newImageUrl, $img, $spinner, () => {
          $spinner.addClass('hidden');
          $img
            .removeClass('hidden')
            .attr('src', 'https://placehold.co/40?text=Perfil');
        });
      }
    }
  },

  startCountdown() {
    let time = 269; // 4:29 em segundos
    const countdownElement = $('#countdown');

    const updateCountdown = () => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      countdownElement.text(
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0')
      );
      if (time > 0) {
        time--;
        setTimeout(updateCountdown, 1000);
      }
    };

    updateCountdown();
  }
};