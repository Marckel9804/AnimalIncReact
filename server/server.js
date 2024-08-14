import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const wss = new WebSocketServer({ port: 4000 });
const rooms = new Map();

wss.on("connection", (ws) => {
  const clientId = uuidv4();

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
      case "join":
        handleJoin(ws, clientId, parsedMessage.room_id);
        break;
      case "finishPath":
        handleFinishPath(parsedMessage);
        break;
    }
  });

  ws.on("close", () => {
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex((p) => p.ws === ws);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        broadcastPlayers(roomId);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        }
        break;
      }
    }
  });
});

function handleJoin(ws, clientId, roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      players: [],
      gameState: "waiting",
      ladder: [],
      results: [],
      totalParticipants: 0,
      winner: null,
      rewards: [],
    });
  }

  const room = rooms.get(roomId);

  axios
    .get(`http://localhost:8080/api/user/game/ladder/participants/${roomId}`)
    .then((res) => {
      room.totalParticipants = res.data.length;

      if (room.players.length < room.totalParticipants) {
        const newPlayer = {
          clientId,
          userNum: res.data[room.players.length].users.userNum,
          ws,
          nickname: res.data[room.players.length].users.userNickname,
          grade: res.data[room.players.length].users.userGrade,
          userPicture: res.data[room.players.length].users.userPicture,
        };

        room.players.push(newPlayer);
        broadcastPlayers(roomId);

        ws.send(
          JSON.stringify({
            type: "gameState",
            state: room.gameState,
            ladder: room.ladder,
            players: room.players.map((p) => p.clientId),
            totalParticipants: room.totalParticipants,
            currentParticipants: room.players.length,
          })
        );

        if (room.players.length === room.totalParticipants) {
          startCountdown(roomId);
        }
      } else {
        ws.send(JSON.stringify({ type: "roomFull" }));
      }
    })
    .catch((error) => console.log(error));
}

function startCountdown(roomId) {
  const room = rooms.get(roomId);
  room.gameState = "countdown";
  let countdown = 5;
  const countdownInterval = setInterval(() => {
    broadcastToRoom(
      roomId,
      JSON.stringify({ type: "countdown", count: countdown })
    );
    countdown--;
    if (countdown < 0) {
      clearInterval(countdownInterval);
      startGame(roomId);
    }
  }, 1000);
}

function startGame(roomId) {
  const room = rooms.get(roomId);
  room.gameState = "running";
  room.ladder = createLadder(room.players.length);
  room.rewards = createRandomRewards(room.players.length);
  broadcastToRoom(
    roomId,
    JSON.stringify({
      type: "startGame",
      ladder: room.ladder,
      players: room.players.map((p) => p.clientId),
      rewards: room.rewards,
    })
  );
}

function handleFinishPath(message) {
  for (const [roomId, room] of rooms.entries()) {
    const playerIndex = room.players.findIndex(
      (p) => p.clientId === message.clientId
    );
    if (playerIndex !== -1) {
      const result = {
        clientId: message.clientId,
        result: message.result,
        nickname: room.players[playerIndex].nickname,
      };
      room.results.push(result);
      if (room.rewards[message.result] === "win") {
        room.winner = room.players[playerIndex];
      }
      if (room.results.length === room.players.length) {
        broadcastToRoom(
          roomId,
          JSON.stringify({
            type: "gameEnded",
            results: room.results,
            winner: room.winner,
          })
        );
        room.gameState = "waiting";
        room.results = [];
        room.ladder = [];
        room.winner = null;
        room.rewards = [];
      }
      break;
    }
  }
}

function broadcastPlayers(roomId) {
  const room = rooms.get(roomId);
  const playerList = room.players.map((p) => ({
    clientId: p.clientId,
    userNum: p.userNum,
    nickname: p.nickname,
    grade: p.grade,
    userPicture: p.userPicture,
  }));
  broadcastToRoom(
    roomId,
    JSON.stringify({
      type: "players",
      players: playerList,
      totalParticipants: room.totalParticipants,
      currentParticipants: room.players.length,
    })
  );
}

function broadcastToRoom(roomId, message) {
  const room = rooms.get(roomId);
  room.players.forEach((player) => {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(message);
    }
  });
}

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

function createRandomRewards(numPlayers) {
  const rewards = new Array(numPlayers).fill("bomb");
  const winIndex = Math.floor(Math.random() * numPlayers);
  rewards[winIndex] = "win";
  return rewards;
}

console.log("WebSocket server is running on ws://localhost:4000");
