import React, { useMemo, useState } from "react";

function ShortSelling(props) {
  const [showInfo, setShowInfo] = useState(false);
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
    } else if (value > 200) {
      setOrder(200);
    } else {
      setOrder(value);
    }
  };

  const handleStockChange = (event) => {
    setStockSelected(event.target.value);
  };

  const show = () => {
    if (showInfo) {
      setShowInfo(false);
    } else {
      setShowInfo(true);
    }
  };

  const shortSell = () => {
    if (props.gameStatus.turn === 12) {
      props.openAlert(
        "현재 턴에서는 사용 할 수 없는 아이템입니다.ㅜ남은 아이템이 전부 로또로 전환됩니다."
      );
      props.setMyStatus({
        ...props.myStatus,
        shortSelling: 0,
        lottery: props.myStatus.shortSelling,
      });
    } else if (isNaN(order) || order == 0) {
      props.openAlert("주문이 존재하지 않습니다.");
    } else if (props.myStatus.shortSelling > 0) {
      props.setMyStatus({
        ...props.myStatus,
        shortSelling: props.myStatus.shortSelling - 1,
        cash: props.myStatus.cash + total,
      });
      props.sendMessage({
        type: "shortSelling",
        stockid: stockSelected,
        amount: order,
        turn: props.gameStatus.turn,
      });
    } else {
      props.openAlert("보유한 아이템이 부족합니다.");
    }
  };

  return (
    <div className="h-full flex-col p-5">
      <h2 onClick={show} className="win-item-info">
        공매도란? {showInfo ? <span style={{ color: "red" }}>x</span> : ""}
      </h2>
      <div
        onClick={() => {
          setShowInfo(false);
        }}
        className={` absolute ${showInfo ? "" : "hidden"} item-info-window`}
      >
        <p>공매도란 공(空) 매도, 풀어서 해석하자면 없는걸 판다는 뜻입니다.</p>
        <p>
          공매도를 하게되면 보유중이지 않은 타인의 주식을 팔아 해당 수익을 챙긴
          뒤 약속된 결제일이 되기 전 해당 주식을 다시 구매하여 매입자에게 갚게
          됩니다.
        </p>
        <p>
          만약 이 떄 매도 시점보다 주식을 다시 구매할 때 주가가 떨어진다면
          차익을 챙길 수 있습니다.
        </p>
        <p>
          한 마디로 공매도는 주가가 떨어질 것을 예측해 그 차익으로 이익을 보는
          방법입니다.
        </p>
        <p>
          해당 게임에서는 아무 주식이나 최대 200주 매도한 금액을 즉시 현금으로
          얻을 수 있고 다음 턴이 오면 다음 턴의 주가로 해당 주식을 매도한 만큼의
          금액이 빠져나가게 됩니다.
        </p>
        <p>
          따라서 마지막 턴에는 사용이 불가능 합니다. 마지막 턴에는 해당 아이템이
          복권으로 전환됩니다.
        </p>
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          {" "}
          *주의*{" "}
        </p>
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          이 과정에서 보유금이 마이너스 소지금을 가지게 되고 보유한 주식을 팔아
          다시 소지금을 얻기 전까진 거래 할 수 없습니다.
        </p>
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          만일 주식을 전부 매도해도 보유금을 갚지 못할 경우 더 이상 거래를
          진행하지 못하게 됩니다.
        </p>
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          그런 경우 유일한 구제 수단은 로또를 통한 빚 변제뿐이기 때문에 공매도는
          주의해서 사용합시다.
        </p>
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          실제 주식에서도 공매도를 진행 할 경우 보유금 이상의 손해를 입을 수
          있기 떄문에 매우 위험한 방식의 거래입니다.
        </p>
      </div>
      <div className=" p-4 flex-col justify-center items-center h-full">
        <div>
          현재 주가:
          {props.formatNumber(
            props.stockInfo[stockSelected].price[props.gameStatus.turn - 1]
          )}{" "}
        </div>
        <div>
          거래 총액:
          {props.formatNumber(total)}{" "}
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
            <button className="win-alert-btn-in " onClick={shortSell}>
              매도
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortSelling;
