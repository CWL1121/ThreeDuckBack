const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const config = require("./img.json")
var io = new Server(server,{ cors: true });
const cors = require('cors')
app.use(cors())
app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/index.html")
    })

let index = 0 
setInterval(()=>{
    index++
    if(index == config.length){
        index = 0
    }
}, 3000)


let players = []
io.on('connection', (socket) => {
    players.push({
        id:socket.id
    })
    socket.on('getId',()=>{
        socket.emit('id',socket.id)
    })
    socket.on('getImg', ()=>{
        socket.emit('img', index)
    })
    console.log(`player: ${socket.id} joined`);
    socket.on('move',(info)=>{
        players.forEach(e=>{
            if (e.id == socket.id) {
                e.pos = info
                socket.broadcast.emit('replace',{players})
                console.log(players)
            }
        })
    })
    socket.on('disconnect',()=>{
        console.log(`${socket.id}断开`)
        players.splice(players.indexOf(socket.id))
    })
});



app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Headers', ['mytoken','Content-Type']);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", 'charset=utf-8');
    next();
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
