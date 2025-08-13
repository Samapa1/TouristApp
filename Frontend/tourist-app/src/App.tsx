import { useState } from 'react';
import axios from 'axios';
import type { Weather, ratingOption, Activity} from './types';
import ShowCityData from './components/ShowCityData';
import ShowWActivities from './components/ShowActivities';

function App() {
  const [city, setCity] = useState('')
  const [cityToShow, setCityToShow] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [weather, setWeather] = useState<Weather>({
    description: '', 
    temperature: 0,
    icon: ''
  })
  const [rating, setRating] = useState(null);
  const [newRating, setNewRating] = useState<ratingOption>({value: '', label: ''});
  const baseUrl = 'http://localhost:3003/' 

  const chooseCity = (e: React.ChangeEvent) => {
    const inputTarget = e.target as HTMLInputElement
    setCity(inputTarget.value)
    setActivities([])
    setNewRating({value: '', label: ''})
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const weatherResponse = await axios.get(baseUrl + `weather/?city=${city}`)
    setWeather(weatherResponse.data.weather)
    const ratingResponse = await axios.get(baseUrl + `rating/?city=${city}`)
    setRating(ratingResponse.data.rating)
    setCityToShow(city)
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
        newRating={newRating}
        setNewRating={setNewRating}
      /> 
      : null}
      {weather.description ? <ShowWActivities 
        city={city}
        activities={activities}
        setActivities={setActivities}
      /> 
      : null}
    </>
  )
}

export default App
