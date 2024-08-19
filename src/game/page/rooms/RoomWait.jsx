import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import backgroundImage from '../../../assets/background.jpg'
import axios from '../../../utils/axios.js'

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

const MessageBalloon = styled.div`
  &.from-left,
  &.from-right {
    color: black;
  }
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
`

const SmallButton = styled.button`
  font-size: 0.55rem;
  padding: 0.1rem 0.15rem;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
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

const RoomWait = () => {
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isReady, setIsReady] = useState(false)
  const [players, setPlayers] = useState([])
  const [roomName, setRoomName] = useState('')
  const [loggedInPlayerId, setLoggedInPlayerId] = useState(null)
  const [userInfo, setUserInfo] = useState(null) // 유저 정보를 저장할 상태 추가
  const [gameStartCountdown, setGameStartCountdown] = useState(null) // 게임 시작 카운트다운 상태
  const navigate = useNavigate()
  const location = useLocation()
  const {
    roomId,
    roomName: initialRoomName,
    maxPlayers,
    userNum,
  } = location.state || {}
  const socketRef = useRef(null)
  const clientId = useRef(uuidv4())
  const timerRef = useRef(null)
  const params = useParams()

  // 1. insertUserStatus 함수 정의
  const insertUserStatus = async (gameRoomId, userNum) => {
    try {
      const response = await axios.post('/game/insertUserStatus', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 인증 토큰 추가
        },
        params: {
          gameRoomId: gameRoomId,
          userNum: userNum,
        },
      })
      console.log('User status inserted:', response.data)
    } catch (error) {
      console.error('Error inserting user status:', error)
    }
  }

  // 2. saveUserStatus 함수 정의 (게임 시작 시 호출)
  const saveUserStatus = async (gameRoomId, userNum) => {
    try {
      const response = await axios.post('/game/saveUserStatus', {
        gameRoomId: gameRoomId,
        userNum: userNum,
      })
      console.log('User status saved:', response.data)
    } catch (error) {
      console.error('Error saving user status:', error)
    }
  }

  // 3. useEffect 내에서 함수 호출
  useEffect(() => {
    insertUserStatus(roomId, userNum)
    if (userInfo && roomId) {
      const socket = new WebSocket('ws://localhost:4000')
      socketRef.current = socket

      socket.onopen = () => {
        console.log('Connected to WebSocket server')

        socket.send(
          JSON.stringify({
            type: 'login',
            userNickname: userInfo.userNickname, // 로그인한 사용자의 닉네임
            userGrade: userInfo.userGrade, // 로그인한 사용자의 등급
            userPoint: userInfo.userPoint, // 로그인한 사용자의 포인트
            roomId: roomId, // 현재 방의 ID
          })
        )
      }

      socket.onmessage = (event) => {
        const parsedMessage = JSON.parse(event.data)
        console.log('Received from server:', parsedMessage) // 서버로부터 받은 데이터 로그

        if (parsedMessage.type === 'players') {
          setPlayers(parsedMessage.players)
        } else if (parsedMessage.type === 'chat') {
          setChatMessages((prevMessages) => [...prevMessages, parsedMessage])
        }
      }

      socket.onclose = () => {
        console.log('WebSocket connection closed')
      }

      return () => {
        socket.close()
      }
    }
  }, [userInfo, roomId])

  useEffect(() => {
    const fetchLoggedInPlayer = async () => {
      try {
        const response = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        const loggedInPlayer = response.data
        setPlayers([loggedInPlayer])
        setLoggedInPlayerId(loggedInPlayer.id)
        setUserInfo(loggedInPlayer)
      } catch (error) {
        console.error('Error fetching current user data:', error)
      }
    }

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

    fetchLoggedInPlayer()
    fetchRoomDetails()
  }, [roomId, initialRoomName])

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && socketRef.current) {
      const message = { sender: loggedInPlayerId, text: newMessage.trim() } // 메시지에 trim() 적용
      socketRef.current.send(JSON.stringify(message))
      setChatMessages((prevMessages) => [...prevMessages, message])
      setNewMessage('') // 메시지 전송 후 입력 필드 초기화
    }
  }

  const handleBackButtonClick = () => {
    // [뒤로가기] 누르면 유저 수 -1 하는 로직
    axios
      .post(`/api/user/game/minusCount/${params.room_id}`)
      .then(() => {
        console.log('인원수 감소!!')
        navigate('/CreateRoom')
      })
      .catch((error) => console.log(error))
  }

  const handleReadyClick = async () => {
    if (isReady) {
      setIsReady(false)
      setGameStartCountdown(null) // 카운트다운 취소
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    } else {
      setIsReady(true)
      setGameStartCountdown(5) // 5초 카운트다운 설정

      // 게임 시작 전 사용자 상태 저장 호출
      try {
        await axios.post('/game/saveUserStatus', null, {
          params: {
            gameRoomId: roomId,
            userNum: userNum,
          },
        })
        console.log('User status saved successfully')
      } catch (error) {
        console.error('Error saving user status:', error)
      }

      timerRef.current = setTimeout(() => {
        console.log(`Navigating to /game/${roomId}`)
        navigate(`/game/${roomId}`)
      }, 5000)

      // 카운트다운 타이머 설정
      const countdownTimer = setInterval(() => {
        setGameStartCountdown((prev) => {
          if (prev > 1) return prev - 1
          clearInterval(countdownTimer)
          return null
        })
      }, 1000)
    }
  }

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
            className={`nes-btn ${isReady ? 'is-warning' : 'is-success'}`}
            onClick={handleReadyClick}
          >
            {isReady ? '취소' : '준비'}
          </button>
        </HeaderContainer>
        <RoomInfoContainer>
          <p>방 이름: {roomName}</p>
          {isReady && gameStartCountdown && (
            <p>게임 시작까지: {gameStartCountdown}초</p> // 카운트다운 표시
          )}
        </RoomInfoContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userInfo && (
            <div className="nes-container is-rounded p-4">
              <Header>
                <span>
                  {userInfo.userNickname} {isReady && <span>(READY)</span>}{' '}
                  {/* 사용자가 준비 상태일 경우 표시 */}
                </span>
              </Header>
              <div className="bg-gray-100 p-4 rounded mt-2 nes-container">
                <div className="flex items-center">
                  <img
                    src={`https://via.placeholder.com/150?text=${userInfo.userNickname}`}
                    alt={`유저이미지${userInfo.userNickname}`}
                    className="rounded"
                  />
                  <div className="ml-4">
                    <p className="nes-text">
                      {userInfo.userGrade} {userInfo.userPoint}P{' '}
                      {/* userInfo를 사용하여 정보 표시 */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <div
            style={{
              backgroundColor: '#4CBDB8',
              height: '300px',
              overflowY: 'scroll',
            }}
            className="nes-container is-rounded p-4 text-white"
          >
            <section className="message-list">
              {chatMessages.length > 0 &&
                chatMessages.map((message, index) => (
                  <MessageContainer
                    key={index}
                    className={
                      message.sender === loggedInPlayerId ? 'right' : 'left'
                    }
                  >
                    {message.sender !== loggedInPlayerId && (
                      <i className="nes-bcrikko"></i>
                    )}
                    <MessageBalloon
                      className={`nes-balloon ${
                        message.sender === loggedInPlayerId
                          ? 'from-right'
                          : 'from-left'
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
  )
}

export default RoomWait
