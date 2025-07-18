import { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { AxiosError } from 'axios';
import type { Weather, Supermarket, Museum, Restaurant, Option, ratingOption } from './types';

function App() {
  const [city, setCity] = useState('')
  const [activity, setActivity] = useState<Option | null>(null);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [museums, setMuseums] = useState<Museum[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [weather, setWeather] = useState<Weather>({
    description: '', 
    temperature: 0,
    icon: ''
  })
  const [rating, setRating] = useState(null);
  const [newRating, setNewRating] = useState<ratingOption | null>(null);

  const options: Array<Option> = [
    { value: 'museums', label: 'museums'},
    { value: 'restaurants', label: 'restaurants'},
    { value: 'supermarkets', label: 'supermarkets'},
  ]

    const ratingvalues: Array<ratingOption> = [
    { value: '1', label: '1'},
    { value: '2', label: '2'},
    { value: '3', label: '3'},
    { value: '4', label: '4'},
    { value: '5', label: '5'},
    { value: '6', label: '6'},
    { value: '7', label: '7'},
    { value: '8', label: '8'},
    { value: '9', label: '9'},
    { value: '10', label: '10'},
  ]

  const chooseCity = (e: React.ChangeEvent) => {
    const inputTarget = e.target as HTMLInputElement
    setCity(inputTarget.value)
    setMuseums([])
    setRestaurants([])
    setSupermarkets([])
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const response = await axios.get(`http://localhost:3003/?city=${city}`)
    setWeather(response.data.weather)
    setRating(response.data.rating)
  }

  const handleActivity = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(activity)
    if (activity) {
    const response = await axios.get(`http://localhost:3003/?city=${city}&activities=${activity.value}`)
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
  }

  const handleRating = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
    if (newRating) {
    const data = {
      "city": city,
      "rating": Number(newRating.value)
    }
    await axios.post('http://localhost:3003/', data)
    const response = await axios.get(`http://localhost:3003/?city=${city}`)
    setRating(response.data.rating)
    }
    } catch (exception) {
      if (exception instanceof AxiosError) {
        console.log(exception.response?.data.error)
      } else {
        console.log(exception)
      }
    }
  }

  const showWeather = () => {
    return (
      <div>
        <h2>{city}</h2>
        <p>Weather: {weather.description}</p>
        <p>Temperature: {(weather.temperature - 273.15).toFixed(1)} &deg;C</p>
        <img src = {`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}></img>
        {rating ? <p>City rating: {rating} </p> : <p>City rating: N/A</p>}
        <Select<ratingOption>
          value={newRating}
          onChange={(ratingvalue) => setNewRating(ratingvalue)}
          options={ratingvalues}
        />
        <button onClick={handleRating}>Rate</button>
      </div>
    )
  }

    const showWActivities = () => {
    return (
      <div>
        <h2>Find nearby</h2>
        <Select<Option>
          value={activity}
          onChange={(option) => setActivity(option)}
          options={options}
        />
        <button onClick={handleActivity}>Find</button>
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
          {r.website ? <p>website: <a href={r.website}>{r.website} </a> </p>  : null}
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
