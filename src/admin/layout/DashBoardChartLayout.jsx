import UserCountChart from "../component/UserCountChart.jsx";
import {useEffect, useState} from "react";
import TierCountChart from "../component/TierCountChart.jsx";
import ReportsChart from "../component/ReportsChart.jsx";

let years = [2020, 2021, 2022, 2023, 2024]
let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const DashBoardChartLayout = (props) => {
  const {menu} = props

  const NOW = new Date();
  console.log('today',NOW.getMonth()+1,NOW.getFullYear())

  const [yearUC, setYearUC] = useState(NOW.getFullYear());
  const [monthUC, setMonthUC] = useState(months[NOW.getMonth()]);
  const [yearTC, setYearTC] = useState(NOW.getFullYear());
  const [monthTC, setMonthTC] = useState(months[NOW.getMonth()]);
  const [yearReport, setYearReport] = useState(NOW.getFullYear());
  const [monthReport, setMonthReport] = useState(months[NOW.getMonth()]);

  const onYearUC = (e) => {
    setYearUC(e.target.value)
  }
  const onMonthUC = (e) => {
    setMonthUC(e.target.value)
  }

  const onMonthTC = (e) => {
    setMonthTC(e.target.value)
  }
  const onYearTC = (e) => {
    setYearTC(e.target.value)
  }

  const onMonthReport = (e) => {
    setMonthReport(e.target.value)
  }
  const onYearReport = (e) => {
    setYearReport(e.target.value)
  }

  return (
    <div id='DashBoardChartLayout' className='ml-56 grid grid-cols-2 gap-x-32 gap-y-8 w-full'>

      {/* 월별 사용자 수 */}
      <div className='nes-container with-title' style={{width: '600px', backgroundColor:"white"}}>
        <p className='title' style={{lineHeight: 0.5}}>{yearUC}년 {monthUC}월 사용자 인원</p>
        <div className='flex gap-2'>

          <div className="nes-select is-error">
            <select name='year' value={yearUC} onChange={onYearUC}>
              <option value="0" hidden>...</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </div>

          <div className="nes-select is-error">
            <select name='month' value={monthUC} onChange={onMonthUC}>
              <option value="0" hidden>...</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}월</option>
              ))}
            </select>
          </div>

        </div>
        <UserCountChart menu={menu} month={monthUC} year={yearUC}/>
      </div>

      {/* 월별 티어 분포도 */}
      <div className='nes-container with-title' style={{width: '600px', backgroundColor:"white"}}>
        <p className='title' style={{lineHeight: 0.5}}>{yearTC}년 {monthTC}월 티어 분포도</p>
        <div className='flex gap-x-2'>

          <div className="nes-select is-error">
            <select name='year' value={yearTC} onChange={onYearTC}>
              <option value="0" hidden>...</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </div>

          <div className="nes-select is-error">
            <select name='month' value={monthTC} onChange={onMonthTC}>
              <option value="0" hidden>...</option>
              {months.map((month) => (
                <option key={month} value={month}>{month}월</option>
              ))}
            </select>
          </div>

        </div>
        <TierCountChart month={monthTC} year={yearTC}/>
      </div>


      {/* 일별 신고수 */}
      <div className='nes-container with-title' style={{width: '600px', backgroundColor:"white"}}>
        <p className='title' style={{lineHeight: 0.5}}>{yearReport}년 {monthReport}월 신고수</p>
        <div className='flex gap-2'>

          <div className="nes-select is-error">
            <select name='year' value={yearReport} onChange={onYearReport}>
              <option value="0" hidden>...</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </div>

          <div className="nes-select is-error">
            <select name='month' value={monthReport} onChange={onMonthReport}>
              <option value="0" hidden>...</option>
              {months.map((month) => (
                <option key={month} value={month}>{month  }월</option>
              ))}
            </select>
          </div>

        </div>
        <ReportsChart menu={menu} month={monthReport} year={yearReport}/>
      </div>


      {/*/!* 월별 티어 분포도 *!/*/}
      {/*<div className='nes-container with-title' style={{width: '600px', backgroundColor:"white"}}>*/}
      {/*  <p className='title' style={{lineHeight: 0.5}}>{yearUC}년 {monthUC}월 사용자 인원</p>*/}
      {/*  <div className='flex gap-2'>*/}

      {/*    <div className="nes-select is-error">*/}
      {/*      <select name='year' onChange={onYearUC}>*/}
      {/*        <option value="0" hidden>...</option>*/}
      {/*        {years.map((year) => (*/}
      {/*          <option key={year} value={year}>{year}</option>*/}
      {/*        ))}*/}
      {/*      </select>*/}
      {/*    </div>*/}

      {/*    <div className="nes-select is-error">*/}
      {/*      <select name='month' onChange={onMonthTC}>*/}
      {/*        <option value="0" hidden>...</option>*/}
      {/*        {months.map((month) => (*/}
      {/*          <option key={month} value={month}>{month}</option>*/}
      {/*        ))}*/}
      {/*      </select>*/}
      {/*    </div>*/}

      {/*  </div>*/}
      {/*  /!*<UserCountChart menu={menu}/>*!/*/}
      {/*</div>*/}


    </div>
  );
}

export default DashBoardChartLayout