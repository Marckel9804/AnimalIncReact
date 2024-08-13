import WebSocket, { WebSocketServer } from 'ws'
import { v4 as uuidv4 } from 'uuid'

const wss = new WebSocketServer({ port: 4000 })
let players = []
let readyCount = 0
let gameState = 'waiting'
let ladder = []
let results = []
let gameOver = false // 게임 종료 상태 추가

wss.on('connection', (ws) => {
  const clientId = uuidv4()
  const player = {
    clientId,
    ws,
    ready: false,
    nickname: `Player${players.length + 1}`,
    grade: 'Gold',
    points: 1000,
    score: 0, // 스페이스바 횟수를 위한 필드 추가
  }
  players.push(player)

  if (players.length > 4) {
    ws.send(JSON.stringify({ type: 'roomFull' }))
    ws.close()
    return
  }

  // 클라이언트 초기화 메시지 전송
  ws.send(JSON.stringify({ type: 'init', clientId, playerNum: players.length }))

  broadcastPlayers()

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString()) // Buffer를 문자열로 변환하여 JSON으로 파싱
    console.log('Received message >> ', parsedMessage)

    switch (parsedMessage.type) {
      case 'ready':
        handleReadyMessage(parsedMessage)
        break
      case 'finishPath':
        handleFinishPath(parsedMessage)
        break
      case 'count':
        handleSpaceBarPress(parsedMessage) // 스페이스바 이벤트 처리 추가
        break
      default:
        broadcast(parsedMessage)
    }
  })

  ws.on('close', () => {
    players = players.filter((p) => p.ws !== ws)
    broadcastPlayers()
  })
})

function handleReadyMessage(message) {
  const player = players.find((p) => p.clientId === message.clientId)
  if (player) {
    player.ready = message.ready
    readyCount = players.filter((p) => p.ready).length

    broadcastPlayers()

    if (readyCount === players.length && players.length > 1) {
      setTimeout(() => {
        startGame()
      }, 5000)
    }
  }
}

// 사다리 게임에 필요한 로직
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

// 사다리 게임 시작~
function startGame() {
  gameState = 'running'
  ladder = createLadder(players.length)
  broadcast(
    JSON.stringify({
      type: 'startGame',
      ladder,
      players: players.map((p) => p.clientId),
    })
  )
}

// 사다리 게임 끝 !
function handleFinishPath(message) {
  results.push({ clientId: message.clientId, result: message.result })
  if (results.length === players.length) {
    broadcast(JSON.stringify({ type: 'gameEnded', results }))
    gameState = 'waiting'
    results = []
    players.forEach((p) => (p.ready = false))
    readyCount = 0
    broadcastPlayers()
  }
}

// 스페이스바 이벤트 핸들러 수정
function handleSpaceBarPress(message) {
  const player = players.find((p) => p.clientId === message.clientId)
  if (player) {
    player.score += 1

    console.log(`Player ${player.nickname} score: ${player.score}`)

    if (!gameOver && player.score >= 10) {
      gameOver = true
      console.log(`Player ${player.nickname} is the winner!`)

      // 첫 번째로 10번을 달성한 플레이어에게만 1등 메시지 전송
      player.ws.send(
        JSON.stringify({
          type: 'gameOver',
          message: '1등입니다! 게임이 종료되었습니다.',
          isWinner: true, // 1등 여부를 나타내는 필드 추가
        })
      )

      // 나머지 플레이어들에게 게임 종료를 알림
      players.forEach((p) => {
        if (p.clientId !== player.clientId) {
          p.ws.send(
            JSON.stringify({
              type: 'gameOver',
              message: '게임이 종료되었습니다.',
            })
          )
        }
      })
    }

    // 업데이트된 점수를 모든 클라이언트에게 전송
    broadcast(
      JSON.stringify({
        type: 'count',
        clientId: player.clientId,
        count: player.score,
        playerNum: players.indexOf(player) + 1, // 플레이어 번호 추가
      })
    )
  }
}

function broadcastPlayers() {
  const playerList = players.map((p) => ({
    clientId: p.clientId,
    nickname: p.nickname,
    grade: p.grade,
    points: p.points,
    ready: p.ready,
    score: p.score, // 점수 정보 추가
  }))

  broadcast(JSON.stringify({ type: 'players', players: playerList }))
}

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
