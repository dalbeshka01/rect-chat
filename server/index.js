require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index.js')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const {Server} = require('socket.io')
const http = require('http')
const path = require('path');

const PORT = process.env.PORT

const app = express()

const server = http.createServer(app)

io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {

    socket.on(`sendMessage`, (message) => {
        console.log(message)
        io.emit('newMessage', message)
    })

    console.log(`Socket connected: ${socket.id}`);

    io.on('disconnect', () => {
        console.log("Disconnect")
    })

})

app.use(cors({origin: "*"}))
app.use(express.json())
app.use('/api', router)
app.use(express.static('static'))

app.use(errorHandler)

const start = async () => {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    }catch (e){
        console.log(e)
    }
}

start()



