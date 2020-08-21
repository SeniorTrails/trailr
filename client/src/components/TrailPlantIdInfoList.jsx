import React from 'react';
import TrailPlantIdInfoListItem from './TrailPlantIdInfoListItem.jsx';

const TrailPlantIdInfoList = ({ plantInfoArray }) => (
  <div>
    <br />
    {/* <h6>Here are some pictures of plants that were indentified on this trail!</h6> */}
    {plantInfoArray.map((plantInfo, index) => (
      <div key={plantInfo.id}>
        <br />
        {index === 0 && <h6>Here are some pictures of plants that were indentified on this trail!</h6>}
        <TrailPlantIdInfoListItem
          commonName={plantInfo.plant_common_name}
          plantPhoto={plantInfo.plantId_photo}
          scienceName={plantInfo.plant_scientific_name}
          wikiUrl={plantInfo.plant_wiki_url}
        />
        <br />
        <br />
      </div>
    ))}
  </div>
);

export default TrailPlantIdInfoList;
