# TouristApp

The project demonstrates tourist app, where users can find things to do (museums, restaurants etc.) in chosen locations. 
Users can also rate the cities. 

## Instructions: 

Node JS and MongoDB are needed. The app makes calls to two external APIs, GeoApify and OpenWeather, that require API keys. 
API keys can be generated at https://openweathermap.org/api and https://www.geoapify.com/. 

Start by cloning the project and ``run npm install`` inside frontend and backend folders. 
Then go to the backend folder and copy env.dist file into env file. Generate API keys and add them as environmental variables (API_key_weather and API_key_geo). In addition, add MongoDB URI to connect to the database.

### How to run app in a development mode: 

Go to the frontend and backend folders and run ``npm run dev`` in each.