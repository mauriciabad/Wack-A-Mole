/* - - - - Initialize variables - - - - */
const express = require('express');
const app     = express();
const http    = require('http').createServer(app);
const io      = require('socket.io')(http);

const ioPlay       = io.of('/play');
const ioScoreboard = io.of('/scoreboard');

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
    // 'exampleUserId': { score: 0, username: 'Player' }
  }
};


/* - - - - Game spawning logic - - - - */
setSpawner();
setSpawner();
setSpawner();

function setSpawner() {
  let holeNumber = Math.floor(Math.random() * 9);
  let content = (Math.random() > 0.3) ? 'mole' : 'bunny';
  let duration = 300 + Math.random() * 900;
  
  if(game.holes[holeNumber].content === 'none'){
    game.holes[holeNumber] = { content, smashedBy: [] };
  
    ioPlay.emit('spawn', {holeNumber, content, duration});
    
    setTimeout(() => {
      game.holes[holeNumber] = { content: 'none', smashedBy: [] };
    }, duration);
  }

  setTimeout(setSpawner, 100 + Math.random() * 3100);
}

/* - - - - Player logic - - - - */
ioPlay.on('connection', (socket) => {
  console.log(`${socket.id} joined the game`);

  game.players[socket.id] = {
    score: 0,
    username: 'Player',
  };

  updateScoreboard();

  socket.on('username', (username) => {
    game.players[socket.id].username = username;
    updateScoreboard();
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

      // prevent negative scores
      if(game.players[socket.id].score + points < 0) {
        points = -game.players[socket.id].score; 
      }

      if(points){
        hole.smashedBy.push(socket.id);
        game.players[socket.id].score += points;
        
        socket.emit('variateScore', points);
        updateScoreboard();
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} left the game (${game.players[socket.id].username})`);

    delete game.players[socket.id];
    updateScoreboard();
  });
});


/* - - - - Scoreboard logic - - - - */
ioScoreboard.on('connection', (socket) => {
  console.log(`${socket.id} joined the scoreboard`);

  socket.emit('score', toSortedArray(game.players));

  socket.on('disconnect', () => {
    console.log(`${socket.id} left the scoreboard`);
  });
});


/* - - - - Server logic - - - - */
app.use(express.static('dist'));

const port = process.env.PORT || 3000;

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});


/* - - - - Functions - - - - */
function updateScoreboard() {
  ioScoreboard.emit('score', toSortedArray(game.players));
}

function toSortedArray(players) {
  return Object.values(players).sort((a, b) => b.score - a.score);
}