import Room from "./room.js"

class RoomManager{

    _rooms = {}


   

    _getRoom(roomId){
        const room = this._rooms[roomId]
        if(!room) throw new Error("No room with such roomId: "+roomId)
        return room
    }

    createRoom(roomId){
        this._rooms[roomId] = new Room(roomId, this.removeRoom.bind(this))
    }

    

    joinRoom(roomId, playerId, connection, side){
        const room = this._getRoom(roomId)
        if(!playerId) throw new Error("No player id") 

        room.join(connection, playerId, side)
    }
    move(roomId, move, side){
        const room = this._getRoom(roomId)
        return room.move(move, side)
    }

    rematch(roomId, side){
        const room = this._getRoom(roomId)
        room.rematch(side)
    }

    removeRoom(room, options = {}){
        let force = options?.force || false
        if(force){
            this._deleteRoom(room.id)
        }else{
            if(room.status === room.IN_PROCESS) return
            setTimeout(()=>{
                if(room.status === room.IN_PROCESS) return
                this._deleteRoom(room.id)
            }, 10000)
        }
    }
    _deleteRoom(roomId){
        if(this._rooms[roomId]) {
            delete this._rooms[roomId]
        }
    }
}

export default new RoomManager()