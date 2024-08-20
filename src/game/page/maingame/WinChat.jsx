import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";

function WinChat({ show, setShow, sendMessage, messages, myStatus }) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = () => {
    const newMessage = {
      type: "gameChat",
      content: message,
    };
    sendMessage(newMessage);
    setMessage("");
  };

  //채팅 종류에 따라 스타일 변경
  const chatStyle = (message) => {
    if (message.type === "game") {
      return { fontWeight: "bold", color: "red", textAlign: "center" };
    }
    if (message.usernum !== myStatus.userNum) {
      return { color: "green", textAlign: "end" };
    }
  };
  //채팅 종류에 따라 화면에 보여질 구성 변경
  const chatContent = (message) => {
    if (message.type === "game") {
      return `<게임> : ${message.content}`;
    }
    return `${message.sender} : ${message.content}`;
  };

  return (
    <div className={"win-chat-container"}>
      <div className={` main-window pb-2 ${show ? "flex" : "hidden"} `}>
        <div className="window-head">
          Chat
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
        <div className="main-window-inside flex flex-col overflow-y-scroll">
          <ul>
            {messages.map((msg, index) => (
              <li key={index} style={chatStyle(msg)}>
                {chatContent(msg)}
              </li>
            ))}
            <div ref={messagesEndRef} />
          </ul>
        </div>
        <div className="mt-2 flex">
          <input
            type="text"
            className="win-chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                send();
              }
            }}
          />
          <button className="win-chat-btn ml-5 px-5" onClick={send}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinChat;
