import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const wss = new WebSocketServer({ port: 4000 });
let players = [];
let readyCount = 0;

wss.on('connection', (ws) => {
  const clientId = uuidv4(); // 고유 ID 생성
  const player = { clientId, ws, ready: false, nickname: `Player${players.length + 1}`, grade: "Gold", points: 1000 };
  players.push(player);

  if (players.length > 4) {
    ws.send(JSON.stringify({ type: 'roomFull' }));
    ws.close();
    return;
  }

  broadcastPlayers();

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'ready') {
      const player = players.find(p => p.clientId === parsedMessage.clientId);
      if (player) {
        player.ready = parsedMessage.ready;
        readyCount = players.filter(p => p.ready).length;

        broadcastPlayers();

        if (readyCount === players.length && players.length > 1) {
          setTimeout(() => {
            broadcast({ type: 'startGame' });
          }, 5000);
        }
      }
    } else {
      broadcast(message);
    }
  });

  ws.on('close', () => {
    players = players.filter(p => p.ws !== ws);
    broadcastPlayers();
  });
});

function broadcastPlayers() {
  const playerList = players.map(p => ({
    clientId: p.clientId,
    nickname: p.nickname,
    grade: p.grade,
    points: p.points,
    ready: p.ready,
  }));

  broadcast(JSON.stringify({ type: 'players', players: playerList }));
}

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

console.log('WebSocket server is running on ws://localhost:4000');
