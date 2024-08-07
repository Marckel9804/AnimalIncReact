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
import { useNavigate, useParams } from "react-router-dom";

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
  const [myStatus, setMyStatus] = useState(null);
  const [otherStatus, setOtherStatus] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);

  const [ind, setInd] = useState("food");
  const [comp, setComp] = useState("1");
  const userinfo =
    "#########차후 해당 변수를 유저 정보를 불러오는 코드로 대체#########";

  const { room_id } = useParams();
  const navigate = useNavigate();
  const formatNumber = (number) => {
    const hundredMillion = Math.floor(number / 100000000);
    const remainderAfterHundredMillion = number % 100000000;
    const tenThousand = Math.floor(remainderAfterHundredMillion / 10000);
    const remainder = remainderAfterHundredMillion % 10000;

    let result = "";
    if (hundredMillion > 0) {
      result += `${hundredMillion}억 `;
    }
    if (tenThousand > 0) {
      result += `${tenThousand}만 `;
    }
    if (remainder !== 0) {
      result += remainder;
    }

    return result.trim();
  };

  const getUserInfo = () => {
    axios
      .get(`/game/userStatus/${room_id}`)
      .then((res) => {
        console.log("users", res.data);
        // 데이터 분배
        const myStatusData = res.data.find((item) => item.me === true);
        const otherStatusData = res.data.filter((item) => item.me === false);
        console.log("me", myStatusData);
        console.log("others", otherStatusData);

        // 상태 업데이트
        setMyStatus(myStatusData);
        setOtherStatus(otherStatusData);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
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
      console.log("stock list", res);
      console.log("processed data", processedData);
      setStockInfo(processedData);
    });
  };

  const getRoomInfo = () => {
    axios.get(`/game/roomInfo/${room_id}`).then((res) => {
      console.log("gameStatus", res.data);
      if (res.data.turn == 0) {
        testCall(0);
      } else {
        getUserInfo();
        getStockInfo();
      }
      setGameStatus(res.data);
    });
  };

  const testCall = (turn) => {
    axios.get(`/game/test/${room_id}/${turn}`).then((res) => {
      console.log("test", res);

      setTimeout(() => {
        getStockInfo(), getRoomInfo(), getUserInfo(0);
      }, 3000);
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

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (otherStatus.length === 4 && progress === 100) {
      console.log("댓츠 노노");
      navigate("/");
    }
  }, [otherStatus, progress]);

  if (
    gameStatus === null ||
    myStatus === null ||
    stockInfo === null ||
    otherStatus == null ||
    progress < 100
  ) {
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
        <MyInfo
          show={showMI}
          setShow={setShowMI}
          myStatus={myStatus}
          formatNumber={formatNumber}
        />
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
            gameStatus={gameStatus}
          />
          <ItemsWin show={showIW} setShow={setShowIW} />
        </div>
        <div className="flex-col" style={{ width: "28%" }}>
          <OtherPlayer
            show={showOP}
            setShow={setShowOP}
            otherStatus={otherStatus}
            formatNumber={formatNumber}
          />
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
