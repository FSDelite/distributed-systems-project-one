var net = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

var client = new net.Socket();
client.connect(8000, "127.0.0.1", function () {
  console.log("Connected");
});

client.on("data", function (data) {
  console.log("Received: " + data);
});

client.on("close", function () {
  console.log("Connection closed");
});

const infiniteRecursiveReadline = function () {
  readline.question("", function (message) {
    if (message === "q") {
      client.destroy();
      return readline.close();
    }
    client.write(message);

    infiniteRecursiveReadline();
  });
};

infiniteRecursiveReadline();
