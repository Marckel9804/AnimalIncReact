import { Colors } from "chart.js";
import React, { useMemo, useState } from "react";

function GoodNews(props) {
  const [stockSelected, setStockSelected] = useState("elec1");

  const [order, setOrder] = useState(0);
  const total = useMemo(() => {
    return (
      props.stockInfo[stockSelected].price[props.gameStatus.turn - 1] * order
    );
  }, [stockSelected, order]);

  //주식 거래량
  const changeOrder = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 0) {
      setOrder("");
    } else if (value > 999999) {
      setOrder(999999);
    } else {
      setOrder(value);
    }
  };

  const handleStockChange = (event) => {
    setStockSelected(event.target.value);
  };

  const buyStock = () => {
    if (isNaN(order) || order == 0) {
      props.openAlert("주문이 존재하지 않습니다.");
    } else if (props.myStatus.goodNews > 0) {
      props.setMyStatus({
        ...props.myStatus,
        goodNews: props.myStatus.goodNews - 1,
        cash: props.myStatus.cash - Math.floor(0.9 * total),
        [stockSelected]: props.myStatus[stockSelected] + order,
      });
    } else {
      props.openAlert("보유한 아이템이 부족합니다.");
    }
  };

  return (
    <div className="h-full flex-col p-5">
      <h2>
        당신은 고급 정보를 손에 넣어 정확한 타이밍에 저점 매수하는데에
        성공했습니다.
      </h2>
      <h2>주식을 10% 저렴한 가격에 매수 가능합니다.</h2>
      <h2>이렇게 구매한 주식은 이번 턴에는 판매가 불가능합니다.</h2>

      <div className=" p-4 flex-col justify-center items-center h-full">
        <div>
          현재 주가:
          {props.formatNumber(
            props.stockInfo[stockSelected].price[props.gameStatus.turn - 1]
          )}{" "}
        </div>
        <div>
          거래 총액:
          {`${props.formatNumber(total)} >> `}
          <span style={{ color: "blue" }}>
            {props.formatNumber(Math.floor(0.9 * total))}
          </span>
        </div>
        <div className="flex w-full">
          <select className="win-select h-7" onChange={handleStockChange}>
            {Object.keys(props.stockInfo).map((item) => (
              <option key={item} value={item}>
                {props.companyName[item]}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={order}
            onChange={changeOrder}
            className="win-chat-input ml-2 h-7 mr-2"
            onFocus={() => {
              setOrder("");
            }}
          />
          <div className={`win-alert-btn mb-4`}>
            <button className="win-alert-btn-in " onClick={buyStock}>
              매도
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GoodNews;
