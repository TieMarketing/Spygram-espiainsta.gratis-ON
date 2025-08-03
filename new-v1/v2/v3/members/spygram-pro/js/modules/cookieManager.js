const cookieManager = {
    loadProfileData() {
        return {
            name: Cookies.get('profileName') || '',
            analysisOption: Cookies.get('analysisOption') || '',
            profilePicUrl: Cookies.get('profilePicUrl') || '',
            hasPurchased: Cookies.get('upsell-1-purchase') === 'true'
        };
    },

    hasValidProfile() {
        return !!Cookies.get('profileName');
    }
};
