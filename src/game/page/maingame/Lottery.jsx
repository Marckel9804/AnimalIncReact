import { Colors } from "chart.js";
import React, { useState } from "react";

function Lottery(props) {
  const [showInfo, setShowInfo] = useState(false);
  const [result, setResult] = useState("");

  const probabilities = [
    { value: 5000, weight: 30 },
    { value: 50000, weight: 20 },
    { value: 100000, weight: 20 },
    { value: 500000, weight: 20 },
    { value: 1000000, weight: 5 },
    { value: 2000000, weight: 3 },
    { value: 3000000, weight: 1 },
    { value: 5000000, weight: 0.5 },
    { value: 8000000, weight: 0.3 },
    { value: 10000000, weight: 0.15 },
    { value: 50000000, weight: 0.05 },
  ];

  const getRandomResult = () => {
    const totalWeight = probabilities.reduce(
      (acc, curr) => acc + curr.weight,
      0
    );
    const randomNum = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulativeWeight += probabilities[i].weight;
      if (randomNum < cumulativeWeight) {
        return probabilities[i].value;
      }
    }
  };

  const show = () => {
    if (showInfo) {
      setShowInfo(false);
    } else {
      setShowInfo(true);
    }
  };

  const lotto = () => {
    const result = getRandomResult();
    if (props.myStatus.lottery > 0) {
      props.setMyStatus({
        ...props.myStatus,
        lottery: props.myStatus.lottery - 1,
        cash: props.myStatus.cash + result,
      });
      props.sendMessage({
        type: "lottery",
        content: `${props.myStatus.nickName}님이 ${props.formatNumber(
          result
        )}원에 당첨되셨습니다`,
      });
      setResult(`${props.formatNumber(result)}원에 당첨되셨습니다`);
    } else {
      props.openAlert("아이템이 부족합니다.");
    }
  };

  return (
    <div className="h-full flex-col p-5">
      <h2 onClick={show} className="win-item-info">
        확률 보기 {showInfo ? <span style={{ color: "red" }}>x</span> : ""}
      </h2>
      <div
        onClick={() => {
          setShowInfo(false);
        }}
        className={` absolute ${
          showInfo ? "" : "hidden"
        } item-info-window w-1/2`}
      >
        <p>30%: 5,000(5천) ₩ </p>
        <p>20%: 50,000(5만) ₩ </p>
        <p>20%: 100,000(10만) ₩ </p>
        <p>20%: 500,000(50만) ₩ </p>
        <p>5%: 1,000,000(100만) ₩ </p>
        <p>3%: 2,000,000(200만) ₩ </p>
        <p>1%: 3,000,000(300만) ₩ </p>
        <p>0.5%: 5,000,000(500만) ₩ </p>
        <p>0.3%: 8,000,000(800만) ₩ </p>
        <p>0.15%: 10,000,000(1,000만) ₩ </p>
        <p>0.05%: 50,000,000(5,000만) ₩ </p>
      </div>
      <div className=" p-4 flex-col justify-center items-center h-full">
        <div>보유중인 복권:{props.myStatus.lottery}</div>
        <div className={`win-alert-btn mb-4`}>
          <button className="win-alert-btn-in " onClick={lotto}>
            복권 사용
          </button>
        </div>
        <div>결과:{result}</div>
      </div>
    </div>
  );
}
export default Lottery;
