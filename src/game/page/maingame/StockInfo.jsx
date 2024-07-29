import React, { useState } from "react";

function StockInfo({ show, setShow }) {
  const 명수 =
    "https://i.namu.wiki/i/8dGsCBfEbo_raXvMheBc4kmblgSDXJatOG9z04qin1Urp7bH7tDY2UhO0vx2I6B2udXJGj8EEmSFxVVI3N3Vxw.webp";
  const 재석 =
    "https://2.gall-img.com/hygall/files/attach/images/82/150/707/127/f496597244473d9a74af8bc071442470.jpg";
  const [img, setImg] = useState(재석);
  return (
    <div className={"stockinfo-container"}>
      <div className={` main-window ${show ? "" : "win-hide"}`}>
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
          {/* <span className=" underline">F</span>ile
          <span className="ml-4 underline">E</span>dit
          <span className="ml-4 underline">V</span>iew
          <span className="ml-4 underline">H</span>elp */}
        </div>
        <div className="main-window-inside">
          <img
            src={img}
            width={"100%"}
            alt=""
            onClick={() => {
              if (img === 재석) {
                setImg(명수);
              } else {
                setImg(재석);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StockInfo;
