import { WebSocket, WebSocketServer } from "ws";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config';


const PORT = 3002;

const wss = new WebSocketServer({port:PORT} , () => {
    console.log(`Websocket server running in PORT : ${PORT}`);
})

interface User {
    userId:string;
    rooms:string[];
    ws:WebSocket
}

const checkUser = (token :string):string| null => {
   try {
    const decoded = jwt.verify(token , JWT_SECRET)
    if(typeof decoded == "string") {
      return null
    }

    if(!decoded || !decoded.userId) {
        return null
    }
    return decoded.userId;

   } catch (error) {
    return null
   }
return null;
}

const users:User[] = [];

wss.on("connection" , (ws ,request) => {

    const url = request.url;

    if(!url) {
        return;
    }
    
    const queryParams = new URLSearchParams(url?.split('?')[1]);
    const token = queryParams.get('token') || "";

    const userId = checkUser(token)

    if(userId == null) {
        ws.close()
        return null;
    } 

    users.push({
        userId,
        rooms: [],
        ws
    })


    ws.on("message" , (msg) => {
        const parsedData = JSON.parse(msg.toString())

        if (parsedData.type == "join-room") {
            const user = users.find(user => ws ===user.ws);
            user?.rooms.push(parsedData.roomId);
        }

        if(parsedData.type == "leave-room") {
            const user = users.find(user => ws === user.ws)
            if(!user){
                return;
            }
            user.rooms = user?.rooms.filter(room => room === parsedData.room) 
        }

        if(parsedData.type == "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            users.forEach(user => {
                if(user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message,
                        roomId
                    }))
                }
            })
        }
    })
})