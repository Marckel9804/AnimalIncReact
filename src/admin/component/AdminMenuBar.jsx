const AdminMenuBar = (props) => {

  const {menu, setMenu} = props

  const handleOptionChange = (event) => {
    setMenu(event.target.value);
  };
  return (
    <div className='flex-col flex items-start'>
      <div>
        <label>
          <input
            type="radio"
            className='nes-radio'
            value="DASHBOARD"
            checked={menu === 'DASHBOARD'}
            onChange={handleOptionChange}
          />
          <span>
            DashBoard
            </span>
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            className='nes-radio'
            value="USERLIST"
            checked={menu === 'USERLIST'}
            onChange={handleOptionChange}
          />
          <span>
              UserList
            </span>
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            className='nes-radio'
            value="BANLIST"
            checked={menu === 'BANLIST'}
            onChange={handleOptionChange}
          />
          <span>

            BanList
            </span>
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            className='nes-radio'
            value="REPORTS"
            checked={menu === 'REPORTS'}
            onChange={handleOptionChange}
          />
          <span>Reports</span>
        </label>
      </div>

    </div>
  )
}

export default AdminMenuBar