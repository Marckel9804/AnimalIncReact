  import WebSocket, { WebSocketServer } from "ws";
  import { v4 as uuidv4 } from "uuid";

  const wss = new WebSocketServer({ port: 4000 });
  let players = [];
  let readyCount = 0;
  let gameState = "waiting";
  let ladder = [];
  let results = [];
  let rooms = {}; // 방 관리 객체

  wss.on("connection", (ws) => {
    console.log('A new client connected');

    const clientId = uuidv4();
    const player = {
      clientId,
      ws,
      ready: false,
      nickname: `Player${players.length + 1}`,
      grade: "Gold",
      points: 1000,
    };
    players.push(player);

    if (players.length > 4) {
      ws.send(JSON.stringify({ type: "roomFull" }));
      ws.close();
      return;
    }

    broadcastPlayers();

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
    
      if (parsedMessage.type === 'ready') {
        handleReadyMessage(parsedMessage);
      } else {
        broadcast(message);
      }
    });

    ws.on('close', () => {
      players = players.filter(p => p.ws !== ws);
      broadcastPlayers();
    });
  });

  function handleReadyMessage(message) {
    const player = players.find((p) => p.clientId === message.clientId);
    if (player) {
      player.ready = message.ready;
      readyCount = players.filter((p) => p.ready).length;
  
      broadcastPlayers();
  
      if (readyCount === players.length && players.length > 1) {
        setTimeout(() => {
          startGame();
        }, 5000);
      }
    }
  }

  // 사다리 게임에 필요한 로직
  function createLadder(numPlayers) {
    const maxHorizontalLines = Math.floor(Math.random() * 10) * 2 + 2;
    return Array.from({ length: maxHorizontalLines }, () =>
      Array(numPlayers - 1).fill(false)
    ).map((row) => {
      const col = Math.floor(Math.random() * (numPlayers - 1));
      row[col] = true;
      return row;
    });
  }

  // 사다리 게임 시작~
  function startGame() {
    gameState = "running";
    ladder = createLadder(players.length);
    broadcast(
      JSON.stringify({
        type: "startGame",
        ladder,
        players: players.map((p) => p.clientId),
      })
    );
  }
  

  // 사다리 게임 끝 !
  function handleFinishPath(message) {
    results.push({ clientId: message.clientId, result: message.result });
    if (results.length === players.length) {
      broadcast(JSON.stringify({ type: "gameEnded", results }));
      gameState = "waiting";
      results = [];
      players.forEach((p) => (p.ready = false));
      readyCount = 0;
      broadcastPlayers();
    }
  }

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

  
  console.log("WebSocket server is running on ws://localhost:4000");
