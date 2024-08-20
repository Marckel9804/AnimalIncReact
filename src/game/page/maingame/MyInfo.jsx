import React, { useEffect, useState } from "react";

function MyInfo({
  show,
  setShow,
  myStatus,
  formatNumber,
  updateTurn,
  gameStatus,
  sumStock,
  stockInfo,
  setInd,
  setComp,
  companyName,
}) {
  const rows = 21;
  const cols = 4;
  const indList = ["food", "ship", "enter", "elec", "tech"];
  const [tt, setTT] = useState(rows + 1); //표 툴팁 관리

  //표에 들어갈 값들 규칙
  const cellRule = (row, col) => {
    if (row === 0) {
      if (col === 0) return "회사명";
      if (col === 1) return "보유량";
      if (col === 2) return "가격";
      else return "등락";
    }
    const comp = row % 4 === 0 ? 4 : row % 4;
    const ind = Math.floor((row - 1) / 4);
    const turn = stockInfo[indList[ind] + comp].price.length;
    if (col === 0) {
      return companyName[indList[ind] + comp];
    }
    if (col === 1) {
      return myStatus[indList[ind] + comp];
    }
    if (col === 2) {
      return stockInfo[indList[ind] + comp].price[turn - 1].toLocaleString();
    }
    if (col === 3) {
      if (turn === 1) {
        return 0 + "%";
      } else {
        return stockInfo[indList[ind] + comp].weight[turn - 2] + "%";
      }
    }
  };

  // 색 규칙
  const cellColor = (data, col, row) => {
    if (col === 0 && row !== 0) {
      const i = Math.floor((row - 1) / 4);
      if (i < 1) {
        return { backgroundColor: "rgba(60, 179, 113, 0.5)" };
      }
      if (i < 2) {
        return { backgroundColor: "rgba(128, 128, 128, 0.5)" };
      }
      if (i < 3) {
        return { backgroundColor: "rgba(237, 156, 165, 0.5)" };
      }
      if (i < 4) {
        return { backgroundColor: "rgba(75, 137, 220, 0.5)" };
      }
      if (i < 5) {
        return { backgroundColor: "rgba(255, 255, 127, 0.5)" };
      }
    }
    if (col === 3) {
      if (data.startsWith("-") && data.endsWith("%")) {
        return { color: "blue" };
      } else if (data === "0%") {
        return { color: "black" };
      } else if (data.endsWith("%")) {
        return { color: "red" };
      }
    }
    if (col === 1) {
      if (data > 0) {
        return { color: "green", backgroundColor: "yellow" };
      }
    }
  };

  return (
    <div className={`myinfo-container ${show ? "flex" : " invisible"}`}>
      <div className={`main-window flex`}>
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
          <span className=" underline">F</span>
          ile
          <span className="ml-4 underline">E</span>dit
          <span className="ml-4 underline">V</span>iew
          <span className="ml-4 underline">H</span>elp
        </div>

        <div className="main-window-inside flex flex-col">
          <div>
            <p style={{ fontSize: "20px" }}>
              총 자산 : {formatNumber(sumStock(myStatus) + myStatus.cash)} ₩{" "}
            </p>
            <span style={{ color: "red" }}>
              주식: {formatNumber(sumStock(myStatus))} ₩
            </span>
            <br />
            <span style={{ color: "blue" }}>
              현금: {formatNumber(myStatus.cash)} ₩
            </span>
          </div>
          <div className="nes-container with-title mt-4 mb-4 flex-grow select-none min-h-0 px-3">
            <p className="title" style={{ lineHeight: "0.5" }}>
              보유 주식
            </p>
            <div className=" win-my-table-container">
              <table className="win-my-table">
                <tbody>
                  {Array.from({ length: rows }, (_, rowIndex) => (
                    <tr
                      key={rowIndex}
                      onMouseEnter={() => setTT(rowIndex)}
                      onMouseLeave={() => setTT(rows + 1)}
                      onClick={() => {
                        if (rowIndex > 0) {
                          setInd(indList[Math.floor((rowIndex - 1) / 4)]);
                          setComp(
                            rowIndex % 4 === 0 ? "4" : (rowIndex % 4) + ""
                          );
                        }
                      }}
                    >
                      {Array.from({ length: cols }, (_, colIndex) => {
                        const cellData = cellRule(rowIndex, colIndex);
                        return (
                          <td
                            key={colIndex}
                            style={cellColor(cellData, colIndex, rowIndex)}
                            className=" relative"
                            id={"T" + rowIndex + "-" + colIndex}
                          >
                            {tt === rowIndex + 1 &&
                            rowIndex < 21 &&
                            colIndex == 0 ? (
                              <div className="win-my-tooltip">
                                {formatNumber(
                                  parseInt(
                                    document.getElementById(
                                      `T${rowIndex + 1}-1`
                                    ).innerText
                                  ) *
                                    parseInt(
                                      document
                                        .getElementById(`T${rowIndex + 1}-2`)
                                        .innerText.replace(/,/g, "")
                                    )
                                )}
                              </div>
                            ) : null}
                            {cellData}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
