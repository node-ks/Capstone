const express = require('express')
const bodyParser = require('body-parser')
//const store = require('./store')
const app = express()
require('dotenv')
//var path = require('path')
//var formidable = require('formidable')

const userRouter = require('./users/routes')
const studentRouter = require('./students/routes')
const sponsorRouter = require('./sponsors/routes')
const employerRouter = require('./employers/routes')
const facilitatorRouter = require('./facilitators/routes')
const jobRouter = require('./jobs/routes')
const schoolRouter = require('./schools/routes')
const sponsorDocRouter = require('./sponsor_docs/routes') 

const clientSessions = require("client-sessions");

app.set('view engine', 'pug')


//node-client-sessions
app.use(clientSessions({
    cookieName: 'session_state', // cookie name dictates the key name added to the request object
    secret: 'blargadeeblargblarg', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration
//    secret: 'lkjlkjlkjljlkjlkjlkjlkjlkj' // CHANGE THIS!
  }))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}));
  
app.use('/', userRouter)
app.use('/student', studentRouter)
app.use('/sponsor', sponsorRouter)
app.use('/employer', employerRouter)
app.use('/facilitator', facilitatorRouter)
app.use('/job', jobRouter)
app.use('/school', schoolRouter)
app.use('/sponsor_docs', sponsorDocRouter)

app.use(express.static('public'))


app.listen(7555, () => {
    
    
/*     const result = dotenv.config()
 
    if (result.error) {
        throw result.error
    } */
    
    //console.log(result.parsed)
    
    console.dir(process.env)
    console.log('Server running on http://localhost:7555')
})