import React from "react";

function ItemsWin({ show, setShow }) {
  return (
    <div className={"itemswin-container"}>
      <div className={`main-window ${show ? "flex" : "hidden"}`}>
        <div className="window-head">
          Items
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
        <div className="main-window-inside"></div>
      </div>
    </div>
  );
}

export default ItemsWin;
