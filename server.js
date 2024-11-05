import express from 'express';
import { createServer } from 'http'; // Importing 'createServer' from 'http'
import { v4 as uuidV4 } from 'uuid';
import { Server } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import cors from 'cors';



const app = express();
const port = 3000; 
app.use(cors());

// Create the server before passing it to PeerServer
const server = createServer(app); // Using 'createServer' from 'http'
const io = new Server(server);

// Initialize Peer Server with the HTTP server
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });
});
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
