const socket = io('/play');

const username = prompt('Enter a username', '');
if(username) socket.emit('username', username);

document.querySelectorAll('.hole').forEach(hole => {
  hole.addEventListener('mousedown', smash);
  hole.addEventListener('touchstart', smash);
});

socket.on('spawn', displaySpawn);
socket.on('score', displayScore);



function smash(event) {
  event.preventDefault();

  let holeNumber = event.currentTarget.dataset.holenumber;
  
  socket.emit('smash', holeNumber);
  
  displaySmash(holeNumber);
}

/* - - - Display UI changes - - - */

function displaySmash(holeNumber) {
  let holeActiveContentElement = document.querySelector(`[data-holeNumber='${holeNumber}'] > .hole__img--active`);
  if (holeActiveContentElement) {
    holeActiveContentElement.classList.remove('hole__img--active');
    holeActiveContentElement.classList.add('hole__img--smashed');
    setTimeout(() => {
      holeActiveContentElement.classList.remove('hole__img--smashed');
    }, 100);
  }
}

function displaySpawn({holeNumber, content, duration}) {
  let holeContentElement = document.querySelector(`[data-holeNumber='${holeNumber}'] > [data-content='${content}']`);
  
  holeContentElement.classList.add('hole__img--active');
  
  setTimeout(() => {
    holeContentElement.classList.remove('hole__img--active');
  }, duration - 100);
}

function displayScore(score) {
  document.querySelector('#score').textContent = score;
}
