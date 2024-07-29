import React, { useState, useEffect } from "react";

function TaskBar(props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className=" flex gap-3 p-1 taskbar-container">
      <button
        className="task-btn"
        onClick={() => {
          if (props.showSB) {
            props.setShowSB(false);
          } else {
            props.setShowSB(true);
          }
        }}
        onBlur={() => {
          setTimeout(() => props.setShowSB(false), 120);
        }}
      >
        <img
          src="https://static-00.iconduck.com/assets.00/windows95-icon-2048x1776-bf6ucuub.png"
          width={"28px"}
          className=" align-middle mr-1"
        />
        Start
      </button>
      <button
        className="task-btn w-48"
        onClick={() => {
          if (props.showMI) {
            props.setShowMI(false);
          } else {
            props.setShowMI(true);
          }
        }}
      >
        내 정보
      </button>
      <button
        className="task-btn w-48"
        onClick={() => {
          if (props.showSI) {
            props.setShowSI(false);
          } else {
            props.setShowSI(true);
          }
        }}
      >
        주식 정보
      </button>
      <button
        className="task-btn w-48"
        onClick={() => {
          if (props.showIw) {
            props.setShowIw(false);
          } else {
            props.setShowIw(true);
          }
        }}
      >
        아이템
      </button>
      <button
        className="task-btn w-48"
        onClick={() => {
          if (props.showOP) {
            props.setShowOP(false);
          } else {
            props.setShowOP(true);
          }
        }}
      >
        다른 플레이어 정보
      </button>
      <div className="task-clock w-28 pl-2">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

export default TaskBar;
