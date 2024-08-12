import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";

function WinChat({ show, setShow, ind, comp, stockInfo }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [bots, setBots] = useState(0);
  const [roomName, setRoomName] = useState(""); // 방 이름을 위한 상태
  const navigate = useNavigate();
  const location = useLocation();
  const {
    roomId,
    roomName: initialRoomName,
    maxPlayers,
  } = location.state || {}; // roomId와 roomName, maxPlayers를 state로부터 가져오기
  const socketRef = useRef(null);
  const clientId = useRef(uuidv4());

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = async (event) => {
      const text = await event.data.text();
      const parsedMessage = JSON.parse(text);
      setChatMessages((prevMessages) => [...prevMessages, parsedMessage]);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const fetchLoggedInPlayer = async () => {
      try {
        // 로그인된 플레이어 정보 가져오기
        const response = await axios.get("http://localhost:8080/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const loggedInPlayer = response.data;
        setPlayers([loggedInPlayer]);
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };

    const fetchRoomDetails = async () => {
      if (roomId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/user/game/room/${roomId}`
          );
          const roomDetails = response.data;
          if (roomDetails) {
            setRoomName(roomDetails.roomName);
          }
        } catch (error) {
          console.error("Error fetching room details:", error);
        }
      } else {
        setRoomName(initialRoomName); // 전달받은 roomName을 상태로 설정
      }
    };

    fetchLoggedInPlayer();
    fetchRoomDetails();
  }, [roomId, initialRoomName]);

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const message = { sender: clientId.current, text: newMessage };
      socketRef.current.send(JSON.stringify(message));
      setNewMessage("");
    }
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
        <div className="main-window-inside flex flex-col">
          <div></div>
        </div>
        <div className="mt-2 flex">
          <input
            type="text"
            className="win-chat-input"
            value={newMessage}
            onChange={handleNewMessageChange}
          />
          <button
            className="win-chat-btn ml-5 px-5"
            onClick={handleSendMessage}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default WinChat;
