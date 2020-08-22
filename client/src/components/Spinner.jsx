import React from 'react';
import spinnerImage from '../images/spinner.gif';

const Spinner = () => (
  <div>
    <br />
    <img
      src={spinnerImage}
      style={{ width: '50px', height: '50px', margin: 'auto' }}
      alt="Loading..."
    />
  </div>
);

export default Spinner;
