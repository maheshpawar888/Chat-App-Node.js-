const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const { generateMessege, generateLocationMessege } = require('./utils/messege');
const {addUser,getUser,getUsersInRoom,removeUser } = require('./utils/user')

const app = express();
const server = http.createServer(app);

//using this our server supports web sockets
const io = socketio(server);  

// Serving the public directory
app.use(express.static(path.join(__dirname,'../public')))


io.on("connection", (socket) =>{
    console.log("New WebSocket connection..!!")    

    socket.on('join',({ username, room },cb)=>{

        const { error, user} = addUser({ id:socket.id, username, room })

        if( error ){
            return cb( error )
        }

        socket.join(user.room)

        socket.emit('msg',generateMessege("Admin","Welcome"))
        socket.broadcast.to(user.room).emit('msg',generateMessege(`${user.username} has joined!`))
        io.to( user.room ).emit('roomData',{
            room: user.room,
            users: getUsersInRoom( user.room )
        })
    })
    
    socket.on('sendMsgToall',(msg,callback) =>{
        const user = getUser( socket.id );
        io.to( user.room ).emit('msg',generateMessege(user.username,msg))
        callback();
    })

    socket.on('sendLocation',(location,callback) =>{
        const user = getUser( socket.id );
        io.to(user.room).emit('locationMessege',generateLocationMessege(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback(); 
    })

    socket.on('disconnect',() =>{
        const user = removeUser( socket.id )

        if( user ){
            io.to( user.room ).emit('msg',generateMessege(`A ${ user.username } has left!`));
            io.to( user.room ).emit('roomData',{
                room: user.room,
                users: getUsersInRoom( user.room )
            })
        }
    })
})

const Port = process.env.PORT || 3000;
server.listen(Port,() =>{
    console.log(`Listening to ${ Port }`)
})