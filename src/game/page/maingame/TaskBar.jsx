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
          src="https://kr.object.ncloudstorage.com/aniinc/images/windows95-icon-2048x1776-bf6ucuub.png"
          width={"28px"}
          className=" align-middle mr-1"
        />
        Start
      </button>
      <button
        className="task-btn w-48"
        onClick={() => {
          if (props.showTM) {
            props.setShowTM(false);
          } else {
            props.setShowTM(true);
          }
        }}
      >
        타이머
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
          if (props.showIW) {
            props.setShowIW(false);
          } else {
            props.setShowIW(true);
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
      <button
        className="task-btn w-48"
        onClick={() => {
          if (props.showWC) {
            props.setShowWC(false);
          } else {
            props.setShowWC(true);
          }
        }}
      >
        채팅
      </button>
      <div className="task-clock w-1/12 pl-1">
        {time.toLocaleTimeString([], {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

export default TaskBar;
