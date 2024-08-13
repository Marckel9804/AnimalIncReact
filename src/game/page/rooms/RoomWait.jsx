import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import backgroundImage from "../../../assets/background.jpg";
import axios from "../../../utils/axios.js";

const Container = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  padding: 2rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const RoomInfoContainer = styled.div`
  padding: 1rem;
  background-color: #ffffff;
  border: 3px solid #000000;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const MessageBalloon = styled.div`
  &.from-left,
  &.from-right {
    color: black;
  }
`;

const MessageContainer = styled.section`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;

  &.left {
    justify-content: flex-start;
  }

  &.right {
    justify-content: flex-end;
  }

  .nes-bcrikko {
    margin: 0 1rem;
  }
`;

const SmallButton = styled.button`
  font-size: 0.55rem;
  padding: 0.1rem 0.15rem;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4cbdb8;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
`;

const RoomWait = () => {
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [loggedInPlayerId, setLoggedInPlayerId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, roomName: initialRoomName, maxPlayers, userNum } =
    location.state || {};
  const socketRef = useRef(null);
  const clientId = useRef(uuidv4());
  const timerRef = useRef(null);

  // 1. insertUserStatus 함수 정의
  const insertUserStatus = async (gameRoomId, userNum) => {
    console.log("gameRoomId",gameRoomId)
    console.log("userNum",userNum)
    try {
      const response = await axios.post(
        "/game/insertUserStatus",
        null,
        {
          params: {
            gameRoomId: gameRoomId,
            userNum: userNum,
          },
        }
      );
      console.log("User status inserted:", response.data);
    } catch (error) {
      console.error("Error inserting user status:", error);
    }
  };

  // 2. useEffect 내에서 함수 호출
  useEffect(() => {
    console.log("유저 번호 (userNum): ", userNum);
    console.log("게임 방 ID (gameRoomId): ", roomId);

    // 사용자가 방에 입장했을 때, 사용자 상태를 데이터베이스에 삽입
    insertUserStatus(roomId, userNum);

    // WebSocket 연결 코드
    const socket = new WebSocket("ws://localhost:4000");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
  
        // 메시지가 비어 있지 않을 때만 상태 업데이트
        if (parsedMessage.text && parsedMessage.text.trim()) {
          setChatMessages((prevMessages) => [...prevMessages, parsedMessage]);
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
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
        const response = await axios.get("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const loggedInPlayer = response.data;
        setPlayers([loggedInPlayer]);
        setLoggedInPlayerId(loggedInPlayer.id); // 로그인된 사용자의 ID 설정
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };

    const fetchRoomDetails = async () => {
      if (roomId) {
        try {
          const response = await axios.get(`/game/roomInfo/${roomId}`);
          const roomDetails = response.data;
          console.log("roomDetails >>> ", roomDetails);
          if (roomDetails) {
            setRoomName(roomDetails.roomName);
          }
        } catch (error) {
          console.error("Error fetching room details:", error);
        }
      } else {
        setRoomName(initialRoomName);
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
      const message = { sender: loggedInPlayerId, text: newMessage.trim() }; // 메시지에 trim() 적용
      socketRef.current.send(JSON.stringify(message));
      setChatMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage(""); // 메시지 전송 후 입력 필드 초기화
    }
  };
  

  const handleBackButtonClick = () => {
    navigate("/CreateRoom");
  };

  const handleReadyClick = () => {
    if (isReady) {
      setIsReady(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setIsReady(true);
      if (players.length === maxPlayers) {
        console.log("Player is ready. Navigating to game in 5 seconds...");
        timerRef.current = setTimeout(() => {
          console.log(`Navigating to /game/${roomId}`);
          navigate(`/game/${roomId}`);
        }, 5000);
      } else {
        alert("모든 플레이어가 준비되지 않았습니다.");
      }
    }
  };

  return (
    <Container>
      <Content>
        <HeaderContainer>
          <button
            type="button"
            className="nes-btn is-primary"
            onClick={handleBackButtonClick}
          >
            뒤로가기
          </button>
          <button
            type="button"
            className={`nes-btn ${isReady ? "is-warning" : "is-success"}`}
            onClick={handleReadyClick}
          >
            {isReady ? "취소" : "준비"}
          </button>
        </HeaderContainer>
        <RoomInfoContainer>
          <p>방 이름: {roomName}</p>
        </RoomInfoContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((player, index) => (
            <div key={index} className="nes-container is-rounded p-4">
              <Header>
                <span>
                  {player.userNickname}{" "}
                  {index === 0 && isReady && <span>(READY)</span>}
                </span>
                <div></div>
              </Header>
              <div className="bg-gray-100 p-4 rounded mt-2 nes-container">
                <div className="flex items-center">
                  <img
                    src={`https://via.placeholder.com/150?text=유저이미지${index + 1}`}
                    alt={`유저이미지${index + 1}`}
                    className="rounded"
                  />
                  <div className="ml-4">
                    <p className="nes-text">
                      {player.userGrade} {player.userPoint}P
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div
            style={{ backgroundColor: "#4CBDB8", height: "300px", overflowY: "scroll" }}
            className="nes-container is-rounded p-4 text-white"
          >
            <section className="message-list">
              {chatMessages.length > 0 &&
                chatMessages.map((message, index) => (
                  <MessageContainer
                    key={index}
                    className={
                      message.sender === loggedInPlayerId ? "right" : "left"
                    }
                  >
                    {message.sender !== loggedInPlayerId && (
                      <i className="nes-bcrikko"></i>
                    )}
                    <MessageBalloon
                      className={`nes-balloon ${
                        message.sender === loggedInPlayerId
                          ? "from-right"
                          : "from-left"
                      } nes-pointer`}
                    >
                      <p>{message.text}</p>
                    </MessageBalloon>
                    {message.sender === loggedInPlayerId && (
                      <i className="nes-bcrikko"></i>
                    )}
                  </MessageContainer>
                ))}
            </section>
          </div>
        </div>

        <div id="room-wait">
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
      </Content>
    </Container>
  );
};

export default RoomWait;
