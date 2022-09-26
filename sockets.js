import {WebSocketServer} from 'ws';
import connectionHandler from './controllers/connection-handler.js';
import { URL } from "node:url"
import token from './components/token.js';


function startWSS(server) {
    const wss = new WebSocketServer({noServer: true});

    wss.on('connection', (socket) => {
        console.log("Connection!")
        socket.on('error', function (){
            console.log("closed");
        });
        socket.on('message', function message(data) {
            let message = JSON.parse(data);
            console.log(message);
            connectionHandler.onMessage(message, socket)
        });

    });

    server.on("upgrade", function upgrade(request, socket, head){
        const url = new URL(request.url, "http://localhost:8081/")
        if(url.pathname === "/create_game"){
            wss.handleUpgrade(request, socket, head, function done(ws) {
                wss.emit('connection', ws);
                });
        }
    })
}

export default startWSS;