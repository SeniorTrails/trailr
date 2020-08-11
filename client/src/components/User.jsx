import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import Carousel from './Carousel.jsx';
import AddComment from './AddComment.jsx';

const savedTrails = [
  {
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
    myRatings: {
      diff: 3,
      like: 3,
    },
  },
  {
    id: 287665,
    name: 'The Tammany Trace',
    url: 'https://www.singletracks.com/bike-trails/the-tammany-trace/',
    description: 'This 31-mile asphalted trail and parallel equestrian trail connects five communities--Covington, Abita Springs, Mandeville, Lacombe, and Slidell.\r\nThe Trace also serves as a wildlife conservation corridor, linking isolated parks, creating greenways, and preserving historic landmarks and wetlands. You can observe the natural habitat, bayous, streams and rivers from the vantage point of 31 bridges built on the original railroad trestles.\r\nThis is a truly beautiful trail.\r\n\r\n\r\n',
    city: 'Mandeville',
    region: 'Louisiana',
    country: 'United States',
    lat: 30.30120,
    lon: -89.82637,
    difficulty: 5,
    likeability: 2,
    thumbnail: 'https://images.singletracks.com/blog/wp-content/uploads/2018/08/IMG_2498-orig-scaled.jpg',
    myRatings: {
      diff: 3,
      like: 3,
    },
  },
  {
    id: 284061,
    name: 'Fontainebleau State Park',
    url: 'https://www.singletracks.com/bike-trails/fontainebleau-state-park/',
    description: "It's a hiking trail, but I saw bike trail marks on it. And it's compact enough of a surface to do. Not bad for something different. Very easy. Bring insect repellant.",
    city: 'Mandeville',
    region: 'Louisiana',
    country: 'United States',
    lat: 30.33735,
    lon: -90.03733,
    difficulty: 3,
    likeablity: 5,
    thumbnail: 'https://images.singletracks.com/blog/wp-content/uploads/2018/08/IMG_2642-orig-scaled.jpg',
    myRatings: {
      diff: 3,
      like: 3,
    },
  },
];

const photos = [
  {
    id: 1,
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Natchez_Trace_Trail.jpg/1280px-Natchez_Trace_Trail.jpg',
    lat: 30.35121,
    lng: -90.026479,
    comments: [
      {
        id: 1,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Daniel Troyano',
      },
      {
        id: 2,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Daniel Troyano',
      },
      {
        id: 3,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Daniel Troyano',
      },
    ],
  },
  {
    id: 2,
    url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/North_Country_Trail_Manistee_Forest.jpg',
    lat: 30.350458,
    lng: -90.026045,
    comments: [
      {
        id: 4,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Caylie Sadin',
      },
      {
        id: 5,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Daniel Troyano',
      },
    ],
  },
  {
    id: 5,
    url: 'https://vbwsjdqd1l-flywheel.netdna-ssl.com/wp-content/uploads/2014/04/Santos-Trails-1.jpg',
    lat: 30.352326,
    lng: -90.027110,
    comments: [
      {
        id: 4,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Caylie Sadin',
      },
      {
        id: 5,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Daniel Troyano',
      },
    ],
  },
  {
    id: 3,
    url: 'https://www.pittsburghmagazine.com/content/uploads/2020/03/cb-cook-forest-trail1.jpg',
    lat: 30.353260,
    lng: -90.027236,
    comments: [
      {
        id: 4,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Caylie Sadin',
      },
      {
        id: 5,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Daniel Troyano',
      },
    ],
  },
  {
    id: 4,
    url: 'https://www.cliftonpark.com/images/100acretrail.jpg',
    lat: 30.348433,
    lng: -90.026569,
    comments: [
      {
        id: 4,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Caylie Sadin',
      },
      {
        id: 5,
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus laborum voluptatem nihil ipsam placeat itaque magnam.',
        username: 'Daniel Troyano',
      },
    ],
  },
];

const user = () => {
  const { id } = useParams();
  const [photoInfo, setPhotoInfo] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [myTrails, setMyTrails] = useState([]);

  useEffect(() => {
    setPhotoInfo(photos);
    setMyTrails(savedTrails);
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
        <h2>Saved Trails</h2>
        {!myTrails.length
          ? null
          : (
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  <Row>
                    <Col xs={9}>
                      {myTrails[0].name}
                    </Col>
                    <Col xs={3}>
                      <Link to={`/trail/${myTrails[0].id}`}>See Trail</Link>
                    </Col>
                  </Row>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Row>
                      <Col xs={4}>
                        <Image thumbnail src={myTrails[0].thumbnail} />
                      </Col>
                      <Col xs={8}>
                        {myTrails[0].description}
                      </Col>
                    </Row>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          )}
      </Col>
    </>
  );
};

export default user;
