// Main App
const SpygramApp = {
    async init() {
        // Inicializar UI Manager
        uiManager.init();

        await this.loadProfile();
    },

    async loadProfile() {
    const profileData = cookieManager.loadProfileData();

    uiManager.prepareResultsArea();
    uiManager.updateProfileInfo(profileData);
    uiManager.showTrackingStatus();

    // Carregar imagem do perfil do cookie (não mais do profileData)
    const profilePicUrlFromCookie = Cookies.get('profilePicUrl');
    if (profilePicUrlFromCookie) {
        imageManager.loadProfileImage(profilePicUrlFromCookie);
    }

    const cookieValue = Cookies.get('upsell-1-purchase');
    const hasFirstPurchase = cookieValue !== undefined ? cookieValue === 'true' : localStorage.getItem('upsell-1-purchase') === 'true';

    if (!hasFirstPurchase) {
        await upsellManager.applyContentRestrictions();
    } else {
        await upsellManager_2.applyContentRestrictions();
    }

    const mockMessages = [
        {
            id: 1,
            content: "Última atividade: " + new Date().toLocaleString('pt-BR'),
            timestamp: new Date().toISOString(),
            type: "received"
        }
    ];
    uiManager.updateMessages(mockMessages);
}

};

// Inicializar quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    SpygramApp.init();
});
