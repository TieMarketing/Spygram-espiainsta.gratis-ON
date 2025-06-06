// chat_messages.js
// Arquivo separado para armazenar as mensagens de chat

const chatMessages = {
    // Primeira conversa - Estilo mostrado na imagem 1 (com foto, vídeo e localização)
    chat1: {
        status: "Online agora",
        statusClass: "text-green-500",
        content: `
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Olá, como você está?</div>
            <div class="message-time blurred-text-sm">10:30</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Estou bem, e você?</div>
            <div class="message-time blurred-text-sm">10:32 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Te falei sobre aquilo...</div>
            <div class="message-time blurred-text-sm">10:33</div>
        </div>
        <div class="message-item received">
            <div class="photo-message-container">
                <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
            </div>
            <div class="message-time blurred-text-sm">10:35</div>
        </div>
        <div class="message-item received">
            <div class="photo-message-container">
                <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
            </div>
            <div class="message-time blurred-text-sm">10:47</div>
        </div>
        <div class="message-item received">
            <div class="video-message-container">
                <button class="video-button"><i class="fas fa-play mr-2"></i>Video</button>
            </div>
            <div class="message-time blurred-text-sm">10:50</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Aqui <span id="city">em -</span> mesmo?</div>
            <div class="message-time blurred-text-sm">11:05 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Sim, aqui</div>
            <div class="message-time blurred-text-sm">11:08</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Me manda localizacao, jjaja to indo</div>
            <div class="message-time blurred-text-sm">11:10 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="location-message-container">
                <div class="location-preview">
                    <span class="location-label">Localização compartilhada</span>
                </div>
            </div>
            <div class="message-time blurred-text-sm">11:11</div>
        </div>
        <div class="blocked-messages-container">
            <div class="blocked-messages-notice">
                <i class="fa-solid fa-key"></i>
                <span>Acesso completo sem limites</span>
            </div>
            <div class="cta">
                <button id="viewBlockedBtn" class="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg px-4 py-2">Desbloquear tudo - R$ 37,90</button>
            </div>
        </div>
    `
    },

    // Segunda conversa - Estilo mostrado na imagem 2 (com mais fotos e vídeos)
    chat2: {
        status: "Ativo há 5m",
        statusClass: "text-yellow-500",
        content: `
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Me chamou ontem de noite, por quê?</div>
            <div class="message-time blurred-text-sm">22:20</div>
        </div>
        <div class="message-item received">
            <div class="photo-message-container">
                <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
            </div>
            <div class="message-time blurred-text-sm">22:21</div>
        </div>
        <div class="message-item received">
            <div class="photo-message-container">
                <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
            </div>
            <div class="message-time blurred-text-sm">22:22</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Como você conseguiu essas fotos?</div>
            <div class="message-time blurred-text-sm">22:25 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Estava lá ontem à noite</div>
            <div class="message-time blurred-text-sm">22:27</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Isso é muito estranho</div>
            <div class="message-time blurred-text-sm">22:30 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="video-message-container">
                <button class="video-button"><i class="fas fa-play mr-2"></i>Video</button>
            </div>
            <div class="message-time blurred-text-sm">22:32</div>
        </div>
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Olha quem apareceu no final do vídeo</div>
            <div class="message-time blurred-text-sm">22:35</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Preciso conversar com você pessoalmente</div>
            <div class="message-time blurred-text-sm">22:37 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="blocked-messages-container">
            <div class="blocked-messages-notice">
                <i class="fa-solid fa-key mr-2"></i>
                <span>Acesso completo ao Instagram</span>
            </div>
            <div class="cta">
                <button id="viewBlockedBtn" class="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg px-4 py-2">Desbloquear tudo - R$ 37,90</button>
            </div>
        </div>
    `
    },

    // Terceira conversa - Estilo mostrado na imagem 3 (madrugada)
    chat3: {
        status: "Offline",
        statusClass: "text-gray-400",
        content: `
        <div class="message-item received">
            <div class="photo-message-container">
                <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
            </div>
            <div class="message-time blurred-text-sm">03:18</div>
        </div>
        <div class="message-item received">
            <div class="photo-message-container">
                <button class="photo-button"><i class="fas fa-play mr-2"></i>Foto</button>
            </div>
            <div class="message-time blurred-text-sm">03:20</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Não manda mais isso</div>
            <div class="message-time blurred-text-sm">03:22 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Ela não sabe disso</div>
            <div class="message-time blurred-text-sm">03:23</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Apagou?</div>
            <div class="message-time blurred-text-sm">03:24 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="video-message-container">
                <button class="video-button"><i class="fas fa-play mr-2"></i>Video</button>
            </div>
            <div class="message-time blurred-text-sm">03:25</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Isso não é o que combinamos</div>
            <div class="message-time blurred-text-sm">03:26 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Ninguém mais vai saber, relaxa</div>
            <div class="message-time blurred-text-sm">03:27</div>
        </div>
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Só não conte para ninguém sobre ontem à noite</div>
            <div class="message-time blurred-text-sm">03:28</div>
        </div>
        <div class="message-item sent">
            <div class="message-bubble blurred-text-sm">Vamos conversar amanhã</div>
            <div class="message-time blurred-text-sm">03:30 <i class="fas fa-check text-xs ml-1"></i></div>
        </div>
        <div class="message-item received">
            <div class="message-bubble blurred-text-sm">Ok, mas lembre-se do nosso acordo</div>
            <div class="message-time blurred-text-sm">03:32</div>
        </div>
        <div class="blocked-messages-container">
            <div class="blocked-messages-notice">
                <i class="fa-solid fa-key mr-2"></i>
                <span>Acesso completo ao Instagram</span>
            </div>
            <div class="cta">
                <button id="viewBlockedBtn" class="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg px-4 py-2">Desbloquear tudo - R$ 37,90</button>
            </div>
        </div>
    `
    }
};

// Exportar as mensagens para uso em outros arquivos
export default chatMessages;
