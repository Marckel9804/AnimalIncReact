import React from "react";
import "./MainGame.css";
import MyInfo from "./MyInfo";
import StockInfo from "./StockInfo";

function MainGame() {
  return (
    <div className=" flex gap-24 m-2 p-4 maingame-container">
      <MyInfo />
      <StockInfo />
      <MyInfo />
    </div>
  );
}

export default MainGame;
