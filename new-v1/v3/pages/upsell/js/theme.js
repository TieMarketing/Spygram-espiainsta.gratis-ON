// Gerenciador de tema
class ThemeManager {
    constructor() {
        this.themeToggle = $('#themeToggle');
        this.themeIcon = $('#themeIcon');
        this.setupTheme();
        this.setupEventListeners();
    }

    setupTheme() {
        // Set dark theme as default if no theme is saved
        const savedTheme = localStorage.getItem('theme');
        
        if (!savedTheme) {
            this.setTheme('dark');
        } else if (savedTheme === 'dark') {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }

        // Observar mudanças na preferência do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.updateThemeIcon(theme === 'dark');
        localStorage.setItem('theme', theme);
    }

    updateThemeIcon(isDark) {
        if (isDark) {
            this.themeIcon.html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />');
        } else {
            this.themeIcon.html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />');
        }
    }

    setupEventListeners() {
        this.themeToggle.click(() => {
            const isDark = document.documentElement.classList.contains('dark');
            this.setTheme(isDark ? 'light' : 'dark');
        });
    }
}

// Inicializar o gerenciador de tema quando o documento estiver pronto
$(document).ready(() => {
    window.themeManager = new ThemeManager();
});
