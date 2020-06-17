const mongoose = require('mongoose')


const db = mongoose.connect(String(process.env.MONGODB_URL), {
  useCreateIndex:true,
  useNewUrlParser:true,
  useUnifiedTopology:true
}).then(() => {
  console.log('Successfully connected to the database')
}).catch(() => {
  console.log('hey !! database connection failed')
})

module.exports = db
