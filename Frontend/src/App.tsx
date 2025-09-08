import { useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Button, Form, Alert } from 'react-bootstrap'
import { AxiosError } from 'axios'

import type { Weather, ratingOption, Activity } from './types'
import ShowCityData from './components/ShowCityData'
import ShowWActivities from './components/ShowActivities'


function App() {
  const [city, setCity] = useState('')
  const [cityToShow, setCityToShow] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [weather, setWeather] = useState<Weather>({
    description: '',
    temperature: 0,
    icon: '',
  })
  const [rating, setRating] = useState(null)
  const [newRating, setNewRating] = useState<ratingOption>({ value: '', label: '' })
  const [notification, setNotification] = useState('')
  const baseUrl = import.meta.env.VITE_BASEURL

  const chooseCity = (e: React.ChangeEvent) => {
    const inputTarget = e.target as HTMLInputElement
    setCity(inputTarget.value)
    setActivities([])
    setNewRating({ value: '', label: '' })
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    try {
      const weatherResponse = await axios.get(baseUrl + `weather/?city=${city}`)
      setWeather(weatherResponse.data.weather)
      const ratingResponse = await axios.get(baseUrl + `rating/?city=${city}`)
      setRating(ratingResponse.data.rating)
      setCityToShow(city)
    }
    catch (exception) {
      if (exception instanceof AxiosError) {
        console.log(exception.response?.data.error)
        setNotification(exception.response?.data.error)
        setTimeout(() => setNotification(''), 5000)
      }
      else {
        console.log(exception)
      }
    }
  }

  return (
    <div className="m-3">
      <h1>Welcome to the Tourist App</h1>
      {(
        notification
        && (
          <Alert variant="danger">
            {notification}
          </Alert>
        )
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label className="mt-3">Enter a city:</Form.Label>
          <Form.Control type="text" value={city} onChange={chooseCity} />
        </Form.Group>
        <Button className="mt-1" type="submit">Find</Button>
      </Form>
      {weather.description
        ? (
            <ShowCityData
              city={city}
              cityToShow={cityToShow}
              weather={weather}
              rating={rating}
              setRating={setRating}
              newRating={newRating}
              setNewRating={setNewRating}
            />
          )
        : null}
      {weather.description
        ? (
            <ShowWActivities
              city={city}
              activities={activities}
              setActivities={setActivities}
            />
          )
        : null}
    </div>
  )
}

export default App
