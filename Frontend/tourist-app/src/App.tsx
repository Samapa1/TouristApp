import { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import type { Weather, Supermarket, Museum, Restaurant, Option, ratingOption } from './types';
import ShowCityData from './components/ShowCityData';

function App() {
  const [city, setCity] = useState('')
  const [cityToShow, setCityToShow] = useState('')
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
  console.log(newRating)
  const baseUrl = 'http://localhost:3003/' 

  const options: Array<Option> = [
    { value: 'museums', label: 'museums'},
    { value: 'restaurants', label: 'restaurants'},
    { value: 'supermarkets', label: 'supermarkets'},
  ]

  const chooseCity = (e: React.ChangeEvent) => {
    const inputTarget = e.target as HTMLInputElement
    setCity(inputTarget.value)
    setMuseums([])
    setRestaurants([])
    setSupermarkets([])
    setNewRating(null)
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const weatherResponse = await axios.get(baseUrl + `weather/?city=${city}`)
    setWeather(weatherResponse.data.weather)
    const ratingResponse = await axios.get(`http://localhost:3003/rating/?city=${city}`)
    setRating(ratingResponse.data.rating)
    setCityToShow(city)
  }

  const handleActivity = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (activity) {
      console.log(activity)
      const response = await axios.get(`http://localhost:3003/activities/?city=${city}&activity=${activity.value}`)
      console.log(response.data)
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
      {weather.description ? <ShowCityData 
        city={city}
        cityToShow={cityToShow}
        weather={weather}
        rating={rating}
        setRating={setRating}
      /> 
      : null}
      {weather.description ? showWActivities() : null}
    </>
  )
}

export default App
