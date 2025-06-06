import { showLoading, hideLoading } from './loadingManager.js';
import { saveUserData } from './cookieManager.js';

// ConfiguraÃ§Ã£o dos event handlers
export function setupEventHandlers() {
    // Checkbox exclusivo
    $('input[type="checkbox"]').on('change', function () {
        if ($(this).is(':checked')) {
            $('input[type="checkbox"]').not(this).prop('checked', false);
        }
    });

    // BotÃ£o de inÃ­cio
    $('#startButton').click(function (e) {
        e.preventDefault();

        const username = $('#usernameInput').val().trim().replace('@', '');
        if (!username) {
            $('#usernameInput').css('border-color', '#ef4444')
                .animate({ marginLeft: '-10px' }, 100)
                .animate({ marginLeft: '10px' }, 100)
                .animate({ marginLeft: '0px' }, 100);
            return;
        }

        if (!$('input[type="checkbox"]:checked').length) {
            alert('Por favor, selecione uma opÃ§Ã£o de anÃ¡lise.');
            return;
        }

        saveToCookiesAndRedirect(username);
    });

    // Input de usuÃ¡rio
    $('#usernameInput').on('input', function () {
        $(this).css('border-color', '');
    });
}

export function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    // Se os elementos nÃ£o forem encontrados, retornar sem fazer nada
    if (!themeToggle || !themeIcon) {
        console.log('Elementos de tema nÃ£o encontrados');
        return;
    }

    // Check if theme exists in localStorage, if not set it to 'dark'
    if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark');
    }

    // On page load, apply the saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        updateThemeIcon(themeIcon, 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeIcon(themeIcon, 'light');
    }

    themeToggle.addEventListener('click', () => {
        // Toggle the theme
        const isDark = document.documentElement.classList.toggle('dark');

        // Save the new theme preference
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Update the icon
        updateThemeIcon(themeIcon, isDark ? 'dark' : 'light');
    });
}

function updateThemeIcon(icon, theme) {
    // Verificar se o elemento icon existe
    if (!icon) return;

    if (theme === 'dark') {
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        `;
    } else {
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        `;
    }
}

function saveToCookiesAndRedirect(username) {
    showLoading();

    const selectedOption = $('input[type="checkbox"]:checked').val();
    console.log('OpÃ§Ã£o selecionada:', selectedOption); // Debug

    if (!selectedOption) {
        hideLoading();
        alert('Por favor, selecione uma opÃ§Ã£o de anÃ¡lise.');
        return;
    }

    const saved = saveUserData(username, selectedOption);

    if (!saved) {
        hideLoading();
        alert('Erro ao salvar dados. Por favor, tente novamente.');
        return;
    }

    setTimeout(() => {
        window.location.href = '/analyse' + window.location.search;
    }, 3000);

}