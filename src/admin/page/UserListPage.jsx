import CheckAdmin from "../component/CheckAdmin.jsx";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import useCheckAdmin from "../component/CheckAdmin.jsx";
import {useEffect, useState} from "react";
import AdminLayout from "../layout/AdminLayout.jsx";
import axios from "../../utils/axios.js";
import UserTable from "../component/UserTable.jsx";
import Header from "../../components/Header.jsx";

const UserListPage = () => {

  const navi = useNavigate();

  const [list, setList] = useState([]);
  const token = localStorage.getItem('accessToken')
  const decodeToken = jwtDecode(token)
  const role = decodeToken.roleName;
  const isAdmin = useCheckAdmin(role);

  useEffect(() => {
    if (!isAdmin) {
      navi('/')
    }
    axios.get('/api/admin/user')
      .then((res) => {
        console.log('user list', res.data)
        setList(res.data)
      })
      .catch((err) => {
        console.log('get user list err', err)
      })
  }, [isAdmin]);

  return (
    <div id='UserListPage' className='flex flex-col justify-center'>
      <Header/>
      <div  className='flex justify-center'>
        <div className='w-11/12 flex justify-center'>
          <UserTable list={list}/>
        </div>
      </div>
      <div className='fixed top-8 left-10 z-40'>
        <button className='nes-btn is-primary'>
          menu
        </button>
      </div>
      <div className='flex-col flex '>

        <label>
          <input type="radio" className="nes-radio" name="menu"/>
          <span>DashBoard</span>
        </label>
        <label>
          <input type="radio" className="nes-radio" name="menu" checked/>
          <span>UserList</span>
        </label>
        <label>
          <input type="radio" className="nes-radio" name="menu"/>
          <span>BanList</span>
        </label>
      </div>
    </div>
  )
}

export default UserListPage