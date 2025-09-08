import express from 'express'
import axios from 'axios'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import { ZodError } from 'zod'
import mongoose from 'mongoose'

import { formatWeatherData, formatRestaurantData, formatSupermarketData, formatMuseumData, formatParkData } from './utils.ts'
import { toRatingData, toCoordinateData } from './types.ts'
import { Rating } from './models/rating.ts'
import { checkIp } from './utils.ts'

const apiKeyWeather = process.env.API_key_weather
const APIKeyGeo = process.env.API_key_geo

const url = `${process.env.MONGODB_URI}`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error: unknown) => {
    let errorMessage = 'Connecting to MongoDB failed'
    if (error instanceof Error) {
      errorMessage += error.message
    }
    console.log(errorMessage)
  })

app.use(cors())

app.use(express.json())

app.get('/weather', async (req, res) => {
  try {
    const cityp = req.query.city
    if (!cityp) {
      res.status(400).send({ error: 'please enter the city' })
      return
    }
    const cityparam = JSON.stringify(cityp)
    const coordinates = await axios.get('http://api.openweathermap.org/geo/1.0/direct', { 
      params: { 
        q: cityparam, 
        appid: apiKeyWeather
      }
    })
   
    if (coordinates.data.length <1) {
      res.status(404).send({ error: 'city not found' })
      return
    }

    const validatedCoordinates = toCoordinateData(coordinates.data)

    const weather = await axios.get('https://api.openweathermap.org/data/2.5/weather', { 
      params: { 
        lat: validatedCoordinates[0].lat, 
        lon: validatedCoordinates[0].lon,
        appid: apiKeyWeather
      }
    })


    if (!weather.data) {
      res.status(404).send({ error: 'weather data not found' })
      return
    }
    const formattedWeather = formatWeatherData(weather.data)
    res.send({ weather: formattedWeather })
    return
  }

  catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).send({ error: error.issues })
      return
    }
    else {
      res.status(400).send({ error: 'unknown error' })
      return
    }
  }
})

app.get('/rating', async (req, res) => {
  try {
    const cityp = req.query.city
    let ratingSum = 0
    let ratingAverage = null
    const ratings = await Rating.find({ city: cityp })
    if (ratings.length > 0) {
      ratings.forEach(r => ratingSum += r.rating)
      ratingAverage = (ratingSum / ratings.length).toFixed(2)
    }

    res.send({ rating: ratingAverage ? ratingAverage : null })
  }

  catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).send({ error: error.issues })
    }
    else {
      console.log(error)
      res.status(400).send({ error: 'unknown error' })
    }
  }
})

app.get('/activities', async (req, res) => {
  try {
    const cityp = req.query.city
    const cityparam = JSON.stringify(cityp)
    const activity = req.query.activity
    const coordinates = await axios.get('http://api.openweathermap.org/geo/1.0/direct', { 
      params: { 
        q: cityparam, 
        appid: apiKeyWeather
      }
    })
    const validatedCoordinates = toCoordinateData(coordinates.data)

    const getActivityData = async ( category: string, formatFunction: typeof formatRestaurantData | typeof formatSupermarketData | typeof formatMuseumData | typeof formatParkData  ) => {
      const activityData = await axios.get('https://api.geoapify.com/v2/places', { 
        params: { 
          categories: category, 
          filter: `circle:${validatedCoordinates[0].lon},${validatedCoordinates[0].lat},5000`,
          bias: `proximity:${validatedCoordinates[0].lon},${validatedCoordinates[0].lat}`,
          limit: `20`,
          apiKey: `${APIKeyGeo}`
        }
      })
      const formattedData = formatFunction(activityData.data)
      res.send({ activities: formattedData })
    }

    if (activity === 'supermarkets') { 
      getActivityData('commercial.supermarket', formatSupermarketData )

    }

    else if (activity === 'museums') {
      getActivityData('entertainment.museum', formatMuseumData)
    }

    else if (activity === 'restaurants') {
      getActivityData('catering.restaurant', formatRestaurantData)
    }

    else if (activity === 'parks') {
      getActivityData('leisure.park', formatParkData)
    }

    else {
      res.status(404).send({ error: 'activity not found' })
    }
  }

  catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).send({ error: error.issues })
    }
    else {
      res.status(400).send({ error: 'unknown error' })
    }
  }
})

app.post('/rating', async (req, res) => {
  try {
    const body = req.body as unknown
    if (body === null || typeof body !== 'object' || !('city' in body) || typeof body.city !== 'string' || !('rating' in body) || typeof body.rating !== 'number') {
      res.status(400).end()
      return
    }

    const ipData = await checkIp({ ip: req.ip, city: body.city })
    if (ipData === true) {
      res.status(400).send({ error: 'You can rate a city only once a day.' })
    }
    else {
      const validatedRating = toRatingData({
        city: body.city,
        rating: body.rating,
        ipAddress: req.ip,
        date: new Date(),
      })
      const rating = new Rating(validatedRating)
      const result = await rating.save()
      res.send({
        city: result.city,
        rating: result.rating,
      })
    }
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
      if (error.name === 'ValidationError') {
        res.status(400).send({ error: error.message })
        return
      }
      else if (error instanceof ZodError) {
        res.status(400).send({ error: error.issues })
        return
      }
    }
    res.status(400).send({ error: 'something went wrong' })
    return
  }
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
