import React from 'react'
import {CardGroup, Card} from 'react-bootstrap'

const hourConverter = (time) => {
  const newTime = new Date(time * 1000)
  return newTime.toLocaleString('en-US', {hour: "numeric"})
}
const dayConverter = (time) => {
  const newTime = new Date(time * 1000)
  return newTime.toLocaleString("en-US", {weekday: "long"})
}


const WeatherTicker = ({time, temp, description, icon, day, eve}) => 

{
  return temp ? 
  <CardGroup>
  <Card style={{backgroundColor: '#D6EAF8'}}>
    <Card.Body>
    <Card.Text style={{color: '#85929E'}}>{
    hourConverter(time)
    }
    </Card.Text>
      <Card.Img variant="bottom" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
      <Card.Text style={{textAlign: 'center', color: '#2471A3'}}>{temp}°F</Card.Text>
    </Card.Body>
  </Card>
  </CardGroup>
:
<CardGroup>
<Card style={{backgroundColor: '#D6EAF8'}}>
  <Card.Body>
  <Card.Text style={{color: '#85929E'}}>{
  dayConverter(time)
  }</Card.Text>
    <Card.Img variant="top" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
    <Card.Text style={{textAlign: 'center'}}>
      <div style={{color: '#CD6155'}}>{day}°F</div> 
      <div style={{color: '#2471A3'}}>{eve}°F</div>
      </Card.Text>
  </Card.Body>
</Card>
</CardGroup>
} 



export default WeatherTicker;