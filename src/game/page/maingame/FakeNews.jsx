import React, { useState, useMemo } from "react";

function FakeNews(props) {
  const [stockSelected, setStockSelected] = useState("elec1");
  const [radio, setRadio] = useState("positive");

  const handleStockChange = (event) => {
    setStockSelected(event.target.value);
  };

  const handleOptionChange = (event) => {
    setRadio(event.target.value);
  };

  const fakeNews = () => {
    if (isNaN(order) || order == 0) {
      props.openAlert("주문이 존재하지 않습니다.");
    } else if (props.myStatus.shortSelling > 0) {
      props.setMyStatus({
        ...props.myStatus,
        shortSelling: props.myStatus.shortSelling - 1,
        cash: props.myStatus.cash + total,
        shortSellRecord:
          props.myStatus.shortSellRecord +
          `&${
            props.stockInfo[stockSelected].price[props.gameStatus.turn - 1]
          }:${order}`,
      });
    } else {
      props.openAlert("보유한 아이템이 부족합니다.");
    }
  };

  return (
    <div className="h-full flex-col p-5">
      <h2>당신은 특정 기업에 대해 근거 없는 소문을 퍼트리기로 결정했습니다.</h2>
      <h2>
        이번턴 동안 뉴스가 생성될 때 당신의 의견이 반영된 결과가 나옵니다.
      </h2>
      <div className=" p-4 flex-col justify-center items-center h-full">
        <div>
          현재 주가:
          {props.formatNumber(
            props.stockInfo[stockSelected].price[props.gameStatus.turn - 1]
          )}{" "}
        </div>

        <div className="flex w-full">
          <select className="win-select h-7" onChange={handleStockChange}>
            {Object.keys(props.stockInfo).map((item) => (
              <option key={item} value={item}>
                {props.companyName[item]}
              </option>
            ))}
          </select>
          <div class="radio-container">
            <input
              type="radio"
              name="options"
              value="positive"
              checked={radio === "positive"}
              onChange={handleOptionChange}
            />
            <label
              for="optionA"
              className={radio === "positive" ? "win-radio-selected" : null}
            >
              긍정적
            </label>
            <input
              type="radio"
              name="options"
              value="negative"
              checked={radio === "negative"}
              onChange={handleOptionChange}
            />
            <label
              for="optionB"
              className={radio === "negative" ? "win-radio-selected" : null}
            >
              부정적
            </label>
          </div>
          <div className={`win-alert-btn mb-4`}>
            <button className="win-alert-btn-in " onClick={fakeNews}>
              결정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FakeNews;
