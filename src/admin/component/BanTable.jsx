import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";
import UserDetail from "./UserDetail.jsx";
import BanModal from "./BanModal.jsx";

const BanTable = (props) => {

  const menu = props.menu;
  const [banlist, setBanlist] = useState([]);
  const [data, setData] = useState({});
  const [modal, setModal] = useState('none');

  useEffect(() => {
    axios.get("/api/admin/ban")
      .then((res) => {
        setBanlist(res.data)
      })
      .catch((err)=> {
        console.log('get banlist err', err)
      })
  }, [menu]);

  const openBan = (e) => {
    const row = e.currentTarget;
    const cells = row.getElementsByTagName('td');
    const cellValues = Array.from(cells).map(cell => cell.textContent);
    console.log('cell',cellValues)

    setData(cellValues)
    setModal('flex')
  }
  const closeBan=() => {
    setModal('none')
  }

  return (
    <div id='UserTable' className='ml-52 my-2'>
      <table className='nes-table is-bordered is-centered justify-center w-full'>
        <thead>
        <tr>
          <th className='w-16'>banID</th>
          <th className='w-16'>userNum</th>
          <th className='w-32'>정지사유</th>
          <th className='w-32'>정지날짜</th>
          <th className='w-32'>해금날짜</th>
        </tr>
        </thead>
        <tbody>
        {banlist.map((ban, index) => (
          <tr key={index}
              onClick={openBan}
              className='hover:bg-emerald-200 nes-pointer'>
            <td className='w-16'>{ban.banId}</td>
            <td className='w-16'>{ban.userNum}</td>
            <td className='w-32'>{ban.banReason}</td>
            <td className='w-32'>{ban.bannedDate}</td>
            <td className='w-32'>{ban.unlockDate}</td>
          </tr>
        ))}
        </tbody>
      </table>

      <div id='BanUpdateModal'
           className='fixed top-0 left-0 h-dvh w-dvw bg-emerald-100 bg-opacity-40 z-50 flex items-center justify-center'
           style={{display: modal}}
           onClick={closeBan}>
        <div
          className='flex min-w-64 min-h-80 rounded-lg border-4 border-emerald-600 justify-center px-8 py-4 bg-gray-50 bg-opacity-100'
          onClick={(e) => e.stopPropagation()}>
          <BanModal data={data}/>
        </div>
      </div>
    </div>
  )
}

export default BanTable