import React, { useEffect, useRef, useState } from "react";
import "./MainGame.css";
import MyInfo from "./MyInfo.jsx";
import StockInfo from "./StockInfo.jsx";
import OtherPlayer from "./OtherPlayer.jsx";
import TaskBar from "./TaskBar.jsx";
import StartBar from "./StartBar.jsx";
import ItemsWin from "./Items.jsx";
import WinChat from "./WinChat.jsx";
import axios from "../../../utils/axios.js";
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
  const [userInfo, setUserInfo] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);

  const [ind, setInd] = useState("food");
  const [comp, setComp] = useState("1");
  const userinfo =
    "#########차후 해당 변수를 유저 정보를 불러오는 코드로 대체#########";

  const { room_id } = useParams();

  const getUserInfo = () => {
    axios.get(`/game/userStatus/${room_id}`).then((res) => {
      console.log("user list", res);
      setUserInfo(res.data);
    });
  };

  const getStockInfo = () => {
    axios.get(`/game/stockStatus/${room_id}`).then((res) => {
      const processedData = res.data.reduce(
        (acc, { stockId, price, weight }) => {
          if (!acc[stockId]) {
            acc[stockId] = { price: [], weight: [] };
          }
          acc[stockId].price.push(price);
          acc[stockId].weight.push(weight);
          return acc;
        },
        {}
      );
      if (res.data.length == 0) {
        testCall(1);
      }
      console.log("stock list", res);
      console.log("processed data", processedData);
      setStockInfo(processedData);
    });
  };

  const getRoomInfo = () => {
    axios.get(`/game/roomInfo/${room_id}`).then((res) => {
      console.log(res);
      setGameStatus(res.data);
    });
  };

  const testCall = (turn) => {
    axios.get(`/game/test/${room_id}/${turn}`).then((res) => {
      console.log("test", res);
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 50);

    // 여기서 데이터를 불러오는 비동기 함수를 호출합니다.
    getRoomInfo();
    getUserInfo();
    getStockInfo();

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (gameStatus === null || progress < 100) {
    return (
      <div>
        <progress
          className="nes-progress main-game-loading"
          value={progress}
          max="100"
        />
      </div>
    );
  }

  return (
    <div className="maingame-container">
      <div className="flex pt-4 pr-4 pl-4 pb-12 ">
        <MyInfo show={showMI} setShow={setShowMI} getUserInfo={getUserInfo} />
        <div className="flex-col" style={{ width: "50%" }}>
          <StockInfo
            show={showSI}
            setShow={setShowSI}
            testCall={testCall}
            stockInfo={stockInfo}
            ind={ind}
            setInd={setInd}
            comp={comp}
            setComp={setComp}
          />
          <ItemsWin show={showIW} setShow={setShowIW} />
        </div>
        <div className="flex-col" style={{ width: "28%" }}>
          <OtherPlayer show={showOP} setShow={setShowOP} />
          <WinChat
            show={showWC}
            setShow={setShowWC}
            ind={ind}
            comp={comp}
            stockInfo={stockInfo}
          />
        </div>
      </div>

      <StartBar show={showSB} />

      <TaskBar {...setters} />
    </div>
  );
}

export default MainGame;
