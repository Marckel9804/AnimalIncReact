import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import "nes.css/css/nes.min.css";
import axios from "../../../utils/axios.js";
import { v4 as uuidv4 } from "uuid"; // uuidv4 함수 임포트

const SpaceMinigame = ({ onClose }) => {
  const [count, setCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [gameMessage, setGameMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [hit, setHit] = useState(false);
  const [players, setPlayers] = useState([]); // 플레이어 상태 추가
  const [userInfo, setUserInfo] = useState(null); // 유저 정보를 저장할 상태 추가
  const socketRef = useRef(null);
  const clientId = useRef(uuidv4());
  const [playerNum, setPlayerNum] = useState(null); // 플레이어 번호 상태
  const [playerCounts, setPlayerCounts] = useState([0, 0, 0, 0]); // 모든 플레이어의 카운트를 관리

  useEffect(() => {
    const fetchLoggedInPlayer = async () => {
      try {
        const response = await axios.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const loggedInPlayer = response.data;
        setUserInfo(loggedInPlayer);
        console.log("Logged in player info:", loggedInPlayer); // 이 부분에서 로그를 찍어 확인
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };

    fetchLoggedInPlayer();
  }, []);

  useEffect(() => {
    if (userInfo) {
      const socket = new WebSocket("ws://localhost:4000");
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("Connected to WebSocket server");
        socket.send(
          JSON.stringify({
            type: "login",
            clientId: clientId.current,
            userNickname: userInfo.userNickname,
            userGrade: userInfo.userGrade,
            userPoint: userInfo.userPoint,
            userPicture: userInfo.userPicture,
          })
        );
      };

      socket.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        console.log("Received from server:", parsedMessage);

        if (parsedMessage.type === "init" && parsedMessage.clientId) {
          clientId.current = parsedMessage.clientId;
          setPlayerNum(parsedMessage.playerNum);
        } else if (parsedMessage.type === "players") {
          setPlayers(parsedMessage.players);
          console.log("Updated players state:", parsedMessage.players);
        } else if (parsedMessage.type === "count") {
          setPlayerCounts((prevCounts) => {
            const newCounts = [...prevCounts];
            newCounts[parsedMessage.playerNum - 1] = parsedMessage.count;
            return newCounts;
          });
        } else if (parsedMessage.type === "gameOver") {
          setGameOver(true);
          if (parsedMessage.isWinner) {
            setGameMessage("1등입니다! 게임이 종료되었습니다.");
          } else {
            setGameMessage("게임이 종료되었습니다.");
          }
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        socket.close();
      };
    }
  }, [userInfo, onClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.code === "Space" &&
        !isKeyPressed &&
        !gameOver &&
        playerNum !== null &&
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        const newCount = count + 1;
        const newProgress = Math.min(progress + 1, 10);
        setCount(newCount);
        setProgress(newProgress);
        setIsKeyPressed(true);
        setHit(true);
        setTimeout(() => setHit(false), 200);

        const playerData = {
          type: "count",
          clientId: clientId.current,
          count: newCount,
          progress: newProgress,
          playerNum,
        };

        socketRef.current.send(JSON.stringify(playerData));

        setPlayerCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          newCounts[playerNum - 1] = newCount;
          return newCounts;
        });
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === "Space") {
        setIsKeyPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isKeyPressed, gameOver, count, progress, playerNum]);

  useEffect(() => {
    if (count > highScore) {
      setHighScore(count);
    }
  }, [count, highScore]);

  return (
    <MinigameContainer>
      <Minigame>
        <MinigameHead>
          Space Minigame <BoxIcon onClick={onClose}>x</BoxIcon>
        </MinigameHead>
        <Instructions>스페이스바를 10번 연타하세요!</Instructions>
        <CountDisplay>
          <p>현재 카운트: {count}</p>
        </CountDisplay>
        <ProgressContainer>
          <div id="space-progress">
            <progress
              className="nes-progress is-pattern"
              value={progress}
              max="10"
            ></progress>
          </div>
        </ProgressContainer>
        <PlayerList>
          {players.map((player, index) => (
            <Player key={player.clientId}>
              <Character>
                <img src={player.picture}></img>
              </Character>
              {playerNum === index + 1
                ? `${count}회`
                : `${playerCounts[index]}회`}
            </Player>
          ))}
        </PlayerList>
        <ButtonContainer>
          <StyledButton $hit={hit ? 1 : 0} className="minigame-nes-btn">
            Space Bar
          </StyledButton>
        </ButtonContainer>

        {gameMessage && <GameMessage>{gameMessage}</GameMessage>}
      </Minigame>
    </MinigameContainer>
  );
};

// styled-components: 게임 UI 스타일링
const MinigameContainer = styled.div`
  background-color: #4cbdb8;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Minigame = styled.div`
  border-top: 2px #f0ffff solid;
  border-left: 2px #f0ffff solid;
  border-right: 2px #252525 solid;
  border-bottom: 2px #252525 solid;
  background-color: #c0c0c0;
  width: 90%;
  height: 80%;
`;

const MinigameHead = styled.div`
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
  cursor: pointer;
`;

const Instructions = styled.p`
  text-align: center;
  font-size: 2em;
  margin-top: 70px;
`;

const CountDisplay = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const ProgressContainer = styled.div`
  width: 99%;
  margin-top: 20px;
`;

const hitAnimation = keyframes`
  0% {
    transform: translateY(0);
  50% {
    transform: translateY(-150px);
  100% {
    transform: translateY(0);
  }
`;

const ButtonContainer = styled.div`
  margin-top: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledButton = styled.button`
  position: relative;
  top: 0;
  width: 200px;
  height: 50px;
  font-size: 1.5em;
  box-shadow: inset -4px -4px #adafbc;
  background-color: #e0e0e0;
  border: 2px solid #252525;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:active {
    box-shadow: inset 4px 4px #adafbc;
  }
  ${(props) =>
    props.$hit &&
    css`
      animation: ${hitAnimation} 0.2s ease;
    `}
`;

const sparkle = keyframes`
  0% {
    opacity: 1;
  50% {
    opacity: 0.5;
  100% {
    opacity: 1;
  }
`;

const GameMessage = styled.div`
  margin-top: 60px;
  font-size: 1.5em;
  color: black;
  text-align: center;
  font-weight: bold;
  animation: ${sparkle} 1s infinite;
`;

const PlayerList = styled.div`
  margin-top: 95px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.5em;
  overflow: hidden; /* 원형 밖으로 나가는 부분 숨김 */
`;

export default SpaceMinigame;
