import WebSocket from 'ws';

const WebSocketServer = new WebSocket.Server({ noServer: true });

WebSocketServer.on('connection', (ws) => {
  console.log('Novo cliente conectado!');

  ws.on('message', (message) => {
    console.log('Mensagem recebida: ', message);
    
    WebSocketServer.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado!');
  });
});

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.socket.server.on('upgrade', (request, socket, head) => {
      WebSocketServer.handleUpgrade(request, socket, head, (ws) => {
        WebSocketServer.emit('connection', ws, request);
      });
    });
    res.status(200).end();
  } else {
    res.status(405).end();
  }
}
