const users = [];

// Junte-se ao usuário para conversar
function userJoin(id, username, room) {
    let user = { id, username, room };

    const index = users.findIndex((u) => u.username === username);

    if (index !== -1) {
        clearTimeout(users[index].leaveTimeout);
        user = { ...users[index], id, isReconnected: true };
        users[index] = user;
    } else {
        users.push(user);
    }

    return user;
}

// Obter usuário atual
function getCurrentUser(id) {
    return users.find((user) => user.id === id);
}

// Usuário sai do chat
function userLeave(id) {
    return new Promise((resolve, reject) => {
        const index = users.findIndex((user) => user.id === id);
        if (index === -1) {
            return reject(`user not found with id ${id}`);
        }

        users[index].leaveTimeout = setTimeout(() => {
            if (index !== -1) {
                resolve(users.splice(index, 1)[0]);
            }
        }, 2000);
    });
}

// Obter usuários do quarto
function getRoomUsers(room) {
    return users.filter((user) => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
};
