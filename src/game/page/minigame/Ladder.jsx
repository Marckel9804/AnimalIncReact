import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import bomb from "../../../image/ladder-bomb.jpeg";
import win from "../../../image/ladder-win.jpeg";
import "./loading.css";

const Ladder = () => {
  // 임시 사용자 id
  const userId = "P1";
  const canvasRef = useRef(null);
  const [participants] = useState(["P1", "P2", "P3", "P4"]);
  const [rewards, setRewards] = useState([win, bomb, bomb, bomb]);
  const [gameState, setGameState] = useState("start");
  const [results, setResults] = useState([]);
  const [ladder, setLadder] = useState([]);
  const [modal, setModal] = useState(false);

  const canvasWidth = 896 * 2; // 가로 길이를 2배로 늘림
  const canvasHeight = 300; // 기존 높이 유지

  // 1단계 : 사다리 그리기
  const drawLadder = (ctx, width, height) => {
    const numParticipants = participants.length;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    const verticalGap = width / (numParticipants + 1);
    const horizontalGap = height / 15;

    let maxHorizontalLines = Math.floor(Math.random() * 10) * 2 + 2; // 2, 4, ..., 20

    const newLadder = Array.from({ length: maxHorizontalLines }, () =>
      Array(numParticipants - 1).fill(false)
    );

    // 수직선 그리기
    for (let i = 1; i <= numParticipants; i++) {
      const x = i * verticalGap;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 수평선 그리기
    for (let row = 0; row < maxHorizontalLines; row++) {
      const y = (row + 1) * horizontalGap;
      const col = Math.floor(Math.random() * (numParticipants - 1));

      newLadder[row][col] = true;
      const x1 = (col + 1) * verticalGap;
      const x2 = (col + 2) * verticalGap;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.stroke();
    }

    return newLadder;
  };

  // 2단계 : 사다리타기 애니메이션 실행 !
  const animatePath = (ctx, startCol, ladder, width, height, color) => {
    return new Promise((resolve) => {
      let col = startCol;
      let row = 0;
      const verticalGap = width / (participants.length + 1);
      const horizontalGap = height / 15;

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

  // 사다리 타기 게임을 시작하는 함수~~
  const startGame = async () => {
    setModal(false);
    setGameState("running");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 기존 사다리 구조를 사용
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawLadderFromStructure(ctx, ladder, canvasWidth, canvasHeight);

    const colors = ["red", "blue", "green", "yellow"];
    const newResults = [];

    for (let i = 0; i < participants.length; i++) {
      const result = await animatePath(
        ctx,
        i,
        ladder,
        canvasWidth,
        canvasHeight,
        colors[i]
      );
      newResults.push(result);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setResults(newResults);
    setGameState("end");
  };

  // 사다리 구조를 기반으로 사다리 다시 그리기
  const drawLadderFromStructure = (ctx, ladder, width, height) => {
    const numParticipants = participants.length;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 10;

    const verticalGap = width / (numParticipants + 1);
    const horizontalGap = height / 15;

    // 수직선 그리기
    for (let i = 1; i <= numParticipants; i++) {
      const x = i * verticalGap;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 수평선 그리기
    ladder.forEach((row, rowIndex) => {
      row.forEach((hasLine, colIndex) => {
        if (hasLine) {
          const y = (rowIndex + 1) * horizontalGap;
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

  const openModal = () => {
    return (
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
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const newLadder = drawLadder(ctx, canvasWidth, canvasHeight);

    // 로딩중 화면 띄우기 => 0.1초 뒤 닫히고 사다리 만들어짐
    setModal(true);
    setTimeout(() => {});

    setLadder(newLadder);
  }, []);

  return (
    <LadderContainer>
      <LadderGame>
        <LadderHead>
          Ladder Game <BoxIcon>x</BoxIcon>
        </LadderHead>
        <GameContent>
          <PlayerList>
            {participants.map((item, index) => (
              <Player key={index}>
                {item}
                <Character>^m^</Character>
              </Player>
            ))}
          </PlayerList>
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ margin: "20px 0", display: "block", width: "100%" }}
          />
          <RewardList>
            {participants.map((item, index) => (
              <RewardItem key={index}>
                <Reward src={rewards[index]} alt={`Reward ${index + 1}`} />
                {gameState === "end" && (
                  <ParticipantId>
                    {participants[results.indexOf(index)]}
                  </ParticipantId>
                )}
              </RewardItem>
            ))}
          </RewardList>
        </GameContent>
        {modal ? openModal() : null}
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
`;

const RewardList = styled.div`
  display: flex;
  width: 70%;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
`;

const Reward = styled.img`
  width: 50px;
  height: 50px;
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
