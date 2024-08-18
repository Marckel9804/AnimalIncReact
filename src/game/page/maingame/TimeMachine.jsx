import React, { useState } from "react";

function TimeMachine(props) {
  return (
    <div className="h-full flex-col p-5">
      <h2>
        당신은 이번 턴 주식을 사고파는데에 있어 남들보다 빠르게 결정을
        내렸습니다.
      </h2>

      <h2>
        그래서 이번 턴 다른 이들의 의견을 무시하고 평소보다 이른시간에 장을
        닫기로 결정했습니다.
      </h2>
      <h2>
        다른 사람들이 올바른 선택을 하는데에 충분한 시간을 썼을지는 모르지만
        사실 상관없는 일이죠.
      </h2>
      <div className=" p-4 flex-col justify-center items-center h-full">
        <div className="win-time-btn-container">
          <div className={`win-alert-btn mb-12 mt-12`}>
            <button className="win-alert-btn-in ">장 마감하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TimeMachine;
