var socket;

window.onload = () => {
  socket = io.connect(document.location.protocol+'//'+document.location.host);
  let sendBtn = document.getElementById('sendMsg');
  let remitente = document.getElementById('chatFrom');
  let mensaje = document.getElementById('chatMsg');
  sendBtn.addEventListener('click', () => {
    socket.emit('chatMsg', {
      remitente: remitente.nodeValue,
      mensaje: mensaje.textContent
    });
    console.log(mensaje.textContent);
    console.log(remitente.textContent);
  });
};