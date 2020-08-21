/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import Birds from '../../assets/imgs/RobinBird.gif';

const Bird = ({ bird }) => {
  const [birdImage, setBirdImage] = useState(null);

  const [birdSound, setBirdSound] = useState(null);

  const getSounds = (birdy) => {
    axios.get('/api/birds/sounds', {
      params: {
        birdName: birdy.comName,
      },
    })
      .then((res) => {
        setBirdSound(`https://${res.data.slice(2)}`);
      });
  };

  const getBirdImage = (birduh) => {
    axios.get('/api/birds/image', {
      params: {
        birdName: birduh.comName,
      },
    })
      .then((res) => {
        setBirdImage(res.data);
      });
  };

  useEffect(() => {
    getSounds(bird);
    getBirdImage(bird);
  }, []);

  return (
    <div style={{
      backgroundColor: 'solid green',
      textAlign: 'center',
      paddingBottom: '30px',
      paddingLeft: 'auto',
      paddingRight: 'auto',
      fontWeight: 'bold',
      float: 'left',
      marginLeft: '55px',
      alignContent: 'center',
    }}
    >
      <div>
        {birdImage ? <img src={birdImage} alt={bird.comName} style={{ height: '100', weight: '150', borderRadius: '12px' }} /> : <img src={Birds} alt="Not Real" style={{ height: '150px', width: '250px', borderRadius: '12px' }} /> }
      </div>
      Common Name: {bird.comName}
      <br />
      Scientific Name: {bird.sciName}
      <br />
      {bird.comName} Sound
      <br />
      <br />
      <ReactAudioPlayer
        src={birdSound}
        controls
        volume={0.5}
      />
    </div>
  );
};

export default Bird;
