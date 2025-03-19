const express =require('express')
const app =express()//make an express app
//server the files in public statically
app.use (express.static('public'))
const expressServere = app.listen(4000)

const{ Server } =require('socket.io')//the way the docs make server
const socketio =require('socket.io')
//io is socket io server
//Capital S is the server constructure (in docs ,it the top thing)
//small s is variable in docs for the server, we call it io
//const io = socketio(expressServere,{
    const io = new Server(expressServere,{
    //serveClient: false,
    cors:[
        'http://localhost:4000'
    ]

})
//on is regualr js /node event listner
io.on('connection',socket=>{
    console.log(socket.handshake)

    console.log(socket.id, "has joined our server!")
    //1st arg or emit is event name
        //anything is ok,except for what is here
    //socket.emit will emit to this one socket
    //socket.emit('welcome',[1,2,3])//push an event to client
    //io.emit will emit to all sockets to connect to server
    //io.emit('newClient',socket.id)
    //socket.on('thankyou',data=>{
      //  console.log("message from client",data)
    //})
    socket.on('messageFromClientToServer',newMessage=>{
       //pass through message to everyone 
       io.emit('messageFromServerToAllClients',newMessage)
    })
})
