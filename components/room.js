import { OUTGOING_MESSAGES } from '../constants.js'
import { Player } from './player.js'
import ChessEngine from './chess-engine.js'

const WAITING_FOR_PLAYERS = 1>>>0
const IN_PROCESS = 1>>>0
const GAME_OVER= 1>>>1
const WHITE = "w"
const BLACK = "b"

export default class Room{
    constructor(id, removeSelf, status = WAITING_FOR_PLAYERS, fen = undefined){
        this.id = id
        this.status = status
        this[WHITE] = null
        this[BLACK] = null
        this._removeSelf = removeSelf
        if(fen){
            this._engine = new ChessEngine(fen)
        }else{
            this._engine = new ChessEngine()
        }
    }

    WAITING_FOR_PLAYERS = 1>>>0
    IN_PROCESS = 1>>>0
    GAME_OVER= 1>>>1
    WHITE = "w"
    BLACK = "b"

    get history(){
        return this._engine.history()
    }

    join(socket, playerId, side = null){
        let color = side
        if(color){
            if(this[color]) throw new Error("Side "+color+" already taken")
        }else if(!this[WHITE]){
            color = WHITE            
        }else if(!this[BLACK]){
            color = BLACK
        }else{
           throw new Error("No space in room")
        }
        this[color] = new Player(
                color,
                playerId,
                socket
            )
        socket.sendMessageJSON({type:OUTGOING_MESSAGES.ROOM_JOINED, side, roomId: this.id})
        if(this[WHITE] && this[BLACK]){
            this.startGame()
        }
    }

    startGame(){
        console.log("Starting game");
        this[WHITE].socket.sendMessageJSON({type:OUTGOING_MESSAGES.START_GAME, side: WHITE, fen:this._engine.fen()})
        this[BLACK].socket.sendMessageJSON({type:OUTGOING_MESSAGES.START_GAME, side: BLACK, fen:this._engine.fen()})
        this.status = IN_PROCESS
    }
  
    _swapColor(color){
        return color === WHITE?BLACK:WHITE
    }

    _stringMoveToObject(move) {
        return{
            from: move[0]+move[1],
            to: move[2]+move[3],
            promotion: move[4] || undefined,
        }
    }
    _objectMoveToString(move) {
        const promotion = move.promotion?move.promotion:""
    
        return move.from+move.to+promotion
    }

    move(move, side){
        const objectMove = this._stringMoveToObject(move)
        const result = this._engine.move(objectMove)
        console.log(objectMove, result)
        if(result){
            this[this._swapColor(side)].socket.sendMessageJSON({type:OUTGOING_MESSAGES.MOVE ,move})
            const isEnded = this._engine.isEnded()
            if(isEnded){
                this.endGame()
            }
        }
    }
    endGame(){
        this[WHITE].socket.sendMessageJSON({type:OUTGOING_MESSAGES.END_GANE, side: WHITE})
        this[BLACK].socket.sendMessageJSON({type:OUTGOING_MESSAGES.END_GANE, side: BLACK})
        this.status = GAME_OVER
        this._removeSelf(this)
    }

    _swapSide(){
        [this[WHITE], this[BLACK]] = [this[BLACK], this[WHITE]];
        this[WHITE].side = WHITE
        this[BLACK].side = BLACK
    }

    rematch(side){
        this[side].rematchStatus = true;
        if(this[WHITE].rematchStatus && this[BLACK].rematchStatus){
            this[WHITE].rematchStatus = false;
            this[BLACK].rematchStatus = false;
            this._swapSide()
            this._engine.reset();
            
            this.startGame();
        }
    }

    
}

