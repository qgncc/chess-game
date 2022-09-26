import roomManager from "../components/room-manager.js"
import { OUTGOING_MESSAGES } from "../constants.js"


class Connection{
    constructor(socket){
        this._ws = socket
    }

    get readyState(){
        return this._ws.readyState
    }

    sendMessage(message){
        this._ws.send(message)
    }
    sendMessageJSON(message){
        this.sendMessage(JSON.stringify(message))
    }

}


class ConnectionHandler{

    onMessage(message, socket){
        try {
            if(message.type === "create_room"){
                this.createRoom(message, socket);
            }
            if(message.type === "join_room"){
                this.joinRoom(message, socket)
            }
            if(message.type === "move"){
                this.move(message);
            }
            if(message.type === "rematch_request"){
                this.rematch(message);
            }
        } catch (error) {
            this.error(error, socket)
        }
    }

    createRoom(message,socket){
        const {roomId} = message
        roomManager.createRoom(roomId, socket)
        socket.send(JSON.stringify({type: OUTGOING_MESSAGES.ROOM_CREATED, roomId}))
    }
    joinRoom(message, socket){
        const {roomId, playerId,side} = message
        return roomManager.joinRoom(roomId, playerId, new Connection(socket), side)
    }
    move(message){
        const {roomId, move, side} = message
        return roomManager.move(roomId, move, side)
    }
    rematch(message){
        const {roomId, side} = message
        return roomManager.rematch(roomId, side)
    }
    error(error, socket){
        console.log(error)
        socket.send(JSON.stringify(error.message))
    }
}


export default new ConnectionHandler