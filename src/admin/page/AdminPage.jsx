import {jwtDecode} from "jwt-decode";
import AdminLayout from "../layout/AdminLayout.jsx";
import {useEffect, useState} from "react";
import useCheckAdmin from "../component/CheckAdmin.jsx";
import {useNavigate} from "react-router-dom";
import axios from "../../utils/axios.js";

const AdminPage = () => {

  const navi = useNavigate();

  const token = localStorage.getItem('accessToken')
  const decodeToken = jwtDecode(token)
  const role = decodeToken.roleName;
  const isAdmin = useCheckAdmin(role);

  useEffect(() => {
    if (!isAdmin) {
      navi('/')
    }
  }, [isAdmin]);


  return (
    <div id='UserListPage' className='flex flex-col justify-center'>
      <AdminLayout />
    </div>
  )
}

export default AdminPage