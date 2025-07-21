export interface Weather {
    description: string, 
    temperature: number,
    icon: string
} 

export interface Supermarket {
    name: string, 
    id: string,
    suburb: string, 
    address: string,
    openingHours: string
}

export interface Museum {
    name: string, 
    id: string,
    address: string,
    openingHours?: string
}

export interface Restaurant {
    name: string, 
    id: string,
    address: string,
    cuisine?: string,
    website?: string
}

export interface Option {
    value: string, 
    label: string
}

export interface ratingOption {
    value: string, 
    label: string
}
