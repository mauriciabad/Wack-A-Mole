const scoreboardElement = document.getElementById('scoreboard');
const socket = io('/scoreboard');

socket.on('score', (players) => {
  scoreboardElement.innerHTML = players.reduce((html, player) => {
    return `${html}<tr><td>${player.username}</td><td>${player.score}</td></tr>`
  }, '');
});
