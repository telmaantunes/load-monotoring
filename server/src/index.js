"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var os = require("os");
// Create an HTTP server
var httpServer = (0, http_1.createServer)();
// Create a Socket.io server
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*', // Allow all origins (adjust as needed for production)
        methods: ['GET', 'POST'],
    },
});
// Function to get CPU load averages
function getCpuLoad() {
    var cpus = os.cpus().length; // Number of CPU cores
    return {
        normalizedLoadAverage: os.loadavg()[0] / cpus,
        timestamp: new Date().getTime()
    };
}
// Handle client connection
io.on('connection', function (socket) {
    console.log('Client connected');
    // Function to send CPU load averages to the client
    var sendCpuLoad = function () {
        var data = getCpuLoad();
        socket.emit('cpu-load', data); // Emit the "cpu-load" event with the load data
    };
    // Send data every 10 seconds
    var interval = setInterval(sendCpuLoad, 10000);
    // Send initial data immediately
    sendCpuLoad();
    // Clean up when the client disconnects
    socket.on('disconnect', function () {
        console.log('Client disconnected');
        clearInterval(interval);
    });
});
// Start the server
var PORT = 3000;
httpServer.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
