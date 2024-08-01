export const getUserInfo = async () => {
  const response = await fetch('/header/info')
  const data = await response.json()
  return {
    user_nickname: data.user_nickname,
    user_ruby: data.user_ruby,
    user_point: data.user_point,
  }
}

export const logout = () => {
  console.log('Logged out')
  window.location.href = '/logout'
}

export const goToBoard = () => {
  window.location.href = '/board'
}

export const goToMypage = () => {
  window.location.href = '/mypage'
}

export const goToStore = () => {
  window.location.href = '/shop'
}
