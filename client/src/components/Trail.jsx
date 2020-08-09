import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Map from './TrailMap.jsx';
import Carousel from './Carousel.jsx';

const data = {
  id: 279988,
  name: 'Eagle Trail',
  url: 'https://www.singletracks.com/bike-trails/eagle-trail-8663/',
  description: 'Nice easy trail.  Smaller in width than South or North Loop. South side of trail borders the Beaver Pond.',
  city: 'Mandeville',
  region: 'Louisiana',
  country: 'United States',
  lat: 30.35324,
  lon: -90.02715,
  difficulty: 3,
  likeability: 4,
  thumbnail: 'https://images.singletracks.com/blog/wp-content/uploads/2014/06/et3-orig.jpg',
};

const photos = [
  {
    id: 1,
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Natchez_Trace_Trail.jpg/1280px-Natchez_Trace_Trail.jpg",
    comments: [
      {
        id: 1,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Daniel Troyano"
      },
      {
        id: 2,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Daniel Troyano"
      },
      {
        id: 3,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Daniel Troyano"
      },
    ],
  },
  {
    id: 2,
    url: "https://upload.wikimedia.org/wikipedia/commons/c/ce/North_Country_Trail_Manistee_Forest.jpg",
    comments: [
      {
        id: 4,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Caylie Sadin"
      },
      {
        id: 5,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Daniel Troyano"
      },
    ],
  },
  {
    id: 5,
    url: "https://vbwsjdqd1l-flywheel.netdna-ssl.com/wp-content/uploads/2014/04/Santos-Trails-1.jpg",
    comments: [
      {
        id: 4,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Caylie Sadin"
      },
      {
        id: 5,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Daniel Troyano"
      },
    ],
  },
  {
    id: 3,
    url: "https://www.pittsburghmagazine.com/content/uploads/2020/03/cb-cook-forest-trail1.jpg",
    comments: [
      {
        id: 4,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Caylie Sadin"
      },
      {
        id: 5,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Daniel Troyano"
      },
    ],
  },
  {
    id: 4,
    url: "https://www.cliftonpark.com/images/100acretrail.jpg",
    comments: [
      {
        id: 4,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Caylie Sadin"
      },
      {
        id: 5,
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.",
        username: "Daniel Troyano"
      },
    ],
  },
];

const trail = () => {
  const { id } = useParams();
  const [trailInfo, setTrailInfo] = useState({});
  const [photoInfo, setPhotoInfo] = useState([]);

  useEffect(() => {
    setTrailInfo(data);
    setPhotoInfo(photos);
  }, []);
  return (
    <>
      <div className="col-6">
        <h2>{trailInfo.name}</h2>
        <div style={{ width: '100%', height: '300px' }}>
          {/*MAKE A NEW MAP COMPONENT*/}
          <Map
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.GOOGLE_MAPS_API_KEY}`}
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ height: '100%' }} />}
            loadingElement={<div style={{ height: '100%' }} />}
            location={{ lat: trailInfo.lat, lng: trailInfo.lon }}
            id={trailInfo.id}
          />
        </div>
        <div>
          <p>{trailInfo.description}</p>
          <img className="img-thumbnail w-50" src={trailInfo.thumbnail} />
          <h3>Difficulty -
            <small className="text-muted"> {trailInfo.difficulty}</small>
          </h3>
          <h3>Likeability -
            <small className="text-muted"> {trailInfo.likeability}</small>
          </h3>
        </div>
      </div>
      <div className="col-6">
        {!photoInfo.length
          ? null
          : <Carousel photos={photoInfo} />}
      </div>
    </>
  );
};

export default trail;
