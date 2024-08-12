import {jwtDecode} from "jwt-decode";
import AdminLayout from "../layout/AdminLayout.jsx";
import {useEffect, useState} from "react";
import useCheckAdmin from "../component/CheckAdmin.jsx";
import {useNavigate} from "react-router-dom";
import axios from "../../utils/axios.js";

const AdminPage = () => {

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
      <AdminLayout list={list} setList={setList}/>
    </div>
  )
}
//
// const AdminPage = () => {
//
//   const token = localStorage.getItem('accessToken')
//   const decodeToken = jwtDecode(token)
//   const role = decodeToken.roleName;
//   const navi = useNavigate();
//
//   const isAdmin = useCheckAdmin(role);
//   useEffect(() => {
//     if (!isAdmin) {
//       navi('/')
//     }
//   }, [isAdmin]);
//
//
//   return (
//     <div id='AdminPage'>
//       <button ></button>
//       <AdminLayout/>
//     </div>
//   )
// }

export default AdminPage