import axios from "../utils/axios.js";

const CommunityAPI = () => {
  const getTest = async () => {
    await axios.get('/api/board/test')
      .then((res) => {return res})
      .catch((err)=> {console.log('get test err', err)})
  }

  const getList = async (page) => {
    await axios.get(`/api/board`,{page:page})
      .then((res) => {
        console.log('page data',res)
      })
      .catch((err)=>{
        console.log('get list err',err)
      })
  }

  return { getTest , getList};
}


export default CommunityAPI;