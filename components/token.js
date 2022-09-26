import jwt from "jsonwebtoken"

class Token{
    verify(accessToken, roles = []){
        try{
            const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            if(roles.length === 0){
                return payload
            }else{
                return roles.includes[payload.role]? payload: null
            }
        }catch(e){
            return null
        }
    }
}

export default new Token()