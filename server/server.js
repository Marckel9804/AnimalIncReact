import WebSocket, { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'

const wss = new WebSocketServer({ port: 4000 })
let players = [] // 현재 연결된 플레이어들을 저장하는 배열
let readyCount = 0 // 현재 레디 상태인 플레이어 수
let gameState = 'waiting' // 게임 상태 (대기 중, 진행 중 등)
let ladder = [] // 게임에서 사용할 사다리 데이터
let results = [] // 게임 결과를 저장할 배열
let gameOver = false // 게임 종료 여부를 나타내는 플래그
let countdownInterval // 카운트다운 타이머를 저장할 변수

// 클라이언트가 서버에 연결될 때 실행되는 함수
wss.on('connection', (ws) => {
  const clientId = uuidv4() // 클라이언트 ID 생성
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString())
    console.log('Received message:', parsedMessage)

    switch (parsedMessage.type) {
      case 'login':
        handleLogin(parsedMessage, ws, clientId)
        break
      case 'ready':
        handleReadyMessage(parsedMessage)
        break
      case 'chat':
        broadcast(parsedMessage)
        break
      case 'count':
        handleSpaceBarPress(parsedMessage)
        break
      case 'finishPath':
        handleFinishPath(parsedMessage)
        break
      default:
        console.log('Unknown message type:', parsedMessage.type)
    }
  })

  // 플레이어가 연결을 끊었을 때 실행되는 함수
  ws.on('close', () => {
    players = players.filter((p) => p.ws !== ws) // 연결 끊은 플레이어 제거
    readyCount = players.filter((p) => p.ready).length // 레디 상태 갱신
    broadcastPlayers() // 모든 클라이언트에게 업데이트된 상태 전송
  })
})

// 플레이어 로그인 처리 함수
function handleLogin(parsedMessage, ws, clientId) {
  const player = {
    clientId: parsedMessage.clientId || clientId, // 플레이어 ID 생성 또는 수신된 ID 사용
    ws, // WebSocket 연결 객체
    ready: false,
    nickname: parsedMessage.userNickname || `Player${players.length + 1}`, // 닉네임이 없으면 기본값으로 Player 사용
    grade: parsedMessage.userGrade,
    points: parsedMessage.userPoint,
    score: 0,
    picture: parsedMessage.userPicture, // 여기서 오타를 수정

  }
  players.push(player) // 새로운 플레이어를 players 배열에 추가

  console.log('Player logged in:', player)

  // 최대 플레이어 수를 초과하면 연결 종료
  if (players.length > 4) {
    ws.send(JSON.stringify({ type: 'roomFull' }))
    ws.close()
    return
  }

  // 초기화 메시지를 클라이언트에 전송
  ws.send(
    JSON.stringify({
      type: 'init',
      clientId: player.clientId,
      playerNum: players.length,
    })
  )

  // 전체 플레이어 상태를 클라이언트에 브로드캐스트
  broadcastPlayers()
}

// 플레이어 레디 상태 처리 함수
function handleReadyMessage(message) {
  if (!message.clientId) {
    console.log('Received undefined clientId. Message ignored:', message)
    return // clientId가 undefined인 경우 처리를 중단
  }

  const player = players.find((p) => p.clientId === message.clientId)
  if (player) {
    player.ready = message.ready
    console.log(
      `플레이어 ${player.nickname}의 레디 상태가 ${
        player.ready ? '레디됨' : '레디 취소됨'
      }로 설정되었습니다.`
    )
    readyCount = players.filter((p) => p.ready).length
    broadcastPlayers()
    if (readyCount === players.length && players.length > 1) {
      startCountdown()
    }
  } else {
    console.log('플레이어를 찾을 수 없습니다:', message.clientId)
  }
}

// 카운트다운 시작 함수
function startCountdown() {
  let countdown = 5 // 5초 카운트다운
  broadcast({ type: 'countdown', countdown })

  countdownInterval = setInterval(() => {
    countdown -= 1
    if (countdown > 0) {
      broadcast({ type: 'countdown', countdown }) // 매초 카운트다운 업데이트
    } else {
      clearInterval(countdownInterval)
      startGame() // 카운트다운이 끝나면 게임 시작
    }
  }, 1000)
}

// 사다리 생성 함수 (게임 시작 시 호출됨)
function createLadder(numPlayers) {
  const maxHorizontalLines = Math.floor(Math.random() * 10) * 2 + 2
  return Array.from({ length: maxHorizontalLines }, () =>
    Array(numPlayers - 1).fill(false)
  ).map((row) => {
    const col = Math.floor(Math.random() * (numPlayers - 1))
    row[col] = true
    return row
  })
}

// 게임 시작 함수
function startGame() {
  gameState = 'running'
  ladder = createLadder(players.length) // 사다리 생성
  broadcast(
    JSON.stringify({
      type: 'startGame', // 게임 시작 메시지 전송
      ladder,
      players: players.map((p) => p.clientId),
    })
  )
}

// 게임 종료 후 결과 처리 함수
function handleFinishPath(message) {
  results.push({ clientId: message.clientId, result: message.result })
  if (results.length === players.length) {
    broadcast(JSON.stringify({ type: 'gameEnded', results })) // 게임 종료 메시지 전송
    gameState = 'waiting'
    results = []
    players.forEach((p) => (p.ready = false)) // 모든 플레이어의 레디 상태 초기화
    readyCount = 0
    broadcastPlayers() // 플레이어 상태 업데이트 후 브로드캐스트
  }
}

// 게임 중 점수 업데이트 함수 (스페이스바 누를 때 호출됨)
function handleSpaceBarPress(message) {
  const player = players.find((p) => p.clientId === message.clientId)
  if (player) {
    player.score += 1

    console.log(`Player ${player.nickname} score: ${player.score}`)

    if (!gameOver && player.score >= 10) {
      gameOver = true
      console.log(`Player ${player.nickname} is the winner!`)

      player.ws.send(
        JSON.stringify({
          type: 'gameOver', // 게임 종료 메시지 전송
          message: '1등입니다! 게임이 종료되었습니다.',
          isWinner: true,
        })
      )

      players.forEach((p) => {
        if (p.clientId !== player.clientId) {
          p.ws.send(
            JSON.stringify({
              type: 'gameOver', // 다른 플레이어들에게도 게임 종료 알림
              message: '게임이 종료되었습니다.',
            })
          )
        }
      })
    }

    broadcast(
      JSON.stringify({
        type: 'count', // 현재 점수 업데이트
        clientId: player.clientId,
        count: player.score,
        playerNum: players.indexOf(player) + 1,
      })
    )
  }
}

// 플레이어 정보 브로드캐스트 함수
function broadcastPlayers() {
  const playerList = players.map((p) => ({
    clientId: p.clientId,
    nickname: p.nickname,
    grade: p.grade,
    points: p.points,
    ready: p.ready, // 레디 상태 포함
    score: p.score,
    picture: p.picture, // 수정된 부분: 올바른 필드명을 사용하여 데이터를 전송

  }))

  console.log('플레이어 정보 뿌리는 코드임 >>> ', playerList)

  broadcast(JSON.stringify({ type: 'players', players: playerList }))
}

// 메시지 브로드캐스트 함수
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        typeof message === 'string' ? message : JSON.stringify(message)
      )
    }
  })
}

console.log('WebSocket server is running on ws://localhost:4000')
