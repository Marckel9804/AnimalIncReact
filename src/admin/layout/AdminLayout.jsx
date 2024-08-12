import {useState} from "react";
import Header from "../../components/Header.jsx";
import UserTable from "../component/UserTable.jsx";
import AdminMenuBar from "../component/AdminMenuBar.jsx";

const AdminLayout = (props) => {

  const {list, setList}= props
  const [menu, setMenu] = useState('');



  return(
    <div>
      <Header/>

      <div className='flex justify-center'>
        <div className='mt-2 w-3/4 flex justify-center'>
          {menu==='USERLIST'?(<UserTable list={list}/>):(<div></div>)}
        </div>
      </div>

      <div className='fixed left-4' style={{top:'118px'}}>
        <div className="nes-container with-title is-centered">
          <p className="title" style={{fontSize:'32px', lineHeight:'0.5'}}>Menu</p>
          <AdminMenuBar menu={menu} setMenu={setMenu}/>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout