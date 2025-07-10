import express from 'express';
import axios from 'axios';
const app = express();
require("dotenv").config();
import cors from 'cors';
import { ZodError } from 'zod';
import { formatWeatherData, formatRestaurantData, formatSupermarketData, formatMuseumData } from './utils.ts';

const apiKeyWeather = process.env.API_key_weather
const APIKeyGeo = process.env.API_key_geo

app.use(cors())

app.get('/', async (req, res) => {

  try {
    let city = req.query.city;
    let activities = req.query.activities;
    const coordinates = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKeyWeather}`);
    const weather = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.data[0].lat}&lon=${coordinates.data[0].lon}&appid=${apiKeyWeather}`);
    const formattedWeather = formatWeatherData(weather.data)

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
      res.send(formattedWeather)
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


const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
