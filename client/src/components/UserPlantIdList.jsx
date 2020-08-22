/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import UserPlantIdListItem from './UserPlantIdListItem.jsx';

const UserPlantIdList = ({ plantInfoArray, userName }) => (
  <div>
    <br />
    <h2>{userName}'s Identified Plants!</h2>
    {plantInfoArray.map((plantInfo) => (
      <div key={plantInfo.id}>
        <br />
        <UserPlantIdListItem
          commonName={plantInfo.plant_common_name}
          plantPhoto={plantInfo.plantId_photo}
          scienceName={plantInfo.plant_scientific_name}
          wikiUrl={plantInfo.plant_wiki_url}
          trailId={plantInfo.id_trail}
        />
        <br />
        <br />
      </div>
    ))}
  </div>
);

UserPlantIdList.propTypes = {
  plantInfoArray: PropTypes.arrayOf,
  userName: PropTypes.string,
};

export default UserPlantIdList;
