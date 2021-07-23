const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

const users = [];
const port = 8080;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));

io.on('connection', socket => {
	socket.on('joinRoom', () => {
		users.push(socket.id);
		const usersInThisRoom = users.filter(id => id !== socket.id);
		socket.emit('allUsers', usersInThisRoom);
	});

	socket.on('sendingSignal', payload => {
		io.to(payload.userToSignal).emit('userJoined', { signal: payload.signal, callerId: socket.id });
	});

	socket.on('returningSignal', payload => {
		io.to(payload.callerId).emit('receivingReturnedSignal', { signal: payload.signal, callerId: socket.id });
	});

	socket.on('disconnect', () => {
		io.emit('removeClient', socket.id);
		users = users.filter(id => id !== socket.id);
	});
});

server.listen(port, () => console.log(`server is running on port ${port}`));
