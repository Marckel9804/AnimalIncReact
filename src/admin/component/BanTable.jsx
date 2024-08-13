import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";

const BanTable = (props) => {

  const menu = props.menu;
  const [banlist, setBanlist] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/ban")
      .then((res) => {
        setBanlist(res.data)
        console.log(res.data)
      })
      .catch((err)=> {
        console.log('get banlist err', err)
      })
  }, [menu]);

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
          <tr key={index} className='hover:bg-emerald-200 nes-pointer'>
            <th className='w-16'>{ban.banId}</th>
            <th className='w-16'>{ban.userNum}</th>
            <th className='w-32'>{ban.banReason}</th>
            <th className='w-32'>{ban.bannedDate}</th>
            <th className='w-32'>{ban.unlockDate}</th>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default BanTable