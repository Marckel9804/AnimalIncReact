import React, { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import bomb from "../../../image/ladder-bomb.jpeg";
import win from "../../../image/ladder-win.jpeg";
import "./loading.css";
import { useParams, useNavigate } from "react-router-dom";

// Custom hook to block navigation
const useBlocker = (blocker, when = true) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!when) return;

    const unblock = navigate((tx) => {
      if (window.confirm(blocker)) {
        unblock();
        return true;
      } else {
        return false;
      }
    });

    return unblock;
  }, [blocker, when, navigate]);
};

const Ladder = ({
  setMyStatus,
  myStatus,
  setMiniL,
  updateTurn,
  gameStatus,
}) => {
  const canvasRef = useRef(null);
  const [players, setPlayers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [gameState, setGameState] = useState("waiting");
  const [results, setResults] = useState([]);
  const [ladder, setLadder] = useState([]);
  const [modal, setModal] = useState(true);
  const [clientId, setClientId] = useState(null);
  const [ws, setWs] = useState();
  const [countdown, setCountdown] = useState(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const navigate = useNavigate();
  // 👇🏻 게임 우승자 저장하는 변수 !!!!
  const [winner, setWinner] = useState(null);
  let end = false;

  const params = useParams();
  const room_id = params.room_id;

  const canvasWidth = 896 * 2;
  const canvasHeight = 300;

  const blocker = useCallback(() => {
    return "게임이 진행 중입니다. 정말로 나가시겠습니까?";
  }, []);

  useBlocker(blocker, isGameRunning);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
    setWs(socket);

    socket.onopen = () => {
      console.log("Connected to the server");
      socket.send(JSON.stringify({ type: "join", room_id }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "players":
          setPlayers(message.players);
          setTotalParticipants(message.totalParticipants);
          setCurrentParticipants(message.currentParticipants);
          console.log("players : ", message.players);
          break;
        case "countdown":
          setCountdown(message.count);
          break;
        case "startGame":
          console.log("Received startGame message:", message);
          setLadder(message.ladder);
          setRewards(message.rewards);
          setGameState("running");
          setModal(false);
          setCountdown(null);
          break;
        case "gameEnded":
          console.log("Game ended message received:", message);
          setResults(message.results);
          setGameState("end");
          setInterval(() => {
            setMiniL(false);
          }, 8000);
          console.log("우승자:", message.winner);
          if (message.winner && message.winner.userNum === myStatus.usernum) {
            const prize = getRandomTwo();
            setMyStatus((prevStatus) => ({
              ...prevStatus,
              [prize[0]]: prevStatus[prize[0]] + 1,
              [prize[1]]: prevStatus[prize[1]] + 1,
            }));
          }
          break;
        case "gameState":
          setGameState(message.state);
          setTotalParticipants(message.totalParticipants);
          setCurrentParticipants(message.currentParticipants);
          if (message.state === "running") {
            setLadder(message.ladder);
            setModal(false);
            setCountdown(null);
          }
          break;
        case "roomFull":
          alert("The room is full. Please try again later.");
          break;
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from the server");
    };

    return () => {
      socket.close();
    };
  }, [room_id]);

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

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isGameRunning) {
        e.preventDefault();
        e.returnValue = "게임이 진행 중입니다. 정말로 나가시겠습니까?";
      }
    };

    const handlePopState = (e) => {
      if (isGameRunning) {
        if (window.confirm("게임이 진행 중입니다. 정말로 나가시겠습니까?")) {
          navigate(-1);
        } else {
          window.history.pushState(null, "", window.location.pathname);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // 페이지 로드 시 history에 현재 상태 추가
    window.history.pushState(null, "", window.location.pathname);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isGameRunning, navigate]);

  useEffect(() => {
    if (gameState === "running") {
      setIsGameRunning(true);
    } else {
      setIsGameRunning(false);
    }
  }, [gameState]);

  function getRandomTwo() {
    const items = [
      "shortSelling",
      "fakeNews",
      "goodNews",
      "timeMachine",
      "lottery",
    ];
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }

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
    console.log("Starting game with ladder:", ladder);
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
      console.log("Sending finishPath message:", {
        type: "finishPath",
        clientId: players[i].clientId,
        result,
      });
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
          {/* <ParticipantInfo>
            <div className="text-3xl font-bold">
              Players: {currentParticipants} / {totalParticipants}
            </div>
          </ParticipantInfo> */}
          <PlayerList>
            {players.map((player) => (
              <Player key={player.clientId}>
                <div className="text-xl font-bold">{player.nickname}</div>
                <Character>
                  <img src={player.userPicture} alt={player.nickname} />
                </Character>
              </Player>
            ))}
          </PlayerList>
          {gameState !== "waiting" && (
            <>
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                style={{ margin: "20px 0", display: "block", width: "110%" }}
              />
              <RewardList>
                {rewards.map((rewardType, index) => (
                  <RewardItem key={index}>
                    <Reward
                      src={rewardType === "win" ? win : bomb}
                      alt={`Reward ${index + 1}`}
                    />
                    {gameState === "end" && (
                      <ParticipantId>
                        <div className="text-xl font-bold">
                          {results.find((r) => r.result === index)?.nickname ||
                            ""}
                        </div>
                      </ParticipantId>
                    )}
                  </RewardItem>
                ))}
              </RewardList>
              {gameState === "end" && winner && (
                <WinnerAnnouncement>
                  Winner: {winner.nickname}!
                </WinnerAnnouncement>
              )}
            </>
          )}
        </GameContent>
        {modal && (
          <LadderWindow>
            <LadderHead>
              세상에서 제일 지루한 중학교는? 로딩중... ( {currentParticipants} /{" "}
              {totalParticipants} )<BoxIcon>x</BoxIcon>
            </LadderHead>
            <Loading>
              {countdown !== null ? (
                <CountdownText>{countdown}</CountdownText>
              ) : (
                <CountdownText>다른 참가자들 기다리는 중 ...</CountdownText>
              )}
              <div className="ladder-loader-hhy"></div>
            </Loading>
          </LadderWindow>
        )}
      </LadderGame>
    </LadderContainer>
  );
};

const WinnerAnnouncement = styled.div`
  font-size: 3em;
  font-weight: bold;
  margin-top: 20px;
  color: #ffd700;
`;

const CountdownText = styled.div`
  font-size: 48px;
  font-weight: bold;
  margin-top: 20px;
`;

const LadderContainer = styled.div`
  background-color: transparent;
  width: 99vw;
  height: 99vh;
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
  margin-top: 30px;
  width: 70%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Player = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
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
  width: 120px;
  height: 120px;
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
  z-index: 10;
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

const ParticipantInfo = styled.div`
  font-size: 18px;
  margin-top: 10px;
`;

export default Ladder;
