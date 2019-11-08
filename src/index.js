const express = require('express');
const path    = require('path');
const app     = express();
const http    = require('http').createServer(app);
const io      = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});