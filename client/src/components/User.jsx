import React, { useState, useEffect } from 'react';
import { Link, useParams, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
// import Badge from 'react-bootstrap/Badge';
import Image from 'react-bootstrap/Image';
import { getUserData, getAuth } from '../helpers';
import Carousel from './Carousel.jsx';
import AddComment from './AddComment.jsx';

/**
 * Displays the indiviual user page with their saved trails and all their photos
 * @param user loggedIn, id, name
 */
const userPage = ({ user }) => {
  const { id } = useParams();
  const [photoInfo, setPhotoInfo] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [myTrails, setMyTrails] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // Set all the initial data with DB calls based on id in useParams
  // You can only see your user page
  useEffect(() => {
    getAuth()
      .then((response) => {
        if (+id === response.id) {
          getUserData(id)
            .then((userData) => {
              if (Array.isArray(userData)) {
                setRedirect(true);
              } else {
                setPhotoInfo(userData.photos);
                setMyTrails(userData.favorites);
                setUserInfo({ name: userData.name, url: userData.profile_photo_url });
              }
            })
            .catch((err) => {
              console.error(err);
              setRedirect(true);
            });
        } else {
          setRedirect(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setRedirect(true);
      });
  }, []);

  const removePhoto = (photoId) => {
    setCurrentPhoto(0);
    const updatedPhotos = [...photoInfo];
    updatedPhotos.splice(photoId, 1);
    setPhotoInfo(updatedPhotos);
  };

  /**
   * After the DB call this adds the new comment to the photo for the user,
   *  so that we don't have to make additional DB calls
   * @param {Object} newComment comment to add to the photo
   */
  const appendComments = (newComment) => {
    const updatedInfo = [...photoInfo];
    const updatedPhoto = { ...updatedInfo[currentPhoto] };
    updatedPhoto.comments.push({ ...newComment });
    updatedInfo[currentPhoto] = updatedPhoto;
    setPhotoInfo(updatedInfo);
  };

  /**
   * Updates the photo being shown to the given Id
   * @param {Number} photoId new photoId
   */
  const changeCurrentPhoto = (photoId) => {
    setCurrentPhoto(photoId);
  };

  return (
    <>
      {redirect ? <Redirect to="/404" /> : null}
      <Col xs={6}>
        {!photoInfo.length
          ? null
          : (
            <>
              <Carousel
                photos={photoInfo}
                currentPhoto={currentPhoto}
                changeCurrentPhoto={changeCurrentPhoto}
                user={user}
                removePhoto={removePhoto}
              />
              {user.loggedIn
                ? (
                  <AddComment
                    appendComments={appendComments}
                    userId={user.id}
                    photoId={photoInfo[currentPhoto].id}
                    name={user.name}
                  />
                )
                : null}
            </>
          )}
      </Col>
      <Col xs={6}>
        <Image thumbnail src={userInfo.url} />
        <h2>{userInfo.name} Saved Trails</h2>
        {!myTrails.length
          ? null
          : myTrails.map((trail) => (
            <Accordion key={trail.id}>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  <Row>
                    <Col xs={9}>
                      {trail.name}
                    </Col>
                    <Col xs={3}>
                      <Link to={`/trail/${trail.id}`}>See Trail</Link>
                    </Col>
                  </Row>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <Row>
                      <Col xs={4}>
                        <Image thumbnail src={trail.thumbnail} />
                      </Col>
                      <Col xs={8}>
                        {trail.description}
                      </Col>
                    </Row>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          ))}
      </Col>
    </>
  );
};

export default userPage;

userPage.propTypes = {
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    name: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
};
