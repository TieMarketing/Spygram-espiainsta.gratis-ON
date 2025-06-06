const imageManager = {
    loadProfileImage(profilePicUrl) {
        if (!profilePicUrl) return;

        const proxyUrl = `https://proxy-server-git-main-devanuchihas-projects.vercel.app/api/proxy-image?url=${encodeURIComponent(profilePicUrl)}`;
        const profilePic = document.getElementById('profilePic');
        
        // Adicionar classe de loading
        profilePic.classList.add('animate-pulse');
        
        // Criar elemento de imagem temporário para verificar carregamento
        const tempImg = new Image();
        tempImg.onload = function() {
            profilePic.style.backgroundImage = `url(${proxyUrl})`;
            profilePic.style.backgroundSize = 'cover';
            profilePic.style.backgroundPosition = 'center';
            profilePic.classList.remove('animate-pulse');
        };
        tempImg.onerror = function() {
            console.error('Erro ao carregar imagem do perfil');
            profilePic.classList.remove('animate-pulse');
            // Usar uma imagem de fallback
            profilePic.style.backgroundImage = 'url(../../images/default-profile.jpg)';
        };
        tempImg.src = proxyUrl;
    }
};
