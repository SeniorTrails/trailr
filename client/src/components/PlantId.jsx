/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import FileBase64 from 'react-file-base64';
import axios from 'axios';
import * as PlantIdData from '../data/plant-id-data.json';

const PlantId = ({ trailId, userId }) => {
  const [plantFile, setPlantFile] = useState(null);
  const [plantScientificName, setScientificName] = useState('');
  const [plantCommonName, setCommonName] = useState('');
  const [plantWikiUrl, setWikiUrl] = useState('');
  const [plantPhoto, setPlantPhoto] = useState('');

  useEffect(() => {
    postToServer(plantScientificName, plantCommonName, plantWikiUrl, plantPhoto);
  }), [plantPhoto];

  const handleInput = (files) => {
    setPlantFile(files);
  };

  const postToServer = (scienceName, commonName, wikiUrl, photo) => {
    if (plantPhoto.length) {
      axios({
        method: 'post',
        url: '/api/plantId',
        data: {
          id_user: userId,
          id_trail: trailId,
          plant_scientific_name: scienceName,
          plant_common_name: commonName,
          plant_wiki_url: wikiUrl,
          plantId_photo: photo,
        },
      })
        .then((response) => console.log('we did it', response))
        .catch((err) => console.log('nope', err));
    }
  };

  const postPlantIdPic = () => {
    const data = {
      api_key: process.env.PLANT_ID_API_KEY,
      images: [plantFile.base64.slice(23)],
      modifiers: ['crops_fast', 'similar_images'],
      plant_language: 'en',
      plant_details: ['common_names',
        'url',
        'name_authority',
        'wiki_description',
        'taxonomy',
        'synonyms'],
    };
    fetch('https://api.plant.id/v2/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log('Success:', JSON.stringify(responseData));
        // console.log('this is responsedata', responseData);
        const { url, scientific_name, common_names } = responseData.suggestions[0].plant_details;
        setScientificName(scientific_name);
        setCommonName(common_names[0]);
        setWikiUrl(url);
        setPlantPhoto(responseData.images[0].url);
      })
      .catch((err) => console.log('no dice', err));
    // .catch((error) => {
    //   console.error('Error:', error);
    // });
    // console.log(PlantIdData);
    // console.log(PlantIdData.default.suggestions[0].plant_details.url);
    // const { url, scientific_name, common_names } = PlantIdData.default.suggestions[0].plant_details;

    // setScientificName(scientific_name);
    // setCommonName(common_names[0]);
    // setWikiUrl(url);
    // setPlantPhoto(PlantIdData.default.images[0].url);
    // console.log('userId', userId);

    // const data = {
    //   id_user: userId,
    //   id_trail: trailId,
    //   plant_scientific_name: plantScientificName,
    //   plant_common_name: plantCommonName,
    //   plant_wiki_url: plantWikiUrl,
    //   plantId_photo: plantPhoto,
    // }
    // console.log('this is data', data)
    // axios({
    //   method: 'post',
    //   url: '/api/plantId',
    //   data: {
    //     id_user: userId,
    //     id_trail: trailId,
    //     plant_scientific_name: plantScientificName,
    //     plant_common_name: plantCommonName,
    //     plant_wiki_url: plantWikiUrl,
    //     plantId_photo: plantPhoto,
    //   }
    // })
    // .then((response) => console.log('this is response in client', response))
    // .catch((err) => console.log('no dice', err));
  };

  return (
    <div>
      <p>Along your hike did you take a picture of a plant and would like to identify it?
        Upload it here to receive some info and save it to your profile!
      </p>
      <FileBase64
        multiple={false}
        onDone={handleInput}
      />
      <div>
        {/* { plantFile && plantFile.base64.slice(23)} */}
        {/* <img src={PlantIdData.default.images[0].url} alt="" />
        <div>
          scientific name: {scientific_name}
        </div>
        <div>
          common name: {common_names[0]}
        </div>
        <div>
          wikipedia link: <a href={url} target="_blank" rel="noreferrer">{url}</a>
        </div> */}
        <button
          style={{ backgroundColor: '#309D20', color: 'white', borderRadius: '5px' }}
          onClick={postPlantIdPic}
        >
          ID your plant here!
        </button>
      </div>
    </div>
  );
};

export default PlantId;
