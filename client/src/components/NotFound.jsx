import React from 'react';
import { Image, Alert } from 'react-bootstrap';
import NotFoundImage from '../../assets/imgs/losthiking.gif';


const NotFound = () => (
  <div className="page-container">
    <div style={{ position: 'absolute', left: '50%' }}>
      <div
        style={{
          position: 'relative',
          left: '-50%',
        }}
      >
        <br />
        <Alert variant="success">
          <Alert.Heading>
            <center>Page Not Found</center>
          </Alert.Heading>
          <hr />
          <p>
            <center>You must have taken a wrong turn somewhere...</center>
          </p>
        </Alert>
        <Image src={NotFoundImage} fluid alt="Lost hikers" />
      </div>
    </div>
  </div>
);

export default NotFound;
