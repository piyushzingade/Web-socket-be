import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer({ port: 3000 });

interface User {
  socket: WebSocket;
  room: string;
  name: string;
}

let allUsers: User[] = [];

ws.on("connection", (socket) => {
  socket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());

      // Handle joining a room
      if (parsedMessage.type === "join") {
        const { room, name } = parsedMessage.payload;
        allUsers.push({ socket, room, name });
        console.log(`${name} joined room: ${room}`);
      }

      // Handle chat messages
      if (parsedMessage.type === "chat") {
        const { message: chatMessage } = parsedMessage.payload;
        const currentUser = allUsers.find((user) => user.socket === socket);
        if (!currentUser) return;

        allUsers
          .filter((user) => user.room === currentUser.room)
          .forEach((user) =>
            user.socket.send(
              JSON.stringify({
                type: "chat",
                payload: {
                  sender: currentUser.name,
                  message: chatMessage,
                },
              })
            )
          );
      }
    } catch (error) {
      console.error("Error processing message: ", error);
    }
  });

  socket.on("close", () => {
    allUsers = allUsers.filter((user) => user.socket !== socket);
    console.log("Socket disconnected");
  });
});
