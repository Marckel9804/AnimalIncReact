import {useState} from "react";
import Header from "../../components/Header.jsx";
import UserTable from "../component/UserTable.jsx";
import AdminMenuBar from "../component/AdminMenuBar.jsx";
import BanTable from "../component/BanTable.jsx";
import UserCountChart from "../component/UserCountChart.jsx";
import DashBoardChartLayout from "./DashBoardChartLayout.jsx";
import Footer from "../../components/Footer.jsx";
import AdminFooter from "../component/AdminFooter.jsx";
import ReportTable from "../component/ReportTable.jsx";

const AdminLayout = (props) => {
  const [menu, setMenu] = useState('DASHBOARD');

  return(
    <div>
      <Header/>

      <div className='absolute pt-5 pb-20'>
        <div className='mt-2 mb-24 w-11/12 flex justify-center min-h-44'>
          {menu==='DASHBOARD'?(<DashBoardChartLayout menu={menu}/>):('')}
          {menu==='USERLIST'?(<UserTable menu={menu}/>):(<div></div>)}
          {menu==='BANLIST'?(<BanTable menu={menu}/>):(<div></div>)}
          {menu==='REPORTS'?(<ReportTable menu={menu}/>):(<div></div>)}
        </div>
        <Footer/>
      </div>

      <div className='fixed left-4' style={{top:'130px'}}>
        <div className="nes-container with-title is-centered">
          <p className="title" style={{fontSize:'32px', lineHeight:'0.5'}}>Menu</p>
          <AdminMenuBar menu={menu} setMenu={setMenu}/>
        </div>
      </div>


    </div>
  )
}

export default AdminLayout