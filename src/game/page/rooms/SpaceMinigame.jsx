import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import 'nes.css/css/nes.min.css'

const SpaceMinigame = ({ onClose }) => {
  const [count, setCount] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [gameMessage, setGameMessage] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [isKeyPressed, setIsKeyPressed] = useState(false)
  const [hit, setHit] = useState(false)
  const socketRef = useRef(null)
  const [clientId, setClientId] = useState(null)
  const [playerNum, setPlayerNum] = useState(1) // 플레이어 번호 상태
  const [playerCounts, setPlayerCounts] = useState([0, 0, 0, 0]) // 모든 플레이어의 카운트를 관리

  useEffect(() => {
    const initializeWebSocket = () => {
      const socket = new WebSocket('ws://localhost:4000')
      socketRef.current = socket // WebSocket 객체를 참조에 할당

      socket.onopen = () => {
        console.log('Connected to WebSocket server')
      }

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log('Received message:', data)

        if (data.type === 'init' && data.clientId) {
          setClientId(data.clientId)
          setPlayerNum(data.playerNum)
        }

        if (data.type === 'count') {
          setPlayerCounts((prevCounts) => {
            const newCounts = [...prevCounts]
            newCounts[data.playerNum - 1] = data.count
            return newCounts
          })
        }

        if (data.type === 'gameOver') {
          setGameOver(true)
          if (data.isWinner) {
            setGameMessage('1등입니다! 게임이 종료되었습니다.')
          } else {
            setGameMessage('게임이 종료되었습니다.')
          }
          setTimeout(() => {
            onClose()
          }, 3000)
        }
      }

      socket.onclose = (event) => {
        console.log('WebSocket connection closed', event)
        if (event.code !== 1000) {
          // 정상적인 종료가 아니면 재연결 시도
          setTimeout(initializeWebSocket, 1000)
        }
      }

      socket.onerror = (error) => {
        console.error('WebSocket error', error)
        socket.close() // 에러 발생 시 연결을 닫음
      }
    }

    initializeWebSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.code === 'Space' &&
        !isKeyPressed &&
        !gameOver &&
        playerNum !== null &&
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        const newCount = count + 1
        const newProgress = Math.min(progress + 1, 10)
        setCount(newCount)
        setProgress(newProgress)
        setIsKeyPressed(true)
        setHit(true)
        setTimeout(() => setHit(false), 200)

        const playerData = {
          type: 'count',
          clientId,
          count: newCount,
          progress: newProgress,
          playerNum,
        }

        socketRef.current.send(JSON.stringify(playerData))

        setPlayerCounts((prevCounts) => {
          const newCounts = [...prevCounts]
          newCounts[playerNum - 1] = newCount
          return newCounts
        })
      }
    }

    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
        setIsKeyPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isKeyPressed, gameOver, count, progress, clientId, playerNum])

  useEffect(() => {
    if (count > highScore) {
      setHighScore(count)
    }
  }, [count, highScore])

  return (
    <MinigameContainer>
      <Minigame>
        <MinigameHead>
          Space Minigame <BoxIcon onClick={onClose}>x</BoxIcon>
        </MinigameHead>
        <Instructions>스페이스바를 10번 연타하세요!</Instructions>
        <CountDisplay>
          <p>현재 카운트: {count}</p>
        </CountDisplay>
        <ProgressContainer>
          <div id="space-progress">
            <progress
              className="nes-progress is-pattern"
              value={progress}
              max="10"
            ></progress>
          </div>
        </ProgressContainer>
        <PlayerList>
          <Player>
            <Character>P1</Character>
            {playerNum === 1 ? `${count}회` : `${playerCounts[0]}회`}
          </Player>
          <Player>
            <Character>P2</Character>
            {playerNum === 2 ? `${count}회` : `${playerCounts[1]}회`}
          </Player>
          <Player>
            <Character>P3</Character>
            {playerNum === 3 ? `${count}회` : `${playerCounts[2]}회`}
          </Player>
          <Player>
            <Character>P4</Character>
            {playerNum === 4 ? `${count}회` : `${playerCounts[3]}회`}
          </Player>
        </PlayerList>
        <ButtonContainer>
          <StyledButton hit={hit ? 1 : 0} className="minigame-nes-btn">
            Space Bar
          </StyledButton>
        </ButtonContainer>

        {gameMessage && <GameMessage>{gameMessage}</GameMessage>}
      </Minigame>
    </MinigameContainer>
  )
}

// styled-components: 게임 UI 스타일링
const MinigameContainer = styled.div`
  background-color: #4cbdb8;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Minigame = styled.div`
  border-top: 2px #f0ffff solid;
  border-left: 2px #f0ffff solid;
  border-right: 2px #252525 solid;
  border-bottom: 2px #252525 solid;
  background-color: #c0c0c0;
  width: 90%;
  height: 80%;
`

const MinigameHead = styled.div`
  background-color: #808080;
  margin: 2px;
  padding: 2px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BoxIcon = styled.div`
  border-top: 2px #f0ffff solid;
  border-left: 2px #f0ffff solid;
  border-right: 2px #252525 solid;
  border-bottom: 2px #252525 solid;
  width: 17px;
  height: 17px;
  background-color: #bcbfbc;
  display: flex;
  justify-content: center;
  padding-right: 2px;
  font-size: 15px;
  user-select: none;
  align-items: center;
  cursor: pointer;
`

const Instructions = styled.p`
  text-align: center;
  font-size: 2em;
  margin-top: 70px;
`

const CountDisplay = styled.div`
  margin-top: 20px;
  text-align: center;
`

const ProgressContainer = styled.div`
  width: 99%;
  margin-top: 20px;
`

const hitAnimation = keyframes`
  0% {
    transform: translateY(0);
  50% {
    transform: translateY(-150px);
  100% {
    transform: translateY(0);
  }
`

const ButtonContainer = styled.div`
  margin-top: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledButton = styled.button`
  position: relative;
  top: 0;
  width: 200px;
  height: 50px;
  font-size: 1.5em;
  box-shadow: inset -4px -4px #adafbc;
  background-color: #e0e0e0;
  border: 2px solid #252525;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:active {
    box-shadow: inset 4px 4px #adafbc;
  }
  ${(props) =>
    props.hit &&
    css`
      animation: ${hitAnimation} 0.2s ease;
    `}
`

const sparkle = keyframes`
  0% {
    opacity: 1;
  50% {
    opacity: 0.5;
  100% {
    opacity: 1;
  }
`

const GameMessage = styled.div`
  margin-top: 60px;
  font-size: 1.5em;
  color: black;
  text-align: center;
  font-weight: bold;
  animation: ${sparkle} 1s infinite;
`

const PlayerList = styled.div`
  margin-top: 95px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const Player = styled.div`
  text-align: center;
`

const Character = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 1px 1px 0px 1px #cccccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.5em;
`

export default SpaceMinigame
