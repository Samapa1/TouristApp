import { toRestaurantData, toWeatherData, toSupermarketData, toMuseumData, Weather, Restaurant, Supermarket, Museum } from "./types"

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