var socket;
window.onload = () => {
  socket = io.connect('http://localhost:2000');
  socket.emit('hola', {reason: "Its my birthday"});
  let botones = document.getElementsByClassName("cell");
  for (let boton of botones) {
    console.log(boton.parentElement.id);

    boton.addEventListener('click', () => {
      boton.style.backgroundColor = 'brown';
      socket.emit('movimiento');
    });
  }
};
