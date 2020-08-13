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
          src={mountainHeaderImage}
          style={{ height: '110px' }}
          alt="Mountain trail"
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
