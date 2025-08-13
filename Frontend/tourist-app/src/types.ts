export interface Weather {
    description: string, 
    temperature: number,
    icon: string
} 

export interface ActivityBase {
    name: string, 
    id: string,
    address: string
}

export interface Supermarket extends ActivityBase {
    suburb: string, 
    openingHours: string,
    type: "supermarket"
}

export interface Museum extends ActivityBase {
    openingHours?: string
    type: "museum"
}

export interface Restaurant extends ActivityBase {
    cuisine?: string,
    website?: string,
    type: "restaurant"
}

export interface Park extends ActivityBase {
    suburb?: string, 
    type: "park"
}


export interface Option {
    value: string, 
    label: string
}

export interface ratingOption {
    value: string, 
    label: string
}

export type Activity = Restaurant | Museum | Supermarket | Park