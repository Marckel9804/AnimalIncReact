// server/server.js
import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 4000 });
let playerCounter = 0;

wss.on('connection', (ws) => {
  playerCounter++;
  const clientId = uuidv4(); // 고유 ID 생성
  const playerNum = playerCounter; // 플레이어 번호 할당

  ws.send(JSON.stringify({ type: 'init', clientId, playerNum })); // 클라이언트에 고유 ID 및 플레이어 번호 전송

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:4000');
