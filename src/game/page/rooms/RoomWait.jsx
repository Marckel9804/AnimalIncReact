import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import backgroundImage from '../../../assets/background.jpg'
import axios from '../../../utils/axios.js'

// 스타일 컴포넌트 정의
const Container = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Content = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;
  padding: 2rem;
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const RoomInfoContainer = styled.div`
  padding: 1rem;
  background-color: #ffffff;
  border: 3px solid #000000;
  border-radius: 8px;
  margin-bottom: 1rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4cbdb8;
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
`

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

const MessageBalloon = styled.div`
  &.from-left,
  &.from-right {
    color: black;
  }
`;

const RoomWait = () => {
  const [chatMessages, setChatMessages] = useState([]) // 채팅 메시지 상태
  const [newMessage, setNewMessage] = useState('') // 새로운 메시지 입력 상태
  const [isReady, setIsReady] = useState(false) // 현재 사용자의 레디 상태
  const [players, setPlayers] = useState([]) // 플레이어 상태
  const [roomName, setRoomName] = useState('') // 방 이름 상태
  const [loggedInPlayerId, setLoggedInPlayerId] = useState(null) // 현재 로그인된 플레이어 ID
  const [userInfo, setUserInfo] = useState(null) // 유저 정보를 저장할 상태 추가
  const [gameStartCountdown, setGameStartCountdown] = useState(null) // 게임 시작 카운트다운 상태
  const navigate = useNavigate()
  const location = useLocation()
  const { roomId, roomName: initialRoomName,userNum  } = location.state || {}
  const socketRef = useRef(null)
  const clientId = useRef(uuidv4())
  const params = useParams();

  const insertUserStatus = async (gameRoomId, userNum) => {
    try {
      const response = await axios.post(
        "/game/insertUserStatus",
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 인증 토큰 추가
          },
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

  // 게임 시작 시 DB에 유저 상태를 저장하는 함수
  const saveUserStatus = async (gameRoomId, userNum) => {
    try {
      const response = await axios.post(
        "/game/saveUserStatus",
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // 인증 토큰 추가
          },
          params: {
            gameRoomId: gameRoomId,
            userNum: userNum,
          },
        }
      );
      console.log("User status saved:", response.data);
    } catch (error) {
      console.error("Error saving user status:", error);
    }
  };

  // WebSocket 연결 설정 및 메시지 처리
  useEffect(() => {
    const fetchLoggedInPlayer = async () => {
      try {
        const response = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        const loggedInPlayer = response.data
        setLoggedInPlayerId(loggedInPlayer.id)
        setUserInfo(loggedInPlayer)
        console.log('Logged in player ID:', loggedInPlayer.id)
      } catch (error) {
        console.error('Error fetching current user data:', error)
      }
    }

    fetchLoggedInPlayer()
  }, [])

  useEffect(() => {
    insertUserStatus(roomId, userNum);
    if (userInfo && roomId) {
      const socket = new WebSocket('ws://localhost:4000');
      socketRef.current = socket;
  
      socket.onopen = () => {
        console.log('Connected to WebSocket server');
        socket.send(
          JSON.stringify({
            type: 'login',
            clientId: clientId.current,
            userNickname: userInfo.userNickname,
            userGrade: userInfo.userGrade,
            userPoint: userInfo.userPoint,
            roomId: roomId,
            userPicture: userInfo.userPicture,
          })
        );
      };
  
      socket.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data);
        console.log('Received from server:', parsedMessage);
      
        if (parsedMessage.type === 'players') {
          console.log('플레이어 데이터:', parsedMessage.players);
          setPlayers(parsedMessage.players);
        } else if (parsedMessage.type === 'countdown') {
          console.log(`카운트다운: ${parsedMessage.countdown}초`);
          setGameStartCountdown(parsedMessage.countdown);
        } else if (parsedMessage.type === 'countdownCanceled') {
          console.log('카운트다운이 취소되었습니다.');
          setGameStartCountdown(null); // 카운트다운을 초기화
        } else if (parsedMessage.type === 'startGame') {
          console.log('게임이 시작됩니다!');
      
          // 게임 시작 메시지를 받았을 때 saveUserStatus와 insertUserStatus 함수를 호출합니다.
          saveUserStatus(roomId, loggedInPlayerId);
      
          // 게임 페이지로 이동
          navigate(`/game/${roomId}`);
        } else if (parsedMessage.type === 'chat') {
          setChatMessages((prevMessages) => [...prevMessages, parsedMessage]);
        } else if (parsedMessage.type === 'readyUpdate') {
          console.log('Updating player ready state...');
          setPlayers((prevPlayers) =>
            prevPlayers.map((player) =>
              player.clientId === parsedMessage.clientId
                ? { ...player, ready: parsedMessage.ready }
                : player
            )
          );
        }
      };
      
  
      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };
  
      return () => {
        socket.close();
      };
    }
  }, [userInfo, roomId, navigate]);

  // 방 정보를 가져오는 함수
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (roomId) {
        try {
          const response = await axios.get(`/game/roomInfo/${roomId}`)
          const roomDetails = response.data
          if (roomDetails) {
            setRoomName(roomDetails.roomName)
          }
        } catch (error) {
          console.error('Error fetching room details:', error)
        }
      } else {
        setRoomName(initialRoomName)
      }
    }

    fetchRoomDetails()
  }, [roomId, initialRoomName])

  // 플레이어 상태가 업데이트될 때마다 상태를 콘솔에 출력하는 useEffect
  useEffect(() => {
    console.log('Updated players state:', players)
  }, [players])

  const handleBackButtonClick = () => {
    // [뒤로가기] 누르면 유저 수 -1 하는 로직
    axios
      .post(`/api/user/game/minusCount/${params.room_id}`)
      .then(() => {
        console.log("인원수 감소!!");
        navigate("/CreateRoom");
      })
      .catch((error) => console.log(error));
  };

  const handleReadyClick = () => {
    console.log('Ready button clicked')
    console.log('Client ID:', clientId.current) // 여기서 clientId를 확인

    if (socketRef.current) {
      const newReadyState = !isReady
      setIsReady(newReadyState)

      console.log('Sending ready state to server:', {
        clientId: clientId.current,
        ready: newReadyState,
      })

      socketRef.current.send(
        JSON.stringify({
          type: 'ready',
          clientId: clientId.current,
          ready: newReadyState,
        })
      )

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player.clientId === clientId.current
            ? { ...player, ready: newReadyState }
            : player
        )
      )
    }
  }

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const message = { sender: loggedInPlayerId, text: newMessage.trim() }
      socketRef.current.send(JSON.stringify({ type: 'chat', ...message }))
      setNewMessage('')
    }
  }

  const PlayerImage = styled.img`
  width: 150px;  // 원하는 너비로 설정
  height: 150px; // 원하는 높이로 설정
  object-fit: cover; // 이미지가 잘리더라도 비율을 유지하며 박스에 맞춥니다.
`;

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
          {isReady && gameStartCountdown && (
            <p>게임 시작까지: {gameStartCountdown}초</p> // 카운트다운 표시
          )}
        </RoomInfoContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((player, index) => (
            <div className="nes-container is-rounded p-4" key={index}>
              <Header>
                <span>
                  {player.nickname}{" "}
                  {player.ready && <span>(READY)</span>}
                </span>
              </Header>
              <div className="bg-gray-100 p-4 rounded mt-2 nes-container">
                <div className="flex items-center">
                  <PlayerImage
                    src={`${player.picture}`}
                    alt={`${player.nickname}'s picture`} // alt 속성을 추가하는 것이 좋습니다.
                  />
                  <div className="ml-4">
                    <p className="nes-text">
                      {player.grade} {player.points}P
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div
            style={{
              backgroundColor: "#4CBDB8",
              height: "300px",
              overflowY: "scroll",
            }}
            className="nes-container is-rounded p-4 text-white"
          >
            <section className="message-list">
              {chatMessages.length > 0 &&
                chatMessages.map((message, index) => (
                  <MessageContainer
                    key={index}
                    className={message.sender === clientId.current ? "right" : "left"} 
                  >
                    {message.sender !== clientId.current && (
                      <i className="nes-bcrikko"></i>
                    )}
                    <MessageBalloon
                      className={`nes-balloon ${message.sender === clientId.current
                        ? "from-right"
                        : "from-left"
                        } nes-pointer`}
                    >
                      <p>{message.text}</p>
                    </MessageBalloon>
                    {message.sender === clientId.current && (
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
