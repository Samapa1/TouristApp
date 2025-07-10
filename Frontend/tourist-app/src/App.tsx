import { useState } from 'react'
import axios from 'axios';
import type { Weather, Supermarket, Museum, Restaurant } from './types';

function App() {
  const [city, setCity] = useState('')
  const [activity, setActivity] = useState('')
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [museums, setMuseums] = useState<Museum[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [weather, setWeather] = useState<Weather>({
    description: '', 
    temperature: 0,
    icon: ''
  })

  const chooseCity = (e: React.ChangeEvent) => {
    const inputTarget = e.target as HTMLInputElement
    setCity(inputTarget.value)
  }

  const chooseActivity = (e: React.ChangeEvent) => {
    const inputTarget = e.target as HTMLInputElement
    setActivity(inputTarget.value)
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const response = await axios.get(`http://localhost:3003/?city=${city}`)
    setWeather(response.data)
  }

  const handleActivity = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const response = await axios.get(`http://localhost:3003/?city=${city}&activities=${activity}`)
    console.log(response)
    if (response.data.supermarkets) {
      setSupermarkets(response.data.supermarkets)
      setMuseums([])
      setRestaurants([])
    }
    else if (response.data.museums) {
      setMuseums(response.data.museums)
      setSupermarkets([])
      setRestaurants([])
    }
    else if (response.data.restaurants) {
      setRestaurants(response.data.restaurants)
      setSupermarkets([])
      setMuseums([])
    }
  }


  const showWeather = () => {
    return (
      <div>
        <h2>{city}</h2>
        <p>Weather: {weather.description}</p>
        <p>Temperature: {(weather.temperature - 273.15).toFixed(1)} &deg;C</p>
        <img src = {`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}></img>
      </div>
    )
  }

    const showWActivities = () => {
    return (
      <div>
        <h2>Find nearby</h2>
        <form onSubmit={handleActivity}>
        <input value={activity} onChange={chooseActivity}/>
        <button type="submit">find</button>
      </form>
      {supermarkets ? supermarkets.map(s => { return(
        <div key= {s.id}>
          <h4>{s.name} {s.suburb}</h4>
          <p>address: {s.address} </p>
          {s.openingHours ? <p>opening hours: {s.openingHours} </p> : null}
        </div>
        )}) : null }
      {museums ? museums.map(m => { return(
        <div key= {`${m.id}$`}>
          <h4>{m.name}</h4>
          <p>address: {m.address} </p>
          {m.openingHours ? <p>opening hours: {m.openingHours} </p> : null}
        </div>
        )}) : null }
      {restaurants ? restaurants.map(r => { return(
        <div key= {`${r.id}$`}>
          <h4>{r.name}</h4>
          <p>address: {r.address} </p>
          {r.cuisine ? <p>cuisine: {r.cuisine} </p> : null}
          {r.website ? <p>website: {r.website} </p> : null}
        </div>
        )}) : null }
      </div>
    )
  }

  return (
    <>
      <h1>Welcome to the tourist app</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Choose city:</label>
        <input value={city} onChange={chooseCity} id="name"/>
        <button type="submit">find</button>
      </form>
      <br/>
      {weather.description ? showWeather() : null}
      {weather.description ? showWActivities() : null}
    </>
  )
}

export default App
