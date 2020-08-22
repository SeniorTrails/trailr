/* eslint-disable object-curly-newline */
/* eslint-disable react/require-default-props */
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserPlantIdListItem = ({ commonName, plantPhoto, scienceName, wikiUrl, trailId }) => (
  <div>
    <br />
    <img style={{ float: 'left', borderRadius: '12px' }} src={plantPhoto} alt="" width="200" height="200" />
    <br />
    <div style={{ float: 'left', paddingLeft: '30px', contentAlign: 'center' }}><b>Common Name: </b> {commonName}</div>
    <br />
    <div style={{ float: 'left', paddingLeft: '30px', contentAlign: 'center' }}><b>Scientific Name: </b> <i>{scienceName}</i></div>
    <br />
    <div style={{ float: 'left', paddingLeft: '30px', contentAlign: 'center' }}><a href={wikiUrl} target="_blank" rel="noreferrer">Wikipedia Link</a></div>
    <br />
    <Link to={`/trail/${trailId}`} style={{ float: 'left', paddingLeft: '30px', contentAlign: 'center' }}>See Trail Where This Was Taken</Link>
    <br />
    <br />
  </div>
);

UserPlantIdListItem.propTypes = {
  commonName: PropTypes.string,
  plantPhoto: PropTypes.string,
  scienceName: PropTypes.string,
  wikiUrl: PropTypes.string,
  trailId: PropTypes.number,
};

export default UserPlantIdListItem;
