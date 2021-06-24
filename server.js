const express = require('express')
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server);
const {v4:uuidv4} = require("uuid");

app.set('view engine','ejs')
app.use(express.static('public'))
app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`)   //redirecting to the url

})

app.get("/:room",(req,res)=>{
    res.render('room',{roomId: req.params.room})   //creating  a room and each room has a url
})

io.on("connection",socket=>{
    socket.on("join-room",(roomId,userId)=>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected',userId)   //listening to join room event
    })
})

server.listen(3000)