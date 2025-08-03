// Theme management
export const themeModule = {
    init() {
        this.setInitialTheme();
        this.setupEventListeners();
        this.updateThemeIcon();
    },

    setInitialTheme() {
        // Set dark theme as default if no theme is saved
        if (!('theme' in localStorage)) {
            localStorage.theme = 'dark';
        }
        
        // Apply theme based on localStorage setting
        if (localStorage.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    },

    toggleTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
        this.updateThemeIcon();
    },

    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (!themeIcon) return;

        if (document.documentElement.classList.contains('dark')) {
            themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />`;
        } else {
            themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />`;
        }
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    themeModule.init();
});
