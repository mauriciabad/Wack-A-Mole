const socket = io('/scoreboard');
const scoreboardElement = document.getElementById('scoreboard');

socket.on('score', (players) => {
  scoreboardElement.innerHTML = players.reduce((html, player) => `${html}<tr><td>${player.username}</td><td>${player.score}</td></tr>`, '')
});
