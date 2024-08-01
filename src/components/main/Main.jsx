import React from 'react'
import ReactDOM from 'react-dom'
import Rank_week from './Rank_week'
import User_main from './User_main'
import './Main.css'

const Main = () => {
  return (
    <div className="main-container">
      <Rank_week />
      <User_main />
    </div>
  )
}

export default Main
