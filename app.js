const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const server = require('http').createServer(app)
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
var Routes = require('./Routes/route')

dotenv.config()

const port = process.env.PORT

app.use(cors())
app.use(morgan('common'))
app.use(express.json())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api', Routes.Router)

server.listen(port, () => {
  console.log(`Server is listing at port Number ${port}`)
})

module.exports = app
