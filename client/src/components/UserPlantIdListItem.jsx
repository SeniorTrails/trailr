import React from 'react';

const UserPlantIdListItem = ({
  commonName, plantPhoto, scienceName, wikiUrl,
}) => (
  <div>
    <br />
    <img style={{ float: 'left', borderRadius: '12px' }} src={plantPhoto} alt="" width="200" height="200" />
    <br />
    <div style={{ float: 'left', paddingLeft: '30px', contentAlign: 'center' }}>Common Name: {commonName}</div>
    <br />
    <div style={{ float: 'left', paddingLeft: '30px', contentAlign: 'center' }}>Scientific Name: {scienceName}</div>
    <br />
    <div style={{ float: 'left', paddingLeft: '30px', contentAlign: 'center' }}><a href={wikiUrl} target="_blank" rel="noreferrer">Wikipedia Link</a></div>
    <br />
    <br />
  </div>
);

export default UserPlantIdListItem;
