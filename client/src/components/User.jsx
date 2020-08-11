import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useParams } from 'react-router-dom';
import Carousel from './Carousel.jsx';
import AddComment from './AddComment.jsx';

const photos = [
  {
    id: 1,
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Natchez_Trace_Trail.jpg/1280px-Natchez_Trace_Trail.jpg",
    lat: 30.35121,
    lng: -90.026479,
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
    lat: 30.350458,
    lng: -90.026045,
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
    lat: 30.352326,
    lng: -90.027110,
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
    lat: 30.353260,
    lng: -90.027236,
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
    lat: 30.348433,
    lng: -90.026569,
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

const user = () => {
  const { id } = useParams();
  const [photoInfo, setPhotoInfo] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  useEffect(() => {
    setPhotoInfo(photos);
  }, []);

  const appendComments = (newComment) => {
    const updatedInfo = [...photoInfo];
    const updatedPhoto = { ...updatedInfo[currentPhoto] };
    updatedPhoto.comments.push({ ...newComment });
    updatedInfo[currentPhoto] = updatedPhoto;
    setPhotoInfo(updatedInfo);
  };

  const changeCurrentPhoto = (photoId) => {
    setCurrentPhoto(photoId);
  };

  return (
    <>
      <Col xs={6}>
        {!photoInfo.length
          ? null
          : (
            <>
              <Carousel
                photos={photoInfo}
                currentPhoto={currentPhoto}
                changeCurrentPhoto={changeCurrentPhoto}
              />
              <AddComment appendComments={appendComments} />
            </>
          )}
      </Col>
      <Col xs={6}>
        SAVED TRAILS
      </Col>
    </>
  );
};

export default user;
