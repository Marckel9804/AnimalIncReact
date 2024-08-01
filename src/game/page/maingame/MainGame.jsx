import React, { useRef, useState } from "react";
import "./MainGame.css";
import MyInfo from "./MyInfo";
import StockInfo from "./StockInfo";
import OtherPlayer from "./OtherPlayer";
import TaskBar from "./TaskBar";
import StartBar from "./StartBar";
import ItemsWin from "./Items";

function MainGame() {
  const [showMI, setShowMI] = useState(true);
  const [showSI, setShowSI] = useState(true);
  const [showOP, setShowOP] = useState(true);
  const [showIw, setShowIw] = useState(true);
  const [showSB, setShowSB] = useState(false);
  const setters = {
    showMI,
    showSI,
    showOP,
    showSB,
    showIw,
    setShowMI,
    setShowSI,
    setShowOP,
    setShowSB,
    setShowIw,
  };
  return (
    <div className="maingame-container">
      <div className="flex pt-4 pr-4 pl-4 pb-12 ">
        <MyInfo show={showMI} setShow={setShowMI} />
        <div className="flex-col" style={{ width: "46%" }}>
          <StockInfo show={showSI} setShow={setShowSI} />
          <ItemsWin show={showIw} setShow={setShowIw} />
        </div>
        <OtherPlayer show={showOP} setShow={setShowOP} />
      </div>

      <StartBar show={showSB} />

      <TaskBar {...setters} />
    </div>
  );
}

export default MainGame;
