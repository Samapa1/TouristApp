import express from 'express';
import axios from 'axios';
const app = express();
require("dotenv").config();
import cors from 'cors';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

import { formatWeatherData, formatRestaurantData, formatSupermarketData, formatMuseumData, formatParkData } from './utils.ts';
import { toRatingData } from './types.ts';
import { Rating } from './models/rating.ts';
import { checkIp } from './utils.ts';

const apiKeyWeather = process.env.API_key_weather
const APIKeyGeo = process.env.API_key_geo

const url = `${process.env.MONGODB_URI}`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then( () => {
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
    let cityp = req.query.city;
    const coordinates = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityp}&appid=${apiKeyWeather}`);
    if (!coordinates.data[0]) {
      res.status(404).send({error: 'city not found'})
    }
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.data[0].lat}&lon=${coordinates.data[0].lon}&appid=${apiKeyWeather}`);
    if (!weather.data) {
      res.status(404).send({error: 'weather data not found'})
    }
    const formattedWeather = formatWeatherData(weather.data)
    res.send({weather: formattedWeather})
  }

  catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).send({error: error.issues})
    } else {
      res.status(400).send({error: 'unknown error'})
    }
  }

})

app.get('/rating', async (req, res) => {

  try {
    let cityp = req.query.city;
    let ratingSum = 0
    let ratingAverage = null
    const ratings = await Rating.find({ city: cityp })
    if (ratings.length > 0) {
      ratings.forEach(r => ratingSum += r.rating)
      ratingAverage = (ratingSum / ratings.length).toFixed(2)
    }

    res.send({rating: ratingAverage ? ratingAverage :  null})
  }

  catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).send({error: error.issues})
    } else {
      res.status(400).send({error: 'unknown error'})
    }
  }

})

app.get('/activities', async (req, res) => {

  try {
    let cityp = req.query.city;
    let activity = req.query.activity;
    const coordinates = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityp}&appid=${apiKeyWeather}`);

    if (activity === "supermarkets") {
      const supermarkets = await axios.get(`https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=circle:${coordinates.data[0].lon},${coordinates.data[0].lat},5000&bias=proximity:${coordinates.data[0].lon},${coordinates.data[0].lat}&limit=20&apiKey=${APIKeyGeo}`)
      console.log(supermarkets.data)
      const formattedSupermarkets = formatSupermarketData(supermarkets.data)
      res.send({activities: formattedSupermarkets})
    
    }

    else if (activity === "museums") {
      const museums = await axios.get(`https://api.geoapify.com/v2/places?categories=entertainment.museum&filter=circle:${coordinates.data[0].lon},${coordinates.data[0].lat},5000&bias=proximity:${coordinates.data[0].lon},${coordinates.data[0].lat}&limit=20&apiKey=${APIKeyGeo}`)
      const formattedMuseums = formatMuseumData(museums.data)
      res.send({activities: formattedMuseums})
    }

    else if (activity === "restaurants") {
      const restaurants = await axios.get(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${coordinates.data[0].lon},${coordinates.data[0].lat},5000&bias=proximity:${coordinates.data[0].lon},${coordinates.data[0].lat}&limit=20&apiKey=${APIKeyGeo}`)
      const formattedRestaurants = formatRestaurantData(restaurants.data)
      res.send({activities: formattedRestaurants})
    }

    else if (activity === "parks") {
      const parks = await axios.get(`https://api.geoapify.com/v2/places?categories=leisure.park&&filter=circle:${coordinates.data[0].lon},${coordinates.data[0].lat},5000&bias=proximity:${coordinates.data[0].lon},${coordinates.data[0].lat}&limit=20&apiKey=${APIKeyGeo}`)
      console.log(parks)
      const formattedParks = formatParkData(parks.data)
      res.send({activities: formattedParks})
    }
    
    else {
      res.status(404).send({error: 'activity not found'})
    }
  }

  catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).send({error: error.issues})
    } else {
      res.status(400).send({error: 'unknown error'})
    }
  }

})

app.post('/rating', async(req, res) => {
  try {
    const ipData = await checkIp({ip: req.ip, city: req.body.city})
    if (ipData === true) {
      res.status(400).send({error: 'You can rate a city only once a day.'})
    }
    else {
      const validatedRating = toRatingData({
        city: req.body.city, 
        rating: req.body.rating,
        ipAddress: req.ip,
        date: new Date()
    })
      const rating = new Rating(validatedRating) 
      const result = await rating.save()
      res.send({
        city: result.city,
        rating: result.rating
      })
    }
  } catch(error: unknown) {
    if (error instanceof Error) {
      console.log(error.message)
      if (error.name === "ValidationError") {
        res.status(400).send({error: error.message})
      } else if (error instanceof ZodError) {
      res.status(400).send({error: error.issues})
    }
    } 
    res.status(400).send({error: 'something went wrong'})
  }
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
