import mongoose from 'mongoose';
// require("dotenv").config();

// const url = `${process.env.MONGODB_URI}`

// mongoose.set('strictQuery', false)

// mongoose.connect(url)
//   .then( () => {
//     console.log('Connected to MongoDB')
//   })
//   .catch((error) => {
//     if (error instanceof Error) {
//     console.log('Connecting to MongoDB failed', error.message)
//     }
//   })

const ratingSchema = new mongoose.Schema({
    city: {
      type: String, 
      minlength: 3,
      required: true
    },
    rating: {
      type: Number, 
      required: true
    }
})

// module.exports = mongoose.model('Rating', ratingSchema)
export const Rating = mongoose.model('Rating', ratingSchema)

