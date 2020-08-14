import React from 'react';
import Image from 'react-bootstrap/Image';
import mountainHeaderImage from '../../assets/imgs/mountainHeader.png';

const HeaderImage = () => (
  <div>
    <div style={{ position: 'absolute', left: '50%' }}>
      <div
        style={{
          position: 'relative',
          left: '-50%',
        }}
      >
        <Image
          className='pt-2'
          src={mountainHeaderImage}
          style={{ minWidth: '500px', height: '190px' }}
          alt="Mountain trail"
          fluid
        />
      </div>
    </div>
    <br />
    <br />
    <br />
    <br />
    <br />
  </div>
);

export default HeaderImage;
