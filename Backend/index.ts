import express from 'express';
import axios from 'axios';
const app = express();
require("dotenv").config();
import cors from 'cors';
import { ZodError } from 'zod';
import mongoose from 'mongoose';

import { formatWeatherData, formatRestaurantData, formatSupermarketData, formatMuseumData } from './utils.ts';
import { Rating } from './models/rating.ts';

const apiKeyWeather = process.env.API_key_weather
const APIKeyGeo = process.env.API_key_geo

const url = `${process.env.MONGODB_URI}`

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then( () => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    if (error instanceof Error) {
    console.log('Connecting to MongoDB failed', error.message)
    }
  })


app.use(cors())

app.use(express.json())

app.get('/', async (req, res) => {

  try {
    let cityp = req.query.city;
    let activities = req.query.activities;
    const coordinates = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityp}&appid=${apiKeyWeather}`);
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.data[0].lat}&lon=${coordinates.data[0].lon}&appid=${apiKeyWeather}`);
    const formattedWeather = formatWeatherData(weather.data)

    let ratingSum = 0
    let ratingAverage = null
    const ratings = await Rating.find({ city: cityp })
    if (ratings.length > 0) {
      ratings.forEach(r => ratingSum += r.rating)
      ratingAverage = ratingSum / ratings.length
    }
    console.log(ratings)

    if (activities === "supermarkets") {
      const supermarkets = await axios.get(`https://api.geoapify.com/v2/places?categories=commercial.supermarket&filter=circle:${coordinates.data[0].lon},${coordinates.data[0].lat},5000&bias=proximity:${coordinates.data[0].lon},${coordinates.data[0].lat}&limit=20&apiKey=${APIKeyGeo}`)
      const formattedSupermarkets = formatSupermarketData(supermarkets.data)
      res.send({supermarkets: formattedSupermarkets})
    
    }

    else if (activities === "museums") {
      const museums = await axios.get(`https://api.geoapify.com/v2/places?categories=entertainment.museum&filter=circle:${coordinates.data[0].lon},${coordinates.data[0].lat},5000&bias=proximity:${coordinates.data[0].lon},${coordinates.data[0].lat}&limit=20&apiKey=${APIKeyGeo}`)
      const formattedMuseums = formatMuseumData(museums.data)
      res.send({museums: formattedMuseums})
    }

    else if (activities === "restaurants") {
      const restaurants = await axios.get(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=circle:${coordinates.data[0].lon},${coordinates.data[0].lat},5000&bias=proximity:${coordinates.data[0].lon},${coordinates.data[0].lat}&limit=20&apiKey=${APIKeyGeo}`)
      const formattedRestaurants = formatRestaurantData(restaurants.data)
      res.send({restaurants: formattedRestaurants})
    }

    else {
      res.send({weather: formattedWeather, 
        rating: ratingAverage ? ratingAverage :  null
      })
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

app.post('/', async(req, res) => {
  try {
    console.log(req.body)
    const rating = new Rating({
      city: req.body.city, 
      rating: req.body.rating
    }) 
    const result = await rating.save()
    res.send({
      city: result.city,
      rating: result.rating
    })
  } catch(error) {
    if (error instanceof Error) {
      console.log(error.message)
      res.status(400).send({error: 'something went wrong'})
    }
  }
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
