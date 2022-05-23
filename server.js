const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/message');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Butter Bot';

//Run when a client connects
io.on('connection', socket=> {

    socket.on('joinRoom', ({username, room})=>{
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //welcome current user
        socket.emit('message', formatMessage(botName, 'welcome to the chat room'));

        //Boradcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has entered the chat`));

        //Send users to room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //Listen for chat message
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit(
            'message',
            formatMessage(user.username, msg)
        );


    });

    //Runs when client disconnects
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);
        if(user){
            //boradcasts to everyone
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            //Send users to room
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        }
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));