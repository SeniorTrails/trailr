import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Input from './input.jsx';
import useForm from '../helpers';

const addPicture = ({ appendPhoto, center }) => {
  const [show, setShow] = useState(false);
  const toggleModal = () => setShow(!show);
  const submitPicture = (data) => {
    toggleModal();
    appendPhoto({ ...data, id: 92 });
    console.log(data);
  };
  const { values, changeHandler, submitHandler } = useForm(submitPicture);

  return (
    <>
      <Button variant="success" onClick={toggleModal}>Add Picture</Button>
      <Modal show={show} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input value={values.url} name="url" label="Url:" changeHandler={changeHandler} />
          <Image src={values.url} thumbnail />
          <div style={{ height: '300px', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
              defaultCenter={center}
              defaultZoom={15}
            >

            </GoogleMapReact>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={toggleModal}>Close</Button>
          <Button variant="success" onClick={submitHandler}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default addPicture;
