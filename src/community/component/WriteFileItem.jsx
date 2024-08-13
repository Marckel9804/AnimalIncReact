import {useEffect, useState} from 'react';

const WriteFileItem = (props) => {
  const { fileName, file, index, deleteFile } = props;
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div id='WriteFileItem' className='flex justify-center gap-3'>
      <div className='flex-col' style={{width:'300px'}}>
        <div className='flex gap-2 justify-between px-4 py-2'>
          <div className='w-44 self-center'
               style={{overflow:"hidden"}}
          >
            {fileName}
          </div>
          <button className='nes-btn is-error nes-pointer w-10'
                  onClick={() => deleteFile(index)}
          >X</button>
        </div>
        {thumbnail && (
          <img src={thumbnail} alt={fileName} style={{width: '300px', height: '300px'}}/>
        )}
      </div>

    </div>
  );
};

export default WriteFileItem;
