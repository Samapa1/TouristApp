import { z } from 'zod';

export const weatherData = z.object ({
    weather: 
        z.array(z.object({
        description: z.string(),
        icon: z.string()
    })).min(1),
    main: z.object({
        temp: z.number()
    })
})

export type WeatherData = z.infer<typeof weatherData>

export const toWeatherData = (data: unknown): WeatherData => {
    return weatherData.parse(data)
}

export interface Weather {
    description: string, 
    temperature: number,
    icon: string
} 

export const restaurantRawData = z.object({
    features: 
        z.array(z.object({
            properties: (z.object({
                name: z.string().optional(),
                address_line2: z.string().optional(),
                website: z.string().optional(),
                place_id: z.string(),
                datasource: (z.object({
                    raw: (z.object({
                        cuisine: z.string().optional()
                    }))
                }))
        }))
               
    })).min(1)
})

export type RestaurantRawData = z.infer<typeof restaurantRawData>

export const toRestaurantRawData = (data: unknown): RestaurantRawData => {
    return restaurantRawData.parse(data)
}

export type RestaurantData = {
    properties: {
        name: string,
        address_line2: string,
        website?: string,
        place_id: string,
        datasource: {
                    raw: {
                        cuisine?: string
                    }
        }
    }
}

export interface Restaurant {
    name: string, 
    id: string, 
    address: string,
    cuisine?: string, 
    website?: string
}

export const supermarketRawData = z.object({
    features: 
        z.array(z.object({
            properties: (z.object({
                name: z.string().optional(),
                suburb: z.string().optional(),
                address_line2: z.string().optional(),
                place_id: z.string(),
                opening_hours: z.string().optional()
        }))
               
    })).min(1)
})

export type SupermarketRawData = z.infer<typeof supermarketRawData>

export const toSupermarketRawData = (data: unknown): SupermarketRawData => {
    return supermarketRawData.parse(data)
}

export type SupermarketData = {
    properties: {
        name: string,
        suburb?: string,
        address_line2: string,
        place_id: string,
        opening_hours?: string
    }      
}

export interface Supermarket {
    name: string, 
    id: string,
    suburb?: string, 
    address: string,
    openingHours?: string
}

export const museumRawData = z.object({
    features: 
        z.array(z.object({
            properties: (z.object({
                name: z.string().optional(),
                address_line2: z.string().optional(),
                place_id: z.string(),
                opening_hours: z.string().optional()
        }))
               
    })).min(1)
})

export type MuseumRawData = z.infer<typeof museumRawData>

export const toMuseumRawData = (data: unknown): MuseumRawData => {
    return museumRawData.parse(data)
}

export type MuseumData = {
    properties: {
        name: string, 
        place_id: string,
        address_line2: string,
        opening_hours?: string
    }
}

export interface Museum {
    name: string, 
    id: string,
    address: string,
    openingHours?: string
}

export type ActivityData = MuseumData | SupermarketData | RestaurantData
export type ActivityRawData = MuseumRawData | SupermarketRawData | RestaurantRawData

// export type Activity = Museum | Supermarket | Restaurant

export const Rating  = z.object ({
    city: z.string(),
    rating: z.number().min(1).max(10),
    ipAddress: z.string(),
    date: z.date()

})

export type RatingData = z.infer<typeof Rating>

export const toRatingData = (data: unknown): RatingData => {
    return Rating.parse(data)
}

export interface ipData {
    ip?: string,
    city: string 
}