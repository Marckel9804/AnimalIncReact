import React, { useState } from "react";
import styled from "styled-components";

const RoomWait = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([...chatMessages, `나 : ${newMessage}`]);
      setNewMessage("");
    }
  };

  return (
    <div className="bg-gray-200 p-8 min-h-screen">
      <div className="container mx-auto relative">
        <div className="flex justify-between mb-4">
          <button type="button" className="nes-btn is-primary">뒤로가기</button>                
          {/*뒤로가기 하면 게임방 리스트로*/}
          <button type="button" className="nes-btn is-success">READY</button>
          {/*Ready 하면 게임화면으로*/}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((player) => (
            <div key={player} className="nes-container is-rounded p-4">
              <div
                style={{ backgroundColor: "#4CBDB8" }}
                className="p-2 rounded text-white nes-text"
              >
                플레이어{player}
                {/*플레이어 4명의 이름이 각각 보이게*/}
              </div>
              <div className="bg-gray-100 p-4 rounded mt-2 nes-container">
                <img
                  src={`https://via.placeholder.com/150?text=유저이미지${player}`}
                  alt={`유저이미지${player}`}
                  className="rounded"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div
            style={{ backgroundColor: "#4CBDB8", height: "300px", overflowY: "scroll" }}
            className="nes-container is-rounded p-4 text-white"
          >
            {chatMessages.map((message, index) => (
              <p key={index} className="nes-text">
                {message}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-4 nes-field is-inline flex">
          <input
            type="text"
            id="inline_field"
            className="nes-input is-success flex-grow"
            placeholder="채팅 메시지를 입력하세요"
            value={newMessage}
            onChange={handleNewMessageChange}
          />
          <button
            type="button"
            className="nes-btn is-primary ml-2"
            onClick={handleSendMessage}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomWait;
