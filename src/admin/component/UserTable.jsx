import {useEffect, useState} from "react";
import axios from "../../utils/axios.js";

const UserTable = (props) => {

  const [list, setList] = useState([])
  const menu = props.menu;

  useEffect(() => {
    axios.get('/api/admin/user')
      .then((res) => {
        console.log('user list', res.data)
        setList(res.data)
      })
      .catch((err) => {
        console.log('get user list err', err)
      })
  }, [menu]);

  const onModal = () => {
    document.getElementById('UserDetailModal').style.display="flex";
  }

  return(
    <div id='UserTable' className='ml-56 my-2'>
      <table className='nes-table is-bordered is-centered justify-center w-full'>
        <thead>
        <tr>
          <th className='w-16'>.no</th>
          <th className='w-32'>권한</th>
          <th className='w-32'>실명</th>
          <th className='min-w-36'>이메일</th>
          <th className='text-center w-28'>티어</th>
          <th className='text-center w-32'>포인트</th>
          <th className='text-center w-32'>루비</th>
          <th className='w-20'>신고횟수</th>
        </tr>
        </thead>
        <tbody>
        {list.map((user, index) => (
          <tr key={index}
              className='hover:bg-emerald-200 nes-pointer'
              onClick={onModal}
          >
            <td className='text-center w-16'>{user.userNum}</td>
            <td className='text-center w-16'>{user.memRoleList}</td>
            <td className='text-center w-32'>{user.userRealname}</td>
            <td className='text-center min-w-36'>{user.userEmail}</td>
            <td className='text-center w-28'>{user.userGrade}</td>
            <td className='text-center w-20'>{user.userPoint}</td>
            <td className='text-center w-32'>{user.userRuby}</td>
            <td className='text-center w-20'>{user.userReportnum}</td>
          </tr>
        ))}
        </tbody>
      </table>

      <div id='UserDetailModal'
           className='fixed top-0 left-0 h-dvh w-dvw bg-emerald-100 bg-opacity-40 z-50 flex items-center justify-center'
           style={{display:"none"}}
      >
        <div className='flex w-64 h-80 rounded-lg border-4 border-emerald-600 justify-center px-8 py-4 bg-gray-50 bg-opacity-100'>
          hihi
        </div>
      </div>
    </div>
  )

}

export default UserTable