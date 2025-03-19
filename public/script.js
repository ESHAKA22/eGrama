//console.log(io)

//const { query } = require("express")

//io () connect to socket io server at url;
const socket = io('http://localhost:4000',{
    auth: {
        secret: "this is secret"
    },
    query:{
        meaningOfLife: 42,
    }
})

//our socket has an  on methosd and emit method
socket.on('welcome',data=>{
    console.log(data)
    //once welcome is emitted from the server, we run this call back
    socket.emit('thankyou',[4,5,6])
})
socket.on('newClient',data=>{
    console.log('message to all client:a new socket has joined',data)
})

socket.on('messageFromServerToAllClients',newMessage=>{
    document.getElementById('messages').innerHTML += `<li>${newMessage}</li>`
})

document.getElementById('messages-form').addEventListener('submit',e=>{
    e.preventDefault()
    const newMessage =document.getElementById('user-message').value
    document.getElementById('user-message').value =""
    //this socket is sending an event to the server
    socket.emit('messageFromClientToServer',newMessage)
})

