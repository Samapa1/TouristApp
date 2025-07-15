import mongoose from 'mongoose';
require("dotenv").config();

const url = `${process.env.MONGODB_URI}`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const ratingSchema = new mongoose.Schema({
    city: String,
    rating: Number
})

const Rating = mongoose.model('Rating', ratingSchema)

const cityRating = new Rating({
  city: "Helsinki",
  rating: 8
})

cityRating.save().then(result => {
  console.log('rating saved!')
  console.log(result)
  mongoose.connection.close()
})