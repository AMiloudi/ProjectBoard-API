const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/project-board'
mongoose.set('debug', true)
mongoose.connect(MONGODB_URL, { useMongoClient: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Successfully connected to MongoDB!')
})

module.exports = mongoose
