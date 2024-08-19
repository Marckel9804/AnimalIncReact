import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  plugins,
  Tooltip,
} from "chart.js";
import { Bar, Chart, Line } from "react-chartjs-2";
import axios from "../../../utils/axios.js";

function StockInfo(props) {
  const {
    show,
    setShow,
    stockInfo,
    ind,
    setInd,
    comp,
    setComp,
    gameStatus,
    myStatus,
    setMyStatus,
    formatNumber,
    setShowNews,
    openAlert,
    updateTurn,
    sendMessage,
  } = props;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    plugins,
    Tooltip
  );

  ChartJS.defaults.font.family = "'DungGeunMo'";

  const indColor = {
    food: "#3CB371", // Green
    ship: "rgb(128, 128, 128)", // Gray
    enter: "#ED9CA5", // Red
    elec: "#4B89DC", // Blue
    tech: "#FFFF7F", // Yellow
  };
  const indCheck = (e) => {
    setInd(e.target.value);
  };
  const compCheck = (e) => {
    setComp(e.target.value);
  };
  const options = {
    plugins: {
      Tooltip: {
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || "";
            if (label) {
              label += ": ";
            }
            label += Math.round(tooltipItem.yLabel * 100) / 100;
            return label;
          },
          events: ["hover"],
        },
      },
    },
  };

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        type: "line",
        label: "Line",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        data: stockInfo[ind + comp].price,
      },
      {
        type: "bar",
        label: "Bar",
        backgroundColor: indColor[ind],
        data: stockInfo[ind + comp].price,
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  //주식 거래량
  const [order, setOrder] = useState(0);
  const changeOrder = (e) => {
    const value = parseInt(e.target.value, 10);
    console.log("val", value);
    if (isNaN(value) || value < 0) {
      setOrder("");
    } else {
      setOrder(value);
    }
  };

  //총액 계산식을 저장해두는 변수
  const totalPrice = useMemo(() => {
    return (
      stockInfo[ind + comp].price[stockInfo[ind + comp].price.length - 1] *
      order
    );
  }, [stockInfo, ind, comp, order]);

  //매수 기능
  const buyStock = () => {
    if (totalPrice > myStatus.cash) {
      openAlert("금액이 부족합니다");
      // alert(`금액이 부족합니다`);
    } else if (order > 0) {
      setMyStatus({
        ...myStatus,
        [ind + comp]: myStatus[ind + comp] + order,
        cash: myStatus.cash - totalPrice,
      });
      const buyMsg = {
        type: "buySell",
        stockId: ind + comp,
        amount: order,
        action: "buy",
      };
      sendMessage(buyMsg);
    }
  };
  //매도 기능
  const sellStock = () => {
    if (myStatus[ind + comp] < order) {
      // alert("보유한 주식이 부족합니다.");
      openAlert("보유한 주식이 부족합니다.");
    } else if (order > 0) {
      setMyStatus({
        ...myStatus,
        [ind + comp]: myStatus[ind + comp] - order,
        cash: myStatus.cash + totalPrice,
      });
      const sellMsg = {
        type: "buySell",
        stockId: ind + comp,
        amount: order,
        action: "sell",
      };
      sendMessage(sellMsg);
    }
  };

  //내 상태가 변하면 즉각 DB에 업데이트
  useEffect(() => {
    updateMyStatus();
  }, [myStatus]);

  const updateMyStatus = () => {
    axios.post("/game/update/userStatus", myStatus);
  };

  return (
    <div className={"stockinfo-container"}>
      <div className={` main-window ${show ? "flex" : "hidden"}`}>
        <div className="window-head">
          Stock Info
          <div className=" ml-auto mr-1 flex items-center">
            <button
              className="window-head-btn items-end"
              onClick={() => {
                setShow(false);
              }}
            >
              _
            </button>
            <button className="window-head-btn-disabled items-center">
              ㅁ
            </button>
            <button className="window-head-btn-disabled items-center">x</button>
          </div>
        </div>
        {/* <div className="window-head2">
          <span className=" underline">F</span>ile
          <span className="ml-4 underline">E</span>dit
          <span className="ml-4 underline">V</span>iew
          <span className="ml-4 underline">H</span>elp
        </div> */}
        <div className="main-window-inside">
          <div className="mt-5 flex gap-5">
            <label>
              <input
                type="radio"
                value="food"
                checked={ind === "food"}
                onChange={indCheck}
                className="nes-radio"
                name="industry"
              />
              <span>식품</span>
            </label>
            <label>
              <input
                type="radio"
                value="ship"
                checked={ind === "ship"}
                onChange={indCheck}
                className="nes-radio"
                name="industry"
              />
              <span>조선</span>
            </label>
            <label>
              <input
                type="radio"
                value="enter"
                checked={ind === "enter"}
                onChange={indCheck}
                className="nes-radio"
                name="industry"
              />
              <span>엔터</span>
            </label>
            <label>
              <input
                type="radio"
                value="elec"
                checked={ind === "elec"}
                onChange={indCheck}
                className="nes-radio"
                name="industry"
              />
              <span>전자</span>
            </label>
            <label>
              <input
                type="radio"
                value="tech"
                checked={ind === "tech"}
                onChange={indCheck}
                className="nes-radio"
                name="industry"
              />
              <span>테크</span>
            </label>
            <div className="flex gap-4 ml-auto">
              <button
                className="nes-btn"
                style={{ padding: 0 }}
                onClick={() => {
                  setShowNews(true);
                }}
              >
                뉴스 보기
              </button>
              <button
                className="nes-btn is-error"
                style={{ padding: 0 }}
                onClick={() => {
                  updateTurn(gameStatus.turn);
                }}
              >
                다음 턴({gameStatus.turn + 1})
              </button>
            </div>
          </div>
          <div className="win-chart-container">
            <div className=" flex-col gap-4 mt-6">
              <label className="flex">
                <input
                  type="radio"
                  checked={comp === "1"}
                  value={"1"}
                  className="nes-radio"
                  onChange={compCheck}
                  name="company"
                />
                <span>{ind + "1"}</span>
              </label>
              <label className="flex">
                <input
                  type="radio"
                  checked={comp === "2"}
                  value={"2"}
                  className="nes-radio"
                  onChange={compCheck}
                  name="company"
                />
                <span>{ind + "2"}</span>
              </label>
              <label className="flex">
                <input
                  type="radio"
                  checked={comp === "3"}
                  value={"3"}
                  className="nes-radio"
                  onChange={compCheck}
                  name="company"
                />
                <span>{ind + "3"}</span>
              </label>
              <label className="flex">
                <input
                  type="radio"
                  checked={comp === "4"}
                  value={"4"}
                  className="nes-radio"
                  onChange={compCheck}
                  name="company"
                />
                <span>{ind + "4"}</span>
              </label>
            </div>
            <Chart data={data} options={options} />
          </div>
          <div className="flex justify-between items-center mt-5">
            <div style={{ margin: "0 auto", marginLeft: "80px" }}>
              {ind + comp} 주문 수량:
              <input
                type="number"
                className="nes-input win-stock-order"
                value={order}
                onChange={changeOrder}
                onFocus={() => {
                  setOrder("");
                }}
                style={{ padding: 0, width: "180px", marginLeft: "15px" }}
              />
              주<span>, 총액: {formatNumber(totalPrice)}₩</span>
            </div>
            <div className="flex gap-4">
              <button
                className="nes-btn is-primary w-20"
                onClick={() => {
                  buyStock();
                }}
              >
                매수
              </button>
              <button
                className="nes-btn is-warning w-20"
                onClick={() => {
                  sellStock();
                }}
              >
                매도
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockInfo;
