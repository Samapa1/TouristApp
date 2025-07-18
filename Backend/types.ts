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

export const restaurantData = z.object({
    features: 
        z.array(z.object({
            properties: (z.object({
                name: z.string(),
                address_line2: z.string(),
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

export type RestaurantData = z.infer<typeof restaurantData>

export const toRestaurantData = (data: unknown): RestaurantData => {
    return restaurantData.parse(data)
}


export interface Restaurant {
    name: string, 
    id: string, 
    address: string,
    cuisine?: string, 
    website?: string
}

export const supermarketData = z.object({
    features: 
        z.array(z.object({
            properties: (z.object({
                name: z.string(),
                suburb: z.string(),
                address_line2: z.string(),
                place_id: z.string(),
                opening_hours: z.string().optional()
        }))
               
    })).min(1)
})

export type SupermarketData = z.infer<typeof supermarketData>

export const toSupermarketData = (data: unknown): SupermarketData => {
    return supermarketData.parse(data)
}

export interface Supermarket {
    name: string, 
    id: string,
    suburb: string, 
    address: string,
    openingHours?: string
}

export const museumData = z.object({
    features: 
        z.array(z.object({
            properties: (z.object({
                name: z.string(),
                address_line2: z.string(),
                place_id: z.string(),
                opening_hours: z.string().optional()
        }))
               
    })).min(1)
})

export type MuseumData = z.infer<typeof museumData>

export const toMuseumData = (data: unknown): MuseumData => {
    return museumData.parse(data)
}

export interface Museum {
    name: string, 
    id: string,
    address: string,
    openingHours?: string
}

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
