export const statsManager = {
    init() {
        this.trackedProfiles = document.getElementById('trackedProfiles');
        this.onlineUsers = document.getElementById('onlineUsers');
        this.startCounters();
    },

    startCounters() {
        // Contador de perfis rastreados (aumentando)
        let profileCount = 1234;
        setInterval(() => {
            profileCount += Math.floor(Math.random() * 3) + 1;
            this.trackedProfiles.textContent = profileCount.toLocaleString();
        }, 2000);

        // Contador de usuários online (oscilando)
        let onlineCount = 847;
        let direction = 1;
        setInterval(() => {
            // Altera a direção aleatoriamente
            if (Math.random() < 0.3) direction *= -1;
            
            // Adiciona ou remove um número aleatório de usuários
            const change = Math.floor(Math.random() * 5) + 1;
            onlineCount += change * direction;

            // Mantém o número dentro de um intervalo razoável
            if (onlineCount < 800) {
                onlineCount = 800;
                direction = 1;
            } else if (onlineCount > 900) {
                onlineCount = 900;
                direction = -1;
            }

            this.onlineUsers.textContent = onlineCount.toLocaleString();
        }, 3000);
    }
};
