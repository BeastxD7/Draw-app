import { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '@repo/backend-common/config';


const PORT = 3002;

const wss = new WebSocketServer({port:PORT} , () => {
    console.log(`Websocket server running in PORT : ${PORT}`);
})

wss.on("connection" , (ws ,request) => {

    const url = request.url;

    if(!url) {
        return;
    }
    
    const queryParams = new URLSearchParams(url?.split('?')[1]);
    const token = queryParams.get('token') || "";

    const decoded = jwt.verify(token , JWT_SECRET)
    if(typeof decoded == "string") {
      return
    }

    if(!decoded || !decoded.userId) {
        ws.close();
        return;
    }


    ws.on("message" , (msg) => {
        ws.send("pong")
    })
})