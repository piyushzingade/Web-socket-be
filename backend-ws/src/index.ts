import { WebSocketServer  } from "ws";

const ws = new WebSocketServer({port: 8080})


let userCount = 0;
ws.on("connection" , (socket)=>{
    userCount++;
    console.log("User connect $" + userCount);
})  