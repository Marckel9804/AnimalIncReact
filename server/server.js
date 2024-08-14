import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const rooms = new Map();

const wss = new WebSocketServer({ port: 4000 });
let players = [];
let readyCount = 0;
let gameState = "waiting";
let ladder = [];
let results = [];
let gameOver = false; // 게임 종료 상태 추가

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  const player = {
    clientId,
    ws,
    ready: false,
    nickname: `Player${players.length + 1}`,
    grade: "Gold",
    points: 1000,
    score: 0, // 스페이스바 횟수를 위한 필드 추가
  };
  players.push(player);

  if (players.length > 4) {
    ws.send(JSON.stringify({ type: "roomFull" }));
    ws.close();
    return;
  }

  // 클라이언트 초기화 메시지 전송
  ws.send(
    JSON.stringify({ type: "init", clientId, playerNum: players.length })
  );

  // broadcastPlayers();

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message.toString()); // Buffer를 문자열로 변환하여 JSON으로 파싱
    console.log("Received message >> ", parsedMessage);

    switch (parsedMessage.type) {
      case "join":
        handleJoin(ws, clientId, parsedMessage.room_id);
        break;
      case "finishPath":
        handleFinishPath(parsedMessage);
        break;
      case "count":
        handleSpaceBarPress(parsedMessage); // 스페이스바 이벤트 처리 추가
        break;
      default:
        broadcast(parsedMessage);
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

// 스페이스바 이벤트 핸들러 수정
function handleSpaceBarPress(message) {
  const player = players.find((p) => p.clientId === message.clientId);
  if (player) {
    player.score += 1;

    console.log(`Player ${player.nickname} score: ${player.score}`);

    if (!gameOver && player.score >= 10) {
      gameOver = true;
      console.log(`Player ${player.nickname} is the winner!`);

      // 첫 번째로 10번을 달성한 플레이어에게만 1등 메시지 전송
      player.ws.send(
        JSON.stringify({
          type: "gameOver",
          message: "1등입니다! 게임이 종료되었습니다.",
          isWinner: true, // 1등 여부를 나타내는 필드 추가
        })
      );

      // 나머지 플레이어들에게 게임 종료를 알림
      players.forEach((p) => {
        if (p.clientId !== player.clientId) {
          p.ws.send(
            JSON.stringify({
              type: "gameOver",
              message: "게임이 종료되었습니다.",
            })
          );
        }
      });
    }

    // 업데이트된 점수를 모든 클라이언트에게 전송
    broadcast(
      JSON.stringify({
        type: "count",
        clientId: player.clientId,
        count: player.score,
        playerNum: players.indexOf(player) + 1, // 플레이어 번호 추가
      })
    );
  }
}

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        typeof message === "string" ? message : JSON.stringify(message)
      );
    }
  });
}

console.log("WebSocket server is running on ws://localhost:4000");
