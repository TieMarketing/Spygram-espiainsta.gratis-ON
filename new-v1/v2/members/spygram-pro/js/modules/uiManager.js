const uiManager = {
    init() {
        this.resultsArea = document.getElementById('resultsArea');
        this.contentArea = document.getElementById('contentArea');
        this.profileName = document.getElementById('profileName');
        this.profileUsername = document.getElementById('profileUsername');
        this.postsCount = document.getElementById('postsCount');
        this.followersCount = document.getElementById('followersCount');
        this.followingCount = document.getElementById('followingCount');
    },

    formatNumber(num) {
        num = parseInt(num);
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    updateProfileInfo(profileData) {
        // Atualizar nome e username
        this.profileName.textContent = profileData.name;
        this.profileUsername.textContent = `@${profileData.name.toLowerCase().replace(/\s+/g, '')}`;
        
        // Obter valores dos cookies com fallback para localStorage
        const followerCount = Cookies.get('followerCount') || localStorage.getItem('followerCount') || '0';
        const followingCount = Cookies.get('followingCount') || localStorage.getItem('followingCount') || '0';
        const mediaCount = Cookies.get('mediaCount') || localStorage.getItem('mediaCount') || '0';
        
        // Atualizar contadores com valores formatados
        this.postsCount.textContent = this.formatNumber(mediaCount);
        this.followersCount.textContent = this.formatNumber(followerCount);
        this.followingCount.textContent = this.formatNumber(followingCount);
    },

    prepareResultsArea() {
        this.resultsArea.classList.remove('hidden');
    },

    showTrackingStatus() {
        const trackingStatus = document.createElement('div');
        trackingStatus.className = 'flex justify-center mt-4';
        trackingStatus.innerHTML = `
            <div class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white animate-pulse">
                Rastreando perfil
            </div>
        `;
        this.resultsArea.prepend(trackingStatus);
    },

    updateMessages(messages) {
        this.contentArea.innerHTML = '';
        messages.forEach(message => {
            this.contentArea.appendChild(this.createMessageElement(message));
        });
    },

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `p-4 rounded-xl mb-4 ${
            message.type === 'sent' 
                ? 'bg-purple-500 text-white ml-auto' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        } max-w-[80%]`;

        const contentP = document.createElement('p');
        contentP.textContent = message.content;
        messageDiv.appendChild(contentP);

        const timeSpan = document.createElement('span');
        timeSpan.className = 'text-sm opacity-75 block mt-1';
        timeSpan.textContent = new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        messageDiv.appendChild(timeSpan);

        return messageDiv;
    }
};
