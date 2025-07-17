import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
    city: {
      type: String, 
      minlength: 3,
      required: true
    },
    rating: {
      type: Number, 
      min: 1,
      max: 10,
      required: true
    },
    ipAddress: {
      type: String,
      required: true, 
    }, 
    date: {
      type: Date, 
      required: true
    }
})

// module.exports = mongoose.model('Rating', ratingSchema)
export const Rating = mongoose.model('Rating', ratingSchema)

