import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import 'nes.css/css/nes.min.css';

const SpaceMinigame = ({ onClose }) => {
  const [count, setCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [gameMessage, setGameMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [hit, setHit] = useState(false);
  const socketRef = useRef(null);

  const [otherPlayers, setOtherPlayers] = useState([
    { name: "P2", count: 0 },
    { name: "P3", count: 0 },
    { name: "P4", count: 0 },
  ]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = async (event) => {
      const text = await event.data.text();
      const data = JSON.parse(text);
      if (data.type === 'count') {
        setCount(data.count);
        setProgress(data.progress);
        setOtherPlayers(data.otherPlayers);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && !isKeyPressed && !gameOver) {
        const newCount = count + 1;
        const newProgress = Math.min(progress + 1, 10);
        setCount(newCount);
        setProgress(newProgress);
        setIsKeyPressed(true);
        setHit(true);
        setTimeout(() => setHit(false), 200); // 애니메이션 지속 시간 이후에 hit 상태를 false로 설정

        if (socketRef.current) {
          socketRef.current.send(JSON.stringify({ type: 'count', count: newCount, progress: newProgress, otherPlayers }));
        }
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
  }, [isKeyPressed, gameOver, count, progress, otherPlayers]);

  useEffect(() => {
    if (count > highScore) {
      setHighScore(count);
    }

    if (count >= 10) {
      setGameMessage("1등입니다!");
      setGameOver(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [count, highScore, onClose]);

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
          <progress className="nes-progress is-pattern" value={progress} max="10"></progress>
        </ProgressContainer>
        <PlayerList>
          <Player>
            <Character>P1</Character>
            {count}회
          </Player>
          {otherPlayers.map((player, index) => (
            <Player key={index}>
              <Character>{player.name}</Character>
              {player.count}회
            </Player>
          ))}
        </PlayerList>
        <ButtonContainer>
          <StyledButton hit={hit ? 1 : 0} className="nes-btn">Space Bar</StyledButton>
        </ButtonContainer>
        
        {gameMessage && <GameMessage>{gameMessage}</GameMessage>}
      </Minigame>
    </MinigameContainer>
  );
};

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
  font-size: 2.0em;
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
  }
  50% {
    transform: translateY(-150px);
  }
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
  ${props =>
    props.hit &&
    css`
      animation: ${hitAnimation} 0.2s ease;
    `}
`;

const sparkle = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
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
`;

export default SpaceMinigame;
