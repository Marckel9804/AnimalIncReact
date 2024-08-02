import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import "./loading.css";
import bomb from "../../../image/ladder-bomb.jpeg";
import win from "../../../image/ladder-win.jpeg";

const Ladder = () => {
  const canvasRef = useRef(null); // 사다리를 그리기 위해 canvas 태그 사용
  const [participants, setParticipants] = useState(["P1", "P2", "P3", "P4"]); // 참가자 목록 (임시)
  const [reward, setReward] = useState([win, bomb, bomb, bomb]); // 리워드 랜덤 출력을 위한 변수
  const [gameStarted, setGameStarted] = useState(true); // 사다리게임 시작하기 위한 변수
  const [modal, setModal] = useState(false); // '로딩중' 모달 띄우기~

  const drawLadder = (canvas, ctx) => {
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
    const numParticipants = participants.length;
    const ladderHeight = 400; // 사다리 높이
    const ladderWidth = 300; // 사다리 너비

    // 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 전체를 지워버림
    ctx.strokeStyle = "#000"; // 선의 색깔을 설정
    ctx.lineWidth = 0.5; // 선의 두께를 설정

    // 수직 선 그리기
    for (let i = 0; i < numParticipants; i++) {
      const x = (i * ladderWidth) / (numParticipants - 1);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ladderHeight);
    }

    // 수평 선 그리기 (랜덤으로)
    for (let i = 1; i < numParticipants; i++) {
      for (let j = 0; j < numParticipants - 1; j++) {
        const x1 = (j * ladderWidth) / (numParticipants - 1);
        const x2 = ((j + 1) * ladderWidth) / (numParticipants - 1);
        const y = Math.random() * 500;
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
      }
    }

    ctx.stroke(); // 선 그리기
  };

  const openModal = () => {
    return (
      <LadderWindow>
        <LadderHead>
          세상에서 제일 지루한 중학교는? 로딩중 ...<BoxIcon>x</BoxIcon>
        </LadderHead>
        <Loading>
          <div className="ladder-loader-hhy"></div>
        </Loading>
      </LadderWindow>
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 로딩중 화면 띄우기 => 0.1초 뒤 닫히고 사다리 만들어짐
    setModal(true);
    setTimeout(() => {
      setModal(false);
      drawLadder(canvas, ctx);
      animateFill(ctx); // 애니메이션 시작
    }, 1000);
  }, [gameStarted]);

  // 애니메이션 함수
  const lines = [];
  const animateFill = (ctx) => {
    let lineIndex = 0;
    const fillColor = "red";
    const animationDuration = 2000; // 애니메이션 지속 시간 (ms)
    const stepDuration = animationDuration / lines.length; // 각 단계의 지속 시간

    const fillNextLine = () => {
      if (lineIndex < lines.length) {
        const { x1, y, x2 } = lines[lineIndex];

        // 선을 따라 색을 칠하기
        ctx.fillStyle = fillColor;
        ctx.fillRect(x1, y - 5, x2 - x1, 10); // 선 위에 색칠

        lineIndex++;
        setTimeout(fillNextLine, stepDuration); // 다음 선으로 이동
      }
    };

    fillNextLine(); // 애니메이션 시작
  };

  return (
    <LadderContainer>
      <LadderGame>
        <LadderHead>
          Ladder Game <BoxIcon>x</BoxIcon>
        </LadderHead>
        <PlayerList>
          {participants.map((item, index) => {
            return (
              <Player key={index}>
                {item}
                <Character>^m^</Character>🐳
              </Player>
            );
          })}
        </PlayerList>
        {modal ? openModal() : null}
        <canvas
          ref={canvasRef}
          style={{ width: "75%", height: "50%", margin: "0 auto" }}
        />

        <RewardList>
          {participants.map((item, index) => {
            return <Reward src={reward[index]} key={index} />;
          })}
        </RewardList>
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
  border-top: 2px #f0ffff solid;
  border-left: 2px #f0ffff solid;
  border-right: 2px #252525 solid;
  border-bottom: 2px #252525 solid;
  background-color: #c0c0c0;
  width: 90%;
  height: 80%;
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

const Loading = styled.div`
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayerList = styled.div`
  margin-top: 5px;
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

const LadderWindow = styled.div`
  width: 80vw;
  height: 50vh;
  background-color: #c0c0c0;
  border-top: 2px #f0ffff solid;
  border-left: 2px #f0ffff solid;
  border-right: 2px #252525 solid;
  border-bottom: 2px #252525 solid;
  margin: auto;
`;

const RewardList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
`;

const Reward = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

export default Ladder;
