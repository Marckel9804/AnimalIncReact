import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from "chart.js";
import { Bar, Chart, Line } from "react-chartjs-2";

function StockInfo({
  show,
  setShow,
  testCall,
  stockInfo,
  ind,
  setInd,
  comp,
  setComp,
}) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement
  );

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

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        type: "line",
        label: "Dataset 1",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
        data: stockInfo[ind + comp].price,
      },
      {
        type: "bar",
        label: "Dataset 2",
        backgroundColor: indColor[ind],
        data: stockInfo[ind + comp].price,
        borderColor: "black",
        borderWidth: 1,
      },
    ],
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
        <div className="window-head2">
          <span className=" underline">F</span>ile
          <span className="ml-4 underline">E</span>dit
          <span className="ml-4 underline">V</span>iew
          <span className="ml-4 underline">H</span>elp
        </div>
        <div className="main-window-inside">
          <div className="flex gap-6">
            <input className="nes-input" type="nuber" id="turn" />
            <button
              className="nes-btn primary"
              onClick={() => {
                const turn = document.querySelector("#turn").value;
                testCall(turn);
              }}
            >
              테스트
            </button>
          </div>
          <div className="mt-5">
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
          </div>
          <div className="win-chart-container">
            <div>
              <label>
                <input
                  type="radio"
                  value={"1"}
                  className="nes-radio"
                  onClick={compCheck}
                  name="company"
                />
                <span>{ind + "1"}</span>
              </label>
              <label>
                <input
                  type="radio"
                  value={"2"}
                  className="nes-radio"
                  onClick={compCheck}
                  name="company"
                />
                <span>{ind + "2"}</span>
              </label>
              <label>
                <input
                  type="radio"
                  value={"3"}
                  className="nes-radio"
                  onClick={compCheck}
                  name="company"
                />
                <span>{ind + "3"}</span>
              </label>
              <label>
                <input
                  type="radio"
                  value={"4"}
                  className="nes-radio"
                  onClick={compCheck}
                  name="company"
                />
                <span>{ind + "4"}</span>
              </label>
            </div>
            <Chart data={data} />
          </div>
          {/* <Bar /> */}
          {/* <Chart data={data} /> */}
        </div>
      </div>
    </div>
  );
}

export default StockInfo;
