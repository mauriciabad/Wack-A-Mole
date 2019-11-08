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
    let hole = gameState.holes[holeNumber];
    
    if(!hole.smashedBy.includes(socket.id)){
      let points = 0;

      switch(hole.content){
        case 'mole':  points = +1; break;
        case 'bunny': points = -3; break;
        case 'none':  points =  0; break;
        default:      points =  0; break;
      }

      hole.smashedBy.push(socket.id);
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} (${game.players[socket.id].username}) left the game`);

    delete game.players[socket.id];
  });
});

// TODO: Add the logic of spawning
// TODO: Send info to scoreboard(s)

app.use(express.static('dist'));

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});