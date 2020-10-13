import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import heic2any from 'heic2any';
import exifr from 'exifr';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Marker from './Marker.jsx';
import { uploadPhoto } from '../helpers';

const GoogleMapWrapper = styled.div`
  height: 300px;
  width: 100%
`;

// The intention is to implement these at some point to keep people from overloading us

// const maxImages = 10;
// const maxImageSize = 5 * 1024 * 1024; // 5MBs

/**
 * File picker that pulls metadata off photos or lets users manually select a lat&lng
 *  for where they took the photo. You can upload multiple files and it adds them to
 *  the google cloud storage bucket and then calls appendPhoto to avoid another DB call.
 * @param {Function} appendPhoto function that adds photos to the trail
 * @param {Object} center contains a lat and lng to center the maps on if no gps data
 */
const addPicture = ({
  appendPhoto, center, userId, trailId,
}) => {
  const [show, setShow] = useState(false);
  const [images, setImages] = useState({});
  const toggleModal = () => setShow(!show);

  /**
   * Handles whenever a user adds files from their computer. It parses
   *  the gps data off the photo. Then uploads it to the browser, but if
   *  it is a heic file it has to first convert it. Finally it adds them
   *  to the images state.
   * @param {Event} e event that we persist and pull the files off
   */
  const changeHandler = (e) => {
    e.persist();
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i += 1) {
        console.log('i in add pic', i)
        // Parse the metadata off the image,
        // latitude and longitude
        exifr.parse(e.target.files[i])
          .then((metaData) => {
            console.log(metaData);
            const loc = {};
            if (!metaData) {
              loc.lat = center.lat;
              loc.lng = center.lng;
            } else {
              loc.lat = metaData.latitude || center.lat;
              loc.lng = metaData.longitude || center.lng;
            }
            const newImage = {
              key: e.target.files[i].name,
              url: URL.createObjectURL(e.target.files[i]),
              lat: loc.lat,
              lng: loc.lng,
              file: e.target.files[i],
            };
            // If the image is a heic convert it
            if (newImage.key.match(/.heic$|.HEIC$/)) {
              const blob = e.target.files[i];
              heic2any({ blob })
                .then((result) => {
                  newImage.url = URL.createObjectURL(result);
                  setImages((prev) => {
                    const updated = { ...prev};
                    updated[newImage.key] = newImage;
                    return updated;
                  });
                })
                .catch((err) => {
                  console.error(err);
                });
            } else {
              setImages((prev) => {
                const updated = { ...prev };
                updated[newImage.key] = newImage;
                return updated;
              });
            }
          });
      }
    }
  };

  /**
   * Updates the marker location of the photo
   * @param {Object} location contains new lat and lng
   * @param {String} key name of the photo to update
   */
  const addMarker = ({ lat, lng }, key) => {
    setImages((prev) => {
      const updated = { ...prev };
      updated[key].lat = lat;
      updated[key].lng = lng;
      return updated;
    });
  };

  const imagePromiseUploader = (file) => new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('latitude', file.lat);
    formData.append('longitude', file.lng);
    formData.append('userId', userId);
    formData.append('trailId', trailId);
    uploadPhoto(formData)
      .then((url) => {
        resolve(url);
      })
      .catch((err) => {
        reject(err);
      });
  });

  /**
   * Uploads the images to the database, and calls appendPhoto
   */
  const submitHandler = () => {
    toggleModal();
    const filesArray = Object.keys(images).map((key) => images[key]);
    Promise.all(filesArray.map((file) => imagePromiseUploader(file)))
      .then((response) => {
        const newImages = response.map((i) => i.img);
        appendPhoto(newImages);
        setImages({});
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Button variant="success" onClick={toggleModal}>Add Picture</Button>
      <Modal show={show} onHide={toggleModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input onChange={changeHandler} type="file" id="imageUpload" multiple />
          {Object.keys(images).map((key) => (
            <Row key={images[key].key}>
              <Col>
                <Image thumbnail src={images[key].url} />
              </Col>
              <Col>
                <GoogleMapWrapper>
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
                    defaultCenter={center}
                    defaultZoom={17}
                    onClick={(e) => addMarker(e, images[key].key)}
                  >
                    <Marker lat={images[key].lat} lng={images[key].lng} clickHandler={() => {}} />
                  </GoogleMapReact>
                </GoogleMapWrapper>
              </Col>
            </Row>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={toggleModal}>Close</Button>
          <Button variant="success" onClick={submitHandler}>Submit Images</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default addPicture;

addPicture.propTypes = {
  appendPhoto: PropTypes.func.isRequired,
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
  userId: PropTypes.number.isRequired,
  trailId: PropTypes.number.isRequired,
};
