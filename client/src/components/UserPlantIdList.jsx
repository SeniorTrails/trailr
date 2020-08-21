import React from 'react';
import { Link } from 'react-router-dom';
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
          scienceName={plantInfo.plant_science_name}
          wikiUrl={plantInfo.plant_wiki_url}
        />
        <br />
        <br />
      </div>
    ))}
  </div>
);

export default UserPlantIdList;
