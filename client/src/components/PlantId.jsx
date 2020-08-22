/* eslint-disable react/require-default-props */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import FileBase64 from 'react-file-base64';
import axios from 'axios';
import PropTypes from 'prop-types';
import Spinner from './Spinner.jsx';
// import * as PlantIdData from '../data/plant-id-data.json';

const PlantId = ({ trailId, userId }) => {
  const [plantFile, setPlantFile] = useState(null);
  const [plantScientificName, setScientificName] = useState('');
  const [plantCommonName, setCommonName] = useState('');
  const [plantWikiUrl, setWikiUrl] = useState('');
  const [plantPhoto, setPlantPhoto] = useState('');
  const [buttonWasClicked, setButtonWasClicked] = useState(false);
  const [plantIdButtonLoading, setPlantIdButtonLoading] = useState(false);

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

  useEffect(() => {
    postToServer(plantScientificName, plantCommonName, plantWikiUrl, plantPhoto);
  }, [plantPhoto]);

  const postPlantIdPic = () => {
    setPlantIdButtonLoading(true);
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
        console.log('Success:', responseData);
        const { url, scientific_name, common_names } = responseData.suggestions[0].plant_details;
        setScientificName(scientific_name);
        setCommonName(common_names[0]);
        setWikiUrl(url);
        setPlantPhoto(responseData.images[0].url);
        setButtonWasClicked(true);
        setPlantIdButtonLoading(false);
      })
      .catch((err) => console.log(err));
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
      <br />
      <br />
      <div>
        <button
          style={{
            backgroundColor: '#309D20',
            color: 'white',
            borderRadius: '5px',
            borderStyle: 'solid',
          }}
          onClick={postPlantIdPic}
        >
          ID your plant here!
        </button>
        {plantIdButtonLoading && <Spinner />}
        {buttonWasClicked && <p><b>Go to your profile to see the results!</b></p>}
      </div>
    </div>
  );
};

PlantId.propTypes = {
  trailId: PropTypes.number,
  userId: PropTypes.number,
};

export default PlantId;
