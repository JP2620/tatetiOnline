var socket;

window.onload = () => {
  let msgWindow = document.getElementById('msgContainer');
  socket = io.connect(document.location.protocol+'//'+document.location.host);
  let sendBtn = document.getElementById('sendMsg');
  let remitente = document.getElementById('chatFrom');
  let mensaje = document.getElementById('chatMsg');
  sendBtn.addEventListener('click', () => {
    socket.emit('chatMsg', {
      remitente: remitente.value,
      mensaje: mensaje.value
    });
    console.log(socket.id);
  });

  socket.on('chatBroadcast', (data) => {
    if (!(data.remitente === '' || data.mensaje === '')) {
      msgWindow.innerHTML += '<p><b>'+data.remitente+': </b>'+data.mensaje+'</p>';
    }
    console.log(data);
  });
};