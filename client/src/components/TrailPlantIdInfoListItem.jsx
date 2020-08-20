import React from 'react';

const TrailPlantIdInfoListItem = ({ commonName, plantPhoto, scienceName, wikiUrl, }) => (
  <div>
    <img src={plantPhoto} alt="" width="200" height="200" />
    <div>Common Name: {commonName}</div>
    <div>Scientific Name: {scienceName}</div>
    <div>Wikipedia Link: <a href={wikiUrl} target="_blank" rel="noreferrer">{wikiUrl}</a></div>
    <br />
  </div>
);

export default TrailPlantIdInfoListItem;
