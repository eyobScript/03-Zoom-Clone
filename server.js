import express from 'express';
import { createServer } from 'http'; // Importing 'createServer' from 'http'
import { v4 as uuidV4 } from 'uuid'
import { Server } from 'socket.io';



const app = express();
const port = 3000;

const server = createServer(app); // Using 'createServer' from 'http'
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) =>{
    res.redirect(`/${uuidV4()}`); 
});

app.get('/:room',(req, res) => {
   res.render('room', {roomId: req.params.room})
});

io.on('connection',(socket) => {
    socket.on('join-room', () => {
        console.log('eyob joined');
    });
});
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
