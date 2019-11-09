const express = require('express');
const path    = require('path');
const app     = express();
const http    = require('http').createServer(app);
const io      = require('socket.io')(http);

const game = {
  holes: [
    { content: 'none', smashedBy: [] },
    { content: 'none', smashedBy: [] },
    { content: 'none', smashedBy: [] },
    { content: 'none', smashedBy: [] },
    { content: 'none', smashedBy: [] },
    { content: 'none', smashedBy: [] },
    { content: 'none', smashedBy: [] },
    { content: 'none', smashedBy: [] },
    { content: 'none', smashedBy: [] },
  ],
  players: {
    // 'testUserId': {
    //   score: 0,
    //   username: 'Unnamed player',
    // }
  }
};

io.on('connection', (socket) => {
  console.log(`${socket.id} joined the game`);

  game.players[socket.id] = {
    score: 0,
    username: 'Unnamed player',
  };

  socket.on('username', (username) => {
    game.players[socket.id].username = username;
  });

  socket.on('smash', (holeNumber) => {
    let hole = game.holes[holeNumber];
    
    if(!hole.smashedBy.includes(socket.id)){
      let points = 0;

      switch(hole.content){
        case 'mole':  points = +1; break;
        case 'bunny': points = -3; break;
        case 'none':  points =  0; break;
        default:      points =  0; break;
      }

      hole.smashedBy.push(socket.id);

      socket.emit('variateScore', points);
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} (${game.players[socket.id].username}) left the game`);

    delete game.players[socket.id];
  });


  setInterval(() => {
    let holeNumber = Math.floor(Math.random() * 9);
    let content = (Math.random() > 0.3) ? 'mole' : 'bunny';
    let duration = 500 + Math.random() * 1000;
  
    game.holes[holeNumber] = { content, smashedBy: [] };
  
    socket.broadcast.emit('spawn', {holeNumber, content, duration})
  
  }, 500 + Math.random() * 2000);
});

// TODO: Add the logic of spawning
// TODO: Send info to scoreboard(s)

app.use(express.static('dist'));

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});