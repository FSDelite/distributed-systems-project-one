const net = require("net");
const sockets = [];
const port = 8000;
const guestId = 0;

const server = net.createServer(function (socket) {
  // Increment
  guestId++;

  socket.nickname = "Guest" + guestId;
  const clientName = socket.nickname;

  sockets.push(socket);

  // Log it to the server output
  console.log(clientName + " joined this chat.");

  // Welcome user to the socket
  socket.write("Welcome to chat!\n");

  // Broadcast to others excluding this socket
  broadcast(clientName, clientName + " joined this chat.\n");

  // When client sends data
  socket.on("data", function (data) {
    const message = clientName + "> " + data.toString();

    broadcast(clientName, message);

    // Log it to the server output
    console.log(message);
  });

  // When client leaves
  socket.on("end", function () {
    const message = clientName + " left this chat\n";

    // Log it to the server output
    console.log(message);

    // Remove client from socket array
    removeSocket(socket);

    // Notify all clients
    broadcast(clientName, message);
  });

  // When socket gets errors
  socket.on("error", function (error) {
    console.log("Socket got problems: ", error.message);
  });
});

// Broadcast to others, excluding the sender
function broadcast(from, message) {
  // If there are no sockets, then don't broadcast any messages
  if (sockets.length === 0) {
    process.stdout.write("Everyone left the chat");
    return;
  }

  // If there are clients remaining then broadcast message
  sockets.forEach(function (socket, index, array) {
    // Dont send any messages to the sender
    if (socket.nickname === from) return;

    socket.write(message);
  });
}

// Remove disconnected client from sockets array
function removeSocket(socket) {
  sockets.splice(sockets.indexOf(socket), 1);
}

// Listening for any problems with the server
server.on("error", function (error) {
  console.log("So we got problems!", error.message);
});

// Listen for a port to
// then in the terminal just run 'localhost [port]'
server.listen(port, function () {
  console.log("Server listening at http://localhost:" + port);
});
