const socket = io('/play');

const scoreElement = document.getElementById('score');

const username = prompt('Enter a username', '');
if(username) socket.emit('username', username);

document.querySelectorAll('.hole').forEach(hole => {
  hole.addEventListener('mousedown', smash);
  hole.addEventListener('touchstart', smash);
});

socket.on('spawn', spawnContent);
socket.on('score', displayScore);



function smash(event) {
  event.preventDefault();
  let holeNumber = event.currentTarget.dataset.holenumber;
  let holeContentElement = document.querySelector(`[data-holeNumber='${holeNumber}'] > .hole__img--active`);

  socket.emit('smash', holeNumber);

  if(holeContentElement){
    holeContentElement.classList.remove('hole__img--active');
    holeContentElement.classList.add('hole__img--smashed');
    setTimeout(() => {
      holeContentElement.classList.remove('hole__img--smashed');
    }, 100);
  }
}

function spawnContent({holeNumber, content, duration}) {
  let holeContentElement = document.querySelector(`[data-holeNumber='${holeNumber}'] > [data-content='${content}']`);
  
  holeContentElement.classList.add('hole__img--active');
  
  setTimeout(() => {
    holeContentElement.classList.remove('hole__img--active');
  }, duration - 100);
}

function displayScore(score) {
  scoreElement.textContent = score;
}