const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Obter nome de usuário e espaço do URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Participar da sala de bate-papo
socket.emit('joinRoom', { username, room });

// Obter espaço e usuários
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Mensagem do servidor
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

// Scroll down
chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Envio de mensagem
chatForm.addEventListener('submit', e => {
    e.preventDefault();

// Obter texto da mensagem    
    const msg = e.target.elements.msg.value;

// Emitir mensagem para o servidor    
    socket.emit('chatMessage', msg);

// Limpar entrada
e.target.elements.msg.value = '';
e.target.elements.msg.focus();    
});

// Enviar mensagem para DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Adicionar nome do quarto ao DOM
function outputRoomName(room) {
 roomName.innerText = room;
}

// Adicionar usuários ao DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map (user => `<li>${user.username}</li>`).join('')}
    `;
}
