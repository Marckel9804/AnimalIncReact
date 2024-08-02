import React, { useEffect, useRef, useState } from "react";
import "./MainGame.css";
import MyInfo from "./MyInfo";
import StockInfo from "./StockInfo";
import OtherPlayer from "./OtherPlayer";
import TaskBar from "./TaskBar";
import StartBar from "./StartBar";
import ItemsWin from "./Items";
import WinChat from "./WinChat";
import axios from "axios";
import { useParams } from "react-router-dom";

function MainGame() {
  const [showMI, setShowMI] = useState(true);
  const [showSI, setShowSI] = useState(true);
  const [showOP, setShowOP] = useState(true);
  const [showIW, setShowIW] = useState(true);
  const [showWC, setShowWC] = useState(true);
  const [showSB, setShowSB] = useState(false);
  const setters = {
    showMI,
    showSI,
    showOP,
    showSB,
    showIW,
    showWC,
    setShowMI,
    setShowSI,
    setShowOP,
    setShowSB,
    setShowIW,
    setShowWC,
  };
  const [progress, setProgress] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  // const userinfo =
  //   "#########차후 해당 변수를 유저 정보를 불러오는 코드로 대체#########";

  // const { room_id } = useParams();
  // const spring = "http://localhost:8080/game";

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress((oldProgress) => {
  //       if (oldProgress >= 100) {
  //         clearInterval(timer);
  //       }
  //       return Math.min(oldProgress + 10, 100);
  //     });
  //   }, 50);

  //   // 여기서 데이터를 불러오는 비동기 함수를 호출합니다.
  //   axios.get(`${spring}/roomInfo/${room_id}`).then((res) => {
  //     console.log(res);
  //     setGameStatus(res);
  //   });

  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  // if (gameStatus === null || progress < 100) {
  //   return (
  //     <div>
  //       <progress
  //         className="nes-progress main-game-loading"
  //         value={progress}
  //         max="100"
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="maingame-container">
      <div className="flex pt-4 pr-4 pl-4 pb-12 ">
        <MyInfo show={showMI} setShow={setShowMI} />
        <div className="flex-col" style={{ width: "50%" }}>
          <StockInfo show={showSI} setShow={setShowSI} />
          <ItemsWin show={showIW} setShow={setShowIW} />
        </div>
        <div className="flex-col" style={{ width: "28%" }}>
          <OtherPlayer show={showOP} setShow={setShowOP} />
          <WinChat show={showWC} setShow={setShowWC} />
        </div>
      </div>

      <StartBar show={showSB} />

      <TaskBar {...setters} />
    </div>
  );
}

export default MainGame;
