import React, { useEffect, useRef, useState } from "react";
import "./MainGame.css";
import MyInfo from "./MyInfo.jsx";
import StockInfo from "./StockInfo.jsx";
import OtherPlayer from "./OtherPlayer.jsx";
import TaskBar from "./TaskBar.jsx";
import StartBar from "./StartBar.jsx";
import ItemsWin from "./Items.jsx";
import WinChat from "./WinChat.jsx";
import Ladder from "../minigame/Ladder.jsx";
import axios from "../../../utils/axios.js";
import { useNavigate, useParams } from "react-router-dom";
import News from "./News.jsx";
import Alert from "./Alert.jsx";
import folder from "../../.././images/folder.ico";
import trash from "../../.././images/trash.ico";
import ItemUse from "./ItemUse.jsx";
import Timer from "./Timer.jsx";
import FinalResult from "./FinalResult.jsx";
import NextTurn from "./NextTurn.jsx";

function MainGame() {
  // 윈도우 창 닫힘 열림 관리
  const [showMI, setShowMI] = useState(true);
  const [showSI, setShowSI] = useState(true);
  const [showOP, setShowOP] = useState(true);
  const [showIW, setShowIW] = useState(true);
  const [showWC, setShowWC] = useState(true);
  const [showTM, setShowTM] = useState(true);
  const [showSB, setShowSB] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [miniL, setMiniL] = useState(false);
  const [final, setFinal] = useState(false);
  const [nextDay, setNextDay] = useState(false);
  const [result, setResult] = useState(null);

  const [timer, setTimer] = useState(0);

  const [alert, setAlert] = useState(false);
  const [itemUse, setItemUse] = useState(false);
  const [item, setItem] = useState("shortSelling");
  const [newsDesc, setNewsDesc] = useState("no");
  const [selected, setSelected] = useState(0);
  const [alertMsg, setAlertMsg] = useState("경고창");
  const companyName = {
    food1: "SCV Food",
    food2: "드라군 제과",
    food3: "스랄 치킨",
    food4: "아이어 푸드",
    ship1: "초암 공사",
    ship2: "HL",
    ship3: "선양 해운",
    ship4: "선진 해양",
    enter1: "JYT",
    enter2: "YGY",
    enter3: "브릭스",
    enter4: "아라키스",
    elec1: "호드 컴퍼니",
    elec2: "살게라스",
    elec3: "아서스",
    elec4: "일리단 전자",
    tech1: "네오 테크",
    tech2: "모피어스",
    tech3: "스미스, INC.",
    tech4: "매트릭스",
  };

  const openAlert = (msg) => {
    setAlertMsg(msg);
    setAlert(true);
  };

  const closeAlert = () => {
    setAlert(false);
  };

  const openItemUse = (i) => {
    setItem(i);
    setItemUse(true);
  };
  const closeItemUse = () => {
    setItemUse(false);
  };

  const setters = {
    showMI,
    showSI,
    showOP,
    showSB,
    showIW,
    showWC,
    showTM,
    setShowMI,
    setShowSI,
    setShowOP,
    setShowSB,
    setShowIW,
    setShowWC,
    setShowTM,
  };
  const [progress, setProgress] = useState(0);
  const [gameStatus, setGameStatus] = useState(null);
  const [myStatus, setMyStatus] = useState(null);
  const [otherStatus, setOtherStatus] = useState([]);
  const [stockInfo, setStockInfo] = useState([]);

  const [ind, setInd] = useState("food");
  const [comp, setComp] = useState("1");

  const { room_id } = useParams();
  const navigate = useNavigate();

  //소켓 관련 기능들
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(new WebSocket("ws://localhost:4000"));

  useEffect(() => {
    if (myStatus !== null) {
      const ws = new WebSocket("ws://localhost:4000");
      ws.onopen = () => {
        console.log("Connected to server");
        const playerInfo = {
          type: "playerInfo",
          nickname: myStatus.nickName,
          roomid: gameStatus.gameRoomId,
          usernum: myStatus.userNum,
          turn: gameStatus.turn,
        };
        ws.send(JSON.stringify(playerInfo));
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log("message", data);
        if (data.type === "message") {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              content: data.content,
              type: "message",
              sender: data.sender,
              usernum: data.usernum,
            },
          ]);
        }
        if (data.type === "buySell") {
          let content = `${companyName[data.stockId]} 주식이 ${
            data.amount
          }주 거래되었습니다.`;
          getUserInfo();
          setMessages((prevMessages) => [
            ...prevMessages,
            { content: content, type: "game" },
          ]);
        }
        if (data.type === "timer") {
          setTimer(data.time);
        }
        if (data.type === "game") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { content: data.content, type: "game" },
          ]);
        }
        if (data.type === "news") {
          setNewsDesc(data.describe);
          console.log(data.describe);
        }
        if (data.type === "turn") {
          setMyStatus({ ...myStatus, newsCount: 5 });
          if (gameStatus.turn === 1) {
            setMiniL(true);
          } else {
            setNextDay(true);
            const timerId = setInterval(() => {
              setNextDay(false);
              // 함수 실행 후 타이머 중지
              clearInterval(timerId);
            }, 5000);
          }
          if (data.incharge === myStatus.userNum) {
            updateTurn(gameStatus.turn);
          } else {
            if (gameStatus.turn !== 12)
              setTimeout(() => {
                getStockInfo(), getRoomInfo(), getUserInfo(0);
              }, 3000);
          }
          if (data.content === "skip") {
            // setTimeout(() => {
            //   getStockInfo(), getRoomInfo(), getUserInfo(0);
            // }, 5000);
            setMessages((prevMessages) => [
              ...prevMessages,
              { content: "<타임 머신>이 사용되었습니다.", type: "game" },
            ]);
          }
        }
        if (data.type === "debt") {
          const stockPriceArray = stockInfo[data.stock].price;
          const lastStockPrice = stockPriceArray[stockPriceArray.length - 1];
          const stockValue = lastStockPrice * data.amount;
          console.log("빚 : ", formatNumber(stockValue));
          setMyStatus((prevStatus) => ({
            ...prevStatus,
            cash: prevStatus.cash - stockValue,
          }));
        }
        if (data.type === "gameover") {
          console.log("게임 결과", data);
          setFinal(true);
          setResult(data.content);
        }
      };
      ws.onclose = (event) => {
        console.log("WebSocket closed: ", event);
      };
      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };
      setWs(ws);
      return () => {
        // console.log("소켓 오프");
        // ws.close();
      };
    }
  }, [myStatus]);

  const sendMessage = (message) => {
    message = {
      ...message,
      roomid: gameStatus.gameRoomId,
      nickname: myStatus.nickName,
      usernum: myStatus.userNum,
    };
    if (ws) {
      if (ws.readyState === WebSocket.OPEN) {
        console.log("메시지 전송:", message);
        ws.send(JSON.stringify(message));
      } else {
        console.log("WebSocket이 열려 있지 않습니다. 상태:", ws.readyState);
      }
    } else {
      console.log("WebSocket이 null입니다:", ws);
    }
  };

  //숫자를 10^4 단위로 끊어 최대 억까지 표시해주는 함수
  const formatNumber = (number) => {
    if (number < 10000) return number + " ";
    const hundredMillion = Math.floor(number / 100000000);
    const remainderAfterHundredMillion = number % 100000000;
    const tenThousand = Math.floor(remainderAfterHundredMillion / 10000);
    const remainder = remainderAfterHundredMillion % 10000;

    let result = "";
    if (hundredMillion > 0) {
      result += `${hundredMillion.toLocaleString()}억 `;
    }
    if (tenThousand > 0) {
      result += `${tenThousand.toLocaleString()}만 `;
    }
    if (remainder !== 0) {
      result += remainder.toLocaleString() + " ";
    }

    return result;
  };

  //자산 계산식
  const sumStock = (user) => {
    const ind = ["food", "ship", "enter", "elec", "tech"];
    let sum = 0;
    for (let i of ind) {
      for (let j = 1; j < 5; j++) {
        sum = sum + user[i + j] * stockInfo[i + j].price[gameStatus.turn - 1];
      }
    }
    return sum;
  };

  //백엔드에서 정보 받아오는 코드들
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
    axios
      .get(`/game/roomInfo/${room_id}`)
      .then((res) => {
        console.log("gameStatus", res.data);
        if (res.data.turn == 0) {
          updateTurn(0);
        } else {
          getUserInfo();
          getStockInfo();
        }
        setGameStatus(res.data);
      })
      .catch((error) => {
        navigate("/");
      });
  };

  const updateTurn = (turn) => {
    console.log("updateTurn");
    if (turn === 12) {
      const userTotal = otherStatus.map((item) => ({
        usernum: item.userNum,
        nickname: item.nickName,
        total: item.cash + sumStock(item),
      }));
      userTotal.push({
        usernum: myStatus.userNum,
        nickname: myStatus.nickName,
        total: myStatus.cash + sumStock(myStatus),
      });
      console.log(userTotal);
      sendMessage({ type: "gameover", data: userTotal });
    } else {
      axios.get(`/game/nextTurn/${room_id}/${turn}`).then((res) => {
        setTimeout(() => {
          getStockInfo(), getRoomInfo(), getUserInfo(0);
        }, 3000);
      });
    }
  };

  //시작시 로딩 바, 정보 로딩
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 50);

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // 여기서 데이터를 불러오는 비동기 함수를 호출합니다.
    getRoomInfo();

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  //내가 속한 방 아니면 바로 퇴출임
  useEffect(() => {
    if (otherStatus.length === 4 && progress === 100) {
      console.log("댓츠 노노");
      navigate("/");
    }
  }, [otherStatus, progress]);

  //내 상태가 변하면 즉각 DB에 업데이트
  useEffect(() => {
    if (myStatus !== null) {
      updateMyStatus();
    }
  }, [myStatus]);

  const updateMyStatus = () => {
    axios.post("/game/update/userStatus", myStatus);
  };

  if (
    gameStatus === null ||
    myStatus === null ||
    stockInfo === null ||
    otherStatus == null ||
    progress < 100
  ) {
    return (
      <div className="main-game-loading">
        <progress className="nes-progress " value={progress} max="100" />
      </div>
    );
  }

  return (
    <div className="maingame-container">
      <div className="flex pt-4 pr-4 pl-4 pb-12 ">
        <div
          className="win-item-icon top-8 left-8 absolute"
          onClick={() => {
            setSelected(1);
          }}
        >
          <img src={folder} style={{ width: "70px", height: "70px" }} />
          <div className={selected == 1 ? "win-item-text" : null}>낫띵</div>
        </div>
        <div
          className="win-item-icon top-40 left-8 absolute"
          onClick={() => {
            setSelected(2);
          }}
        >
          <img src={trash} style={{ width: "70px", height: "70px" }} />
          <div className={selected == 2 ? "win-item-text" : null}>휴지통</div>
        </div>
        <Alert isOpen={alert} onClose={closeAlert} message={alertMsg} />
        <NextTurn isOpen={nextDay} />
        <FinalResult
          isOpen={final}
          result={result}
          formatNumber={formatNumber}
        />
        {miniL ? (
          <div className=" fixed z-30">
            <Ladder
              setMyStatus={setMyStatus}
              myStatus={myStatus}
              setMiniL={setMiniL}
              updateTurn={updateTurn}
              gameStatus={gameStatus}
            />
          </div>
        ) : null}
        <ItemUse
          isOpen={itemUse}
          onClose={closeItemUse}
          item={item}
          stockInfo={stockInfo}
          formatNumber={formatNumber}
          myStatus={myStatus}
          setMyStatus={setMyStatus}
          openAlert={openAlert}
          companyName={companyName}
          gameStatus={gameStatus}
          sendMessage={sendMessage}
          updateTurn={updateTurn}
        />
        <News
          show={showNews}
          setShow={setShowNews}
          ind={ind}
          comp={comp}
          stockInfo={stockInfo}
          companyName={companyName}
          myStatus={myStatus}
          setMyStatus={setMyStatus}
          openAlert={openAlert}
          sendMessage={sendMessage}
          gameStatus={gameStatus}
          newsDesc={newsDesc}
        />
        <div className="flex=col" style={{ width: "21%" }}>
          <Timer show={showTM} setShow={setShowTM} timer={timer} />
          <MyInfo
            show={showMI}
            setShow={setShowMI}
            myStatus={myStatus}
            formatNumber={formatNumber}
            updateTurn={updateTurn}
            gameStatus={gameStatus}
            sumStock={sumStock}
            stockInfo={stockInfo}
            setInd={setInd}
            setComp={setComp}
            companyName={companyName}
          />
        </div>
        <div className="flex-col" style={{ width: "50%" }}>
          <StockInfo
            show={showSI}
            setShow={setShowSI}
            updateTurn={updateTurn}
            myStatus={myStatus}
            setMyStatus={setMyStatus}
            gameStatus={gameStatus}
            stockInfo={stockInfo}
            ind={ind}
            setInd={setInd}
            comp={comp}
            setComp={setComp}
            formatNumber={formatNumber}
            showNews={showNews}
            setShowNews={setShowNews}
            openAlert={openAlert}
            sendMessage={sendMessage}
            companyName={companyName}
          />
          <ItemsWin
            show={showIW}
            setShow={setShowIW}
            openItemUse={openItemUse}
            myStatus={myStatus}
          />
        </div>
        <div className="flex-col" style={{ width: "28%" }}>
          <OtherPlayer
            show={showOP}
            setShow={setShowOP}
            otherStatus={otherStatus}
            formatNumber={formatNumber}
            sumStock={sumStock}
          />
          <WinChat
            show={showWC}
            setShow={setShowWC}
            ind={ind}
            comp={comp}
            stockInfo={stockInfo}
            sendMessage={sendMessage}
            messages={messages}
            myStatus={myStatus}
          />
        </div>
      </div>
      <StartBar show={showSB} />
      <TaskBar {...setters} />
    </div>
  );
}

export default MainGame;
