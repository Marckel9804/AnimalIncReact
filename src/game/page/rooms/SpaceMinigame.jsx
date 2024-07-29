import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: #e0ded3;
  border: 4px solid #00a8a8;
  padding: 20px;
  width: 500px;
  height: 350px;
  text-align: center;
  position: relative;
  image-rendering: pixelated;
  background-image: url('/path/to/your/pixel-art-image.png'); /* 적절한 경로 사용 */
  background-size: cover;
  border-radius: 10px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
`;

const CountDisplay = styled.div`
  margin-top: 20px;
`;

const Progress = styled.progress`
  width: 100%;
  margin-top: 20px;
  height: 30px;
  -webkit-appearance: none;
  appearance: none;
  &::-webkit-progress-bar {
    background-color: #ccc;
    border-radius: 5px;
  }
  &::-webkit-progress-value {
    background-color: #00a8a8;
    border-radius: 5px;
  }
`;

const GameMessage = styled.div`
  margin-top: 20px;
  font-size: 1.5em;
  color: red;
`;

const hitAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const SnesLogo = styled.i`
  margin-top: 20px;
  font-size: 2em;
  display: inline-block;
  ${props => props.hit && css`
    animation: ${hitAnimation} 0.2s ease;
  `}
`;

function SpaceMinigame({ onClose }) {
  const [count, setCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [gameMessage, setGameMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isKeyPressed, setIsKeyPressed] = useState(false);
  const [hit, setHit] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space" && !isKeyPressed && !gameOver) {
        setCount((prevCount) => prevCount + 1);
        setProgress((prevProgress) => Math.min(prevProgress + 1, 10));
        setIsKeyPressed(true);
        setHit(true);
        setTimeout(() => setHit(false), 200); // 애니메이션 지속 시간 이후에 hit 상태를 false로 설정
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
  }, [isKeyPressed, gameOver]);

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
    <ModalOverlay>
      <Modal>
        <CloseButton onClick={onClose}>X</CloseButton>
        <p>스페이스바를 10번 연타하세요!</p>
        <CountDisplay>
          <p>현재 카운트: {count}</p>
        </CountDisplay>
        <Progress className="nes-progress is-primary" value={progress} max="10"></Progress>
        <SnesLogo className="snes-jp-logo" hit={hit ? 1 : 0} />
        {gameMessage && <GameMessage>{gameMessage}</GameMessage>}
      </Modal>
    </ModalOverlay>
  );
}

export default SpaceMinigame;
