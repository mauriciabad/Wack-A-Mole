const socket = io('/play');

var score = 0;
const scoreElement = document.getElementById('score');

const username = prompt('Enter a username', 'Player') || 'Player';
socket.emit('username', username);

// Add listeners
document.querySelectorAll('.hole').forEach(hole => {
  hole.addEventListener('mousedown', smash);
  hole.addEventListener('touchstart', smash);
});

socket.on('spawn', spawnContent);
socket.on('variateScore', variateScore);



function smash(event) {
  let holeNumber = event.currentTarget.dataset.holenumber;
  let holeContentElement = document.querySelector(`[data-holeNumber='${holeNumber}'] > .hole__img--active`);

  socket.emit('smash', holeNumber);

  if(holeContentElement){
    holeContentElement.classList.remove('hole__img--active');
    holeContentElement.classList.add('hole__img--smashed');
    setTimeout(() => {
      holeContentElement.classList.remove('hole__img--smashed');
    }, 200);
  }
}

function spawnContent({holeNumber, content, duration}) {
  let holeContentElement = document.querySelector(`[data-holeNumber='${holeNumber}'] > [data-content='${content}']`);
  
  holeContentElement.classList.add('hole__img--active');
  
  setTimeout(() => {
    holeContentElement.classList.remove('hole__img--active');
  }, duration - 200);
}

function variateScore(points) {
  score += points;
  scoreElement.textContent = score;
}