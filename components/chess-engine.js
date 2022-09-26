import { Chess } from "chess.js"

class ChessEngine{
    constructor(fen){
        this._engine = new Chess(fen)
    }
    move(move) {
        return this._engine.move(move)
    }
    isEnded(){
        return this._engine.game_over()
    }
    getGameEndReason(){
        if(this._engine.in_stalemate()) return "stalemate"
        if(this._engine.in_checkmate()) return "checkmate"
        if(this._engine.insufficient_material()) return "no-material"
        if(this._engine.in_stalemate()) return "stalemate"
    }
    fen(){
        return this._engine.fen()
    }
    reset(){
        this._engine.reset()
    }
}

export default ChessEngine