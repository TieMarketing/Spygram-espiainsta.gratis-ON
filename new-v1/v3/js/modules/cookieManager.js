// Gerenciador de cookies e localStorage
export function saveUserData(username, selectedOption) {
    try {
        // Limpar cookies antigos
        const cookiesToDelete = ['profileName', 'analysisOption'];
        cookiesToDelete.forEach(name => {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });

        // Definir data de expiraÃ§Ã£o (7 dias)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        // Salvar novos cookies
        document.cookie = `profileName=${encodeURIComponent(username)};path=/;expires=${expirationDate.toUTCString()};samesite=strict`;
        document.cookie = `analysisOption=${encodeURIComponent(selectedOption)};path=/;expires=${expirationDate.toUTCString()};samesite=strict`;

        // Salvar no localStorage
        localStorage.setItem('profileName', username);
        localStorage.setItem('analysisOption', selectedOption);

        return true;
    } catch (e) {
        console.error('Erro ao salvar dados:', e);
        return false;
    }
}
