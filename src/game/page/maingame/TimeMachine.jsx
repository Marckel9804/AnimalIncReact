import React, { useState } from "react";

function TimeMachine(props) {
  const timeSkip = () => {
    if (props.myStatus.timeMachine > 0) {
      props.setMyStatus({
        ...props.myStatus,
        timeMachine: props.myStatus.timeMachine - 1,
      });
      const skip = setInterval(() => {
        props.sendMessage({ type: "skip" });
        clearInterval(skip);
      }, 500);
      props.onClose;
    } else {
      props.openAlert("아이템이 부족합니다.");
    }
  };
  return (
    <div className="h-full flex-col p-5">
      <h2>
        당신은 이번 턴 주식을 사고파는데에 있어 남들보다 빠르게 결정을
        내렸습니다.
      </h2>
      <h2>그래서 이번 턴 당신은 평소보다 장이 일찍 닫히기를 소원했습니다.</h2>
      <h2>
        다른 사람들이 올바른 선택을 하는데에 충분한 시간을 썼을지는 모르지만
        사실 상관없는 일이죠.
      </h2>
      <div className=" p-4 flex-col justify-center items-center h-full">
        <div className="win-time-btn-container">
          <div className={`win-alert-btn mb-12 mt-12`}>
            <button className="win-alert-btn-in " onClick={timeSkip}>
              장 마감하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TimeMachine;
