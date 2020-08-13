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
          <center>
            <p>You must have taken a wrong turn somewhere...</p>
          </center>
        </Alert>
        <Image src={NotFoundImage} fluid alt="Lost hikers" />
      </div>
    </div>
  </div>
);

export default NotFound;
