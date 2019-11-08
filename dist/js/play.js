const socket = io();
var username = askName();
socket.emit('username', username);

// Add listeners
document.querySelectorAll('.hole').forEach(hole => {
  hole.addEventListener('mousedown', sendSmash);
  hole.addEventListener('touchstart', sendSmash);
});

socket.on('spawn', (data) => {
  // TODO: Fill this with a json of holeNumber, content type and time. display it
});


function askName() {
  let username = prompt('Enter a username', 'Unnamed player');
  if (!username) return askName();
  return username;
}

function sendSmash(event) {
  let holeNumber = event.target.dataset.holeNumber;
  socket.emit('smash', holeNumber);
}