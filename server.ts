import express = require('express');
import * as http from 'http'
import {Server} from 'socket.io'

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;
let users: string[] = [];

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));

interface Payload {
	signal: any
	callerId?: string
	userToSignal?: string
}

io.on('connection', (socket) => {
	socket.on('joinRoom', () => {
users.push(socket.id);
const usersInThisRoom = users.filter(id => id !== socket.id);
		socket.emit('allUsers', usersInThisRoom);
	});

	socket.on('sendingSignal', (payload: Payload) => {
		io.to(payload.userToSignal!).emit('userJoined', { signal: payload.signal, callerId: socket.id });
	});

	socket.on('returningSignal', (payload: Payload) => {
		io.to(payload.callerId!).emit('receivingReturnedSignal', { signal: payload.signal, callerId: socket.id });
	});

	socket.on('disconnect', () => {
		io.emit('removeClient', socket.id);
		users = users.filter(id => id !== socket.id);
	});
});

server.listen(port, () => console.log(`server is running on port ${port}`));
