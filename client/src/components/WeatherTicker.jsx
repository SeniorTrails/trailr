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
  <Card style={{backgroundColor: '#0080FF80'}}>
    <Card.Body>
    <Card.Text>{
    hourConverter(time)
    }
    </Card.Text>
      <Card.Img variant="bottom" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
      <Card.Text>{temp}°F</Card.Text>
    </Card.Body>
  </Card>
  </CardGroup>
:
<CardGroup>
<Card style={{backgroundColor: '#0080FF80'}}>
  <Card.Body>
  <Card.Text>{
  dayConverter(time)
  }</Card.Text>
    <Card.Img variant="top" src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
    <Card.Text>
      <div syle={{color: 'red'}}>{day}°F</div> 
      <div style={{color: 'blue'}}>{eve}°F</div>
      </Card.Text>
  </Card.Body>
</Card>
</CardGroup>
} 



export default WeatherTicker;