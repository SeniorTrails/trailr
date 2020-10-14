import React, {useState, useEffect} from 'react';
import {CardDeck, Card} from 'react-bootstrap'


const WeatherBar = ({lat, lng}) => {
  
  

  return <div>
    <h1>Weather Widget Here</h1>
    <CardDeck>
  <Card>
    <Card.Body>
      <Card.Title>Card title</Card.Title>
      <Card.Img variant="top" src="holder.js/100px160" />
      <Card.Text>
        This is a wider card with supporting text below as a natural lead-in to
        additional content. This content is a little bit longer.
      </Card.Text>
    </Card.Body>
  </Card>
</CardDeck>
  </div>;
};
export default WeatherBar;
