import {useEffect} from "react";

const ReportTable = (props) => {

  const menu = props.menu

  useEffect(() => {

  }, [menu]);
  return(
    <div id='ReportTable' className='ml-56 my-2'>
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
        {/*{list.map((user, index) => (*/}
        {/*  <tr key={index} className='hover:bg-emerald-200 nes-pointer'>*/}
        {/*    <td className='text-center w-16'>{user.userNum}</td>*/}
        {/*    <td className='text-center w-16'>{user.memRoleList}</td>*/}
        {/*    <td className='text-center w-32'>{user.userRealname}</td>*/}
        {/*    <td className='text-center min-w-36'>{user.userEmail}</td>*/}
        {/*    <td className='text-center w-28'>{user.userGrade}</td>*/}
        {/*    <td className='text-center w-20'>{user.userPoint}</td>*/}
        {/*    <td className='text-center w-32'>{user.userRuby}</td>*/}
        {/*    <td className='text-center w-20'>{user.userReportnum}</td>*/}
        {/*  </tr>*/}
        {/*))}*/}
        </tbody>
      </table>
    </div>
  )
}

export default ReportTable