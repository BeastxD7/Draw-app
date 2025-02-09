import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port:3002},()=>{
    console.log(`websocket server running succesfully!`);
});

wss.on("connection" , (ws)=> {


    ws.on("message" , (msg) => {
        console.log(msg);
        ws.send(msg)
    })

}) 