const net = require("net");
const server = net.createServer((socket) => {
  socket.write("Hello From Server!");
  socket.on("data", (data) => {
    console.log(data.toString());
  });
  socket.on("close", () => {
    console.log("Connection closed.!!!");
  });
});
server.listen(8080);
