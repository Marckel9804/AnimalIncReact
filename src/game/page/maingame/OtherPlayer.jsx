import React, { useState } from "react";

function OtherPlayer({ show, setShow }) {
  return (
    <div className={"otherpinfo-container"}>
      <div className={` main-window ${show ? "flex" : "hidden"} `}>
        <div className="window-head">
          Other Players
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
          {/* <span className=" underline">F</span>ile
        <span className="ml-4 underline">E</span>dit
        <span className="ml-4 underline">V</span>iew
        <span className="ml-4 underline">H</span>elp */}
        </div>
        <div className="other-player-info flex justify-between p-4 flex-grow">
          <div className=" ">p2</div>
          <div className=" ">p3</div>
          <div>p4</div>
        </div>
      </div>
    </div>
  );
}

export default OtherPlayer;
