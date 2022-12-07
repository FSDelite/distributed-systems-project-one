//@ts-check
const net = require("net");
const sockets = [];
const port = 8000;
let guestId = 0;

const server = net.createServer((socket) => {
  // Increment
  guestId++;

  socket.nickname = guestId;
  socket.firstMessage = true;
  // socket.id = guestId;
  // let socket.nickname = socket.nickname;

  sockets.push(socket);

  // Log it to the server output
  console.log(`${socket.nickname} joined this chat.`);

  // Welcome user to the socket
  socket.write("Welcome to chat! Please insert your username\n");

  // multicast to others excluding this socket
  multicast(socket.nickname, `Someone joined this chat.\n`);

  // When client sends data
  socket.on("data", (data) => {
    const message = `${socket.nickname}: ${data.toString()}`;

    multicast(socket.nickname, message);

    // Log it to the server output
    console.log(message);
  });

  // When client leaves
  socket.on("end", () => {
    const message = `${socket.nickname} left this chat\n`;

    // Log it to the server output
    console.log(message);

    // Remove client from socket array
    removeSocket(socket);

    // Notify all clients
    multicast(socket.nickname, message);
  });

  // When socket gets errors
  socket.on("error", (error) => {
    console.log("Socket got problems: ", error.message);
  });
});

// multicast to others, excluding the sender
const multicast = (from, message) => {
  // If there are no sockets, then don't multicast any messages
  if (sockets.length === 0) {
    process.stdout.write("Everyone left the chat");
    return;
  }

  if (typeof from == "number") {
    if (
      sockets[from - 1].firstMessage &&
      !message.includes("joined this chat")
    ) {
      sockets[from - 1].nickname = message.split(":")[1].trim();
      sockets[from - 1].firstMessage = false;

      return;
    }
  }

  // If there are clients remaining then multicast message
  sockets.forEach((socket, index, array) => {
    //if is the first message from the sender dont send to anyone

    // Dont send any messages to the sender
    if (socket.nickname === from && !socket.firstMessage) return;

    socket.write(message);
  });
};

// Remove disconnected client from sockets array
const removeSocket = (socket) => {
  sockets.splice(sockets.indexOf(socket), 1);
};

// Listening for any problems with the server
server.on("error", (error) => {
  console.log("So we got problems!", error.message);
});

// Listen for a port to
// then in the terminal just run 'localhost [port]'
server.listen(port, () => {
  console.log("Server listening at http://localhost:" + port);
});
