import { toRestaurantRawData, toWeatherData, toSupermarketRawData, toMuseumRawData, Weather, Restaurant, ActivityData, ActivityRawData, RestaurantData, Supermarket, SupermarketData, Museum, MuseumData, Park, toParkRawData, ParkData, ipData } from './types'
import { Rating } from './models/rating'

export const formatWeatherData = (data: unknown): Weather => {
  const validatedData = toWeatherData(data)
  const weatherData = {
    description: validatedData.weather[0].description,
    temperature: validatedData.main.temp,
    icon: validatedData.weather[0].icon,
  }
  return weatherData
}

function checkData<B extends ActivityData>(data: ActivityRawData['features'][0]): data is B {
  return (data.properties.name !== undefined && data.properties.address_line2 !== undefined)
}

export const formatRestaurantData = (data: unknown): Restaurant[] => {
  const validatedData = toRestaurantRawData(data)
  const filteredData = validatedData.features.filter(checkData<RestaurantData>)

  return filteredData.map((restaurant) => {
    return ({
      name: restaurant.properties.name,
      id: restaurant.properties.place_id,
      address: restaurant.properties.address_line2,
      cuisine: restaurant.properties.datasource.raw.cuisine,
      website: restaurant.properties.website,
      type: 'restaurant',
    })
  })
}

export const formatSupermarketData = (data: unknown): Supermarket[] => {
  const validatedData = toSupermarketRawData(data)
  const filteredData = validatedData.features.filter(checkData)

  return (filteredData.map((supermarket: SupermarketData) => {
    return ({
      name: supermarket.properties.name,
      id: supermarket.properties.place_id,
      suburb: supermarket.properties.suburb,
      address: supermarket.properties.address_line2,
      openingHours: supermarket.properties.opening_hours,
      type: 'supermarket',
    })
  }))
}

export const formatMuseumData = (data: unknown): Museum[] => {
  const validatedData = toMuseumRawData(data)
  const filteredData = validatedData.features.filter(checkData)

  return (filteredData.map((museum: MuseumData) => {
    return ({
      name: museum.properties.name,
      id: museum.properties.place_id,
      address: museum.properties.address_line2,
      openingHours: museum.properties.opening_hours,
      type: 'museum',
    })
  }))
}

export const formatParkData = (data: unknown): Park[] => {
  const validatedData = toParkRawData(data)
  const filteredData = validatedData.features.filter(checkData)
  return (filteredData.map((park: ParkData) => {
    return {
      name: park.properties.name,
      id: park.properties.place_id,
      suburb: park.properties.suburb,
      address: park.properties.address_line2,
      type: 'park',
    }
  }))
}

export const checkIp = async (data: ipData): Promise<boolean> => {
  const isFound = await Rating.find({ ipAddress: data.ip, city: data.city })
  const ratingDates = isFound.map(r => r.date)
  const timeLimits = ratingDates.map(d => d.setDate(d.getDate() + 1))
  const now = (new Date()).getTime()
  const results = timeLimits.map((t) => {
    if (now < t) {
      return true
    }
    else {
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

// export const checkReqBody = (data: unknown): boolean => {
//   if (!data || typeof data === 'undefined') {
//     return false
//   }
//   if (data && typeof data === 'object') {
//     if ('city' in data && 'rating' in data) {
//       if (typeof data.city === 'string' && typeof data.rating === 'number') {
//         return true
//       }
//     }
//   }
//   return false
// }
