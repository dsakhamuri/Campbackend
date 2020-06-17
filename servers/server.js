require('../db/mongoose') //connecting database
const express = require('express')
const path = require('path')
const postRouter = require('../router/post-router')
const facultyRouter = require('../router/faculty-router')
const studentRouter = require('../router/student-router')
const bodyParser = require('body-parser')

//middleWare
const allowCORS = require('../middlewares/allowCORS')

//running express
const app = express()

// parsing
app.use(express.json())  //app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use("/assets/images/postMedias", express.static(path.join("assets/images/postMedias")))


app.use(allowCORS)
app.use(postRouter)
app.use(facultyRouter)
app.use(studentRouter)


module.exports = app
