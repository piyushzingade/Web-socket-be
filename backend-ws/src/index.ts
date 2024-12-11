import { WebSocketServer, WebSocket } from "ws";

const ws  = new WebSocketServer({port : 3000});

interface User{
    socket : WebSocket,
    room :string
}


let allSocket : User[] = [];
ws.on("connection" , (socket)=>{
    socket.on("message" , (message)=>{
        // @ts-ignore
        const parseMessage = JSON.parse(message)

        if(parseMessage.type ==="join"){
            allSocket.push({
                socket : socket,
                room : parseMessage.payload.room
            })
        }

        if (parseMessage.type === "chat") {
            const currentUser = allSocket.find((x) => x.socket == socket)?.room;


            
            for( let i= 0;i<allSocket.length;i++){
                if(allSocket[i].room === currentUser){
                    allSocket[i].socket.send(parseMessage.payload.message)
                }
            }

        }
    })

})