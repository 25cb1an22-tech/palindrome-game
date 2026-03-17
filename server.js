const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Ye line ab error nahi aane degi
app.use(express.static(__dirname)); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let players = {};
io.on('connection', (socket) => {
    socket.on('join', (name) => {
        players[socket.id] = { name: name || "PILOT", score: 0, lives: 3 };
        io.emit('updateLeaderboard', Object.values(players));
    });

    socket.on('submitWord', (word) => {
        let p = players[socket.id];
        if(!p) return;
        const isP = word.length > 1 && word === word.split('').reverse().join('');
        if(isP) p.score += 100; else p.lives -= 1;
        io.emit('updateLeaderboard', Object.values(players));
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updateLeaderboard', Object.values(players));
    });
});

server.listen(3000, () => console.log('Server Live! Kholo: http://localhost:3000'));