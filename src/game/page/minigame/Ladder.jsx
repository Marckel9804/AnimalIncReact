import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import bomb from "../../../image/ladder-bomb.jpeg";
import win from "../../../image/ladder-win.jpeg";
import "./loading.css";

const Ladder = ({ roomId }) => {
  const canvasRef = useRef(null);
  const [players, setPlayers] = useState([]);
  const [rewards] = useState([win, bomb, bomb, bomb]);
  const [gameState, setGameState] = useState("waiting");
  const [results, setResults] = useState([]);
  const [ladder, setLadder] = useState([]);
  const [modal, setModal] = useState(false);
  const [clientId, setClientId] = useState(null);
  const [ws, setWs] = useState(null);

  const canvasWidth = 896 * 2;
  const canvasHeight = 300;

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
    setWs(socket);

    socket.onopen = () => {
      console.log("Connected to the server");
      ws.send(JSON.stringify({ type: "join", roomId }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "players":
          setPlayers(message.players);
          break;
        case "startGame":
          setLadder(message.ladder);
          setGameState("running");
          setModal(false);
          break;
        case "gameEnded":
          setResults(message.results);
          setGameState("end");
          break;
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from the server");
    };

    return () => {
      socket.close();
    };
  }, [roomId]);

  useEffect(() => {
    if (players.length > 0 && !clientId) {
      setClientId(players[players.length - 1].clientId);
    }
  }, [players, clientId]);

  useEffect(() => {
    if (ladder.length > 0 && gameState === "running") {
      drawLadderFromStructure(ladder);
      startGame(ladder);
    }
  }, [ladder, gameState]);

  const toggleReady = () => {
    if (ws && clientId) {
      const player = players.find((p) => p.clientId === clientId);
      if (player) {
        ws.send(
          JSON.stringify({ type: "ready", clientId, ready: !player.ready })
        );
      }
    }
  };

  const drawLadderFromStructure = (ladder) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const numParticipants = players.length;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;

    const verticalGap = canvasWidth / (numParticipants + 1);
    const horizontalGap = canvasHeight / (ladder.length + 1);

    // Draw vertical lines
    for (let i = 1; i <= numParticipants; i++) {
      const x = i * verticalGap;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    // Draw horizontal lines
    ladder.forEach((row, rowIndex) => {
      const y = (rowIndex + 1) * horizontalGap;
      row.forEach((hasLine, colIndex) => {
        if (hasLine) {
          const x1 = (colIndex + 1) * verticalGap;
          const x2 = (colIndex + 2) * verticalGap;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
        }
      });
    });
  };

  const animatePath = (ctx, startCol, ladder, width, height, color) => {
    return new Promise((resolve) => {
      let col = startCol;
      let row = 0;
      const verticalGap = width / (players.length + 1);
      const horizontalGap = height / (ladder.length + 1);

      const animate = () => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;

        const startX = (col + 1) * verticalGap;
        const startY = row * horizontalGap;
        const endY = (row + 1) * horizontalGap;

        // Vertical movement
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, endY);
        ctx.stroke();

        // Horizontal movement
        if (row < ladder.length) {
          if (ladder[row][col]) {
            // Move right
            const endX = (col + 2) * verticalGap;
            ctx.moveTo(startX, endY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            col++; // Move right
          } else if (col > 0 && ladder[row][col - 1]) {
            // Move left
            const endX = col * verticalGap;
            ctx.moveTo(startX, endY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            col--; // Move left
          }
        }

        row++;

        if (row <= ladder.length) {
          setTimeout(() => requestAnimationFrame(animate), 100);
        } else {
          const finalY = height;
          const finalX = (col + 1) * verticalGap;
          ctx.beginPath();
          ctx.moveTo(finalX, ladder.length * horizontalGap);
          ctx.lineTo(finalX, finalY);
          ctx.stroke();
          resolve(col);
        }
      };

      animate();
    });
  };

  const startGame = async (ladder) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const colors = ["red", "blue", "green", "yellow"];

    for (let i = 0; i < players.length; i++) {
      const result = await animatePath(
        ctx,
        i,
        ladder,
        canvasWidth,
        canvasHeight,
        colors[i]
      );
      ws.send(
        JSON.stringify({
          type: "finishPath",
          clientId: players[i].clientId,
          result,
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  return (
    <LadderContainer>
      <LadderGame>
        <LadderHead>
          Ladder Game <BoxIcon>x</BoxIcon>
        </LadderHead>
        <GameContent>
          <PlayerList>
            {players.map((player) => (
              <Player key={player.clientId}>
                {player.nickname}
                <Character>{player.ready ? "Ready" : "Not Ready"}</Character>
              </Player>
            ))}
          </PlayerList>
          {gameState !== "waiting" && (
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{ margin: "20px 0", display: "block", width: "110%" }}
            />
          )}
          <RewardList>
            {players.map((player, index) => (
              <RewardItem key={player.clientId}>
                <Reward
                  src={rewards[index % rewards.length]}
                  alt={`Reward ${index + 1}`}
                />
                {gameState === "end" && (
                  <ParticipantId>
                    {
                      players[
                        results.find((r) => r.clientId === player.clientId)
                          ?.result
                      ]?.nickname
                    }
                  </ParticipantId>
                )}
              </RewardItem>
            ))}
          </RewardList>
        </GameContent>
        {gameState === "waiting" && (
          <button className="nes-btn is-warning" onClick={toggleReady}>
            {players.find((p) => p.clientId === clientId)?.ready
              ? "Cancel Ready"
              : "Ready"}
          </button>
        )}
        {modal && (
          <LadderWindow>
            <LadderHead>
              세상에서 제일 지루한 중학교는? 로딩중 ...<BoxIcon>x</BoxIcon>
            </LadderHead>
            <Loading>
              <div className="ladder-loader-hhy"></div>
              {gameState === "start" && (
                <button className="nes-btn is-warning" onClick={startGame}>
                  Start Game
                </button>
              )}
            </Loading>
          </LadderWindow>
        )}
      </LadderGame>
    </LadderContainer>
  );
};

const LadderContainer = styled.div`
  background-color: #027d7c;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LadderGame = styled.div`
  position: relative;
  border-top: 2px #f0ffff solid;
  border-left: 2px #f0ffff solid;
  border-right: 2px #252525 solid;
  border-bottom: 2px #252525 solid;
  background-color: #c0c0c0;
  width: 90%;
  height: 80%;
`;

const GameContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const LadderHead = styled.div`
  background-color: #808080;
  margin: 2px;
  padding: 2px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoxIcon = styled.div`
  border-top: 2px #f0ffff solid;
  border-left: 2px #f0ffff solid;
  border-right: 2px #252525 solid;
  border-bottom: 2px #252525 solid;
  width: 17px;
  height: 17px;
  background-color: #bcbfbc;
  display: flex;
  justify-content: center;
  padding-right: 2px;
  font-size: 15px;
  user-select: none;
  align-items: center;
`;

const PlayerList = styled.div`
  margin-top: 5px;
  width: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Player = styled.div`
  text-align: center;
`;

const Character = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 1px 1px 0px 1px #cccccc;
`;

const RewardList = styled.div`
  display: flex;
  width: 70%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`;

const Reward = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
`;

const Loading = styled.div`
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LadderWindow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #c0c0c0;
  border-top: 2px #f0ffff solid;
  border-left: 2px #f0ffff solid;
  border-right: 2px #252525 solid;
  border-bottom: 2px #252525 solid;
  z-index: 10; // 다른 요소들 위에 표시되도록 z-index 설정
`;

const RewardItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ParticipantId = styled.div`
  margin-top: 5px;
  font-weight: bold;
`;

export default Ladder;
