const socket = io();

var score = 0;
const scoreElement = document.getElementById('score');

const username = prompt('Enter a username', 'Unnamed player');
socket.emit('username', username);

// Add listeners
document.querySelectorAll('.hole').forEach(hole => {
  hole.addEventListener('mousedown', sendSmash);
  hole.addEventListener('touchstart', sendSmash);
});

socket.on('spawn', spawnContent);
socket.on('variateScore', variateScore);



function sendSmash(event) {
  let holeNumber = event.currentTarget.dataset.holenumber;
  socket.emit('smash', holeNumber);
  despawnContent(holeNumber);
}

function spawnContent({holeNumber, content, duration}) {
  let holeContentElement = document.querySelector(`[data-holeNumber='${holeNumber}'] > [data-content='${content}']`);
  
  holeContentElement.classList.add('hole__img--active');
  
  setTimeout(() => {
    holeContentElement.classList.remove('hole__img--active');
  }, duration);
}

function despawnContent(holeNumber) {
  let allHoleContentElements = document.querySelectorAll(`[data-holeNumber='${holeNumber}'] > [data-content]`);
  allHoleContentElements.forEach((holeContentElement) => {
    holeContentElement.classList.remove('hole__img--active');
  });
}

function variateScore(points) {
  score += points;
  scoreElement.textContent = score;
}