import React from 'react'

const WeatherTicker = ({time, tempDay, tempEve, description, icon}) => {
  console.log('Time', time)
  console.log('TempDay', tempDay)
  console.log('TempEve', tempEve)
  console.log('description', description)
  console.log('icon', icon)
return (
  <div>
    <div>{time}</div>
    <div>{tempDay}</div>
    <div>{tempEve}</div>
    <div>{description}</div>
    <div>{icon}</div>
  </div>
)
}

export default WeatherTicker;