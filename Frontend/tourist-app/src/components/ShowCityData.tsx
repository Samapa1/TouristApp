import axios from 'axios';
import { AxiosError } from 'axios';
import Select from 'react-select';
import { useState } from 'react';
import type { Weather, ratingOption } from "../types"

interface Props {
  cityToShow : string
  city: string,
  weather: Weather
  rating: number | null
  setRating: React.Dispatch<React.SetStateAction<ratingOption>> | React.Dispatch<React.SetStateAction<null>>
  newRating: ratingOption 
  setNewRating: React.Dispatch<React.SetStateAction<ratingOption>> 
}

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

const ShowCityData = ( {city, cityToShow, weather, rating, setRating, newRating, setNewRating }: Props) => {
  const [notification, setNotification] = useState('')
 
    const handleRating = async (event: React.SyntheticEvent) => {
      event.preventDefault();

      try {
        if (newRating) {
          const data = {
            "city": city,
            "rating": Number(newRating.value)
          }
          await axios.post('http://localhost:3003/rating', data)
          const response = await axios.get(`http://localhost:3003/rating/?city=${city}`)
          setRating(response.data.rating)
        }
      } catch (exception) {
        if (exception instanceof AxiosError) {
          console.log(exception.response?.data.error)
          setNotification(exception.response?.data.error)
          setTimeout(() => setNotification(''), 5000)
        } else {
          console.log(exception)
        }
      }
  }

    return (
      <div>
        {notification}
        <h2>{cityToShow}</h2>
        <p>Weather: {weather.description}</p>
        <p>Temperature: {(weather.temperature - 273.15).toFixed(1)} &deg;C</p>
        <img src = {`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}></img>
        {rating ? <p>City rating: {rating} </p> : <p>City rating: N/A</p>}
        <Select<ratingOption>
          value={newRating}
          onChange={(ratingvalue) => setNewRating(ratingvalue ? ratingvalue : {value: '', label: ''})}
          options={ratingvalues}
        />
        <button onClick={handleRating}>Rate</button>
      </div>
    )
}

export default ShowCityData