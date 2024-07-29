import React from "react";

function MyInfo({ show, setShow }) {
  return (
    <div className={"myinfo-container"}>
      <div className={`main-window ${show ? "" : "win-hide"}`}>
        <div className="window-head">
          My Info
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
      </div>
    </div>
  );
}

export default MyInfo;
