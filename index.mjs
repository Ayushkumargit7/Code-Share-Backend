import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => {
  res.send(`Server is running`);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming chat messages
  socket.on('user-message', (message) => {
    console.log('message sent');
    socket.broadcast.emit('user-message', message); // Broadcast the message to all connected clients
  });

  // Handle code language
  socket.on('language', (codeLanguage) => {
    console.log(codeLanguage);
    io.emit('language', codeLanguage); //means sabko emit kar do , to all currently connected clients
  })

  // Handle code updates
  socket.on('code-update', (code) => {
    console.log('code updated');
    socket.broadcast.emit('code-update', code); // Broadcast the updated code to all connected clients
  });

  // Handle code output
  socket.on('output', (codeOutput) => {
    console.log('code output done');

    io.emit('output', codeOutput); // Broadcast the updated code to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
