const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { 
    userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoomUsers 
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Definir pasta estática
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatApp';

// Executar quando o cliente se conectar
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

      // Bem-vindo usuário atual
    socket.emit('message', formatMessage(botName, 'Bem-vindo(a) ao ChatApp!'));

    // Transmitir quando um usuário se conecta
        socket.broadcast
        .to(user.room)
        .emit(
            'message', 
            formatMessage(botName, `${user.username} entrou na sala!`)
            );

    // Enviar usuários e informações do quarto
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });        
});

// Escutar chatMessage
socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
});

// É executado quando o cliente desconecta
socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if(user) {
      io.to(user.room).emit(
          'message', 
          formatMessage(botName, `${user.username} saiu da sala!`)
        );

      // Enviar usuários e informações do quarto
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));