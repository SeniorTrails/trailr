import React from 'react';
import TrailPlantIdInfoListItem from './TrailPlantIdInfoListItem.jsx';

const TrailPlantIdInfoList = ({ plantInfoArray }) => (
  <div>
    <h6>Here are some pics of plants that were indentified on this trail!</h6>
    {plantInfoArray.map((plantInfo) => (
      <div key={plantInfo.id}>
        <TrailPlantIdInfoListItem
          commonName={plantInfo.plant_common_name}
          plantPhoto={plantInfo.plantId_photo}
          scienceName={plantInfo.plant_scientific_name}
          wikiUrl={plantInfo.plant_wiki_url}
        />
      </div>
    ))}
  </div>
);

export default TrailPlantIdInfoList;
