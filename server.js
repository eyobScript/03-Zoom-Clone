import express from 'express';
import { createServer } from 'http'; // Importing 'createServer' from 'http'
import { v4 as uuidV4 } from 'uuid'

const app = express();
const port = 3000;

const server = createServer(app); // Using 'createServer' from 'http'
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) =>{
    res.redirect(`/${uuidV4()}`); 
});

app.get('/:room',(req, res) => {
    console.log(req);
   res.render('room', {roomId: req.params.room})
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
