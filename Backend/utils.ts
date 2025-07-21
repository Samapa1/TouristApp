import { toRestaurantData, toWeatherData, toSupermarketData, toMuseumData, Weather, Restaurant, Supermarket, Museum, ipData } from "./types"
import { Rating } from "./models/rating"

export const formatWeatherData = (data: any): Weather => {
  const validatedData = toWeatherData(data)
  const weatherData = {
    description: validatedData.weather[0].description,
    temperature: validatedData.main.temp,
    icon: validatedData.weather[0].icon
  }
  return weatherData
}

export const formatRestaurantData = (data: any): Restaurant[] => {
    const validatedData = toRestaurantData(data)
    return validatedData.features.map((restaurant) => {
        return ({
            name: restaurant.properties.name, 
            id: restaurant.properties.place_id, 
            address: restaurant.properties.address_line2,
            cuisine: restaurant.properties.datasource.raw.cuisine, 
            website: restaurant.properties.website
        });
    });
}

export const formatSupermarketData = (data: any): Supermarket[] => {
    const validatedData = toSupermarketData(data)
    return (validatedData.features.map((supermarket) => {
        return ({
            name: supermarket.properties.name, 
            id: supermarket.properties.place_id,
            suburb: supermarket.properties.suburb, 
            address: supermarket.properties.address_line2,
            openingHours: supermarket.properties.opening_hours
        });
    }));

}

export const formatMuseumData = (data: any): Museum[] => {
    const validatedData = toMuseumData(data)
    return (validatedData.features.map((museum) => {
        return ({
            name: museum.properties.name, 
            id: museum.properties.place_id,
            address: museum.properties.address_line2,
            openingHours: museum.properties.opening_hours
        });
    }));

}

export const checkIp = async (data: ipData): Promise<boolean> => {
    const isFound =  await Rating.find({ ipAddress: data.ip, city: data.city })
    const ratingDates = isFound.map(r => r.date)
    const timeLimits = ratingDates.map(d => d.setDate(d.getDate()+1))
    const now = (new Date).getTime()
    const results = timeLimits.map(t => { if (now  < t) {
            return true
        } else {
            return false 
        }
    })

    if (results.includes(true)) {
        return true
    } 
    else {
        return false
    }
}