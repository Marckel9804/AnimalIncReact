import React, {useEffect, useState} from 'react';
import axios from "../utils/axios.js";
import axios2 from 'axios'

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onUpload = () => {
    const file = document.getElementById('fimg').files[0]
    try {
      const formData = new FormData();
      formData.append('file',file)
      formData.append('folderName','images')
      console.log('img upload')
      axios.post('/api/upload/img',formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        console.log('data', res)
      })

    } catch (err) {
      console.error('err',err)
    }
  }

  return (
    <div>
      <input id='fimg' type="file" onChange={handleFileChange} />
      <button onClick={onUpload}>Upload</button>

      <img src='http://kr.object.ncloudstorage.com/aniinc/file'/>
    </div>
  );
};

export default ImageUpload;