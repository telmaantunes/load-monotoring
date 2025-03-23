import { createServer } from 'http';
import { Server } from 'socket.io';
import * as os from 'os';

// Create an HTTP server
const httpServer = createServer();

// Create a Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins (adjust as needed for production)
    methods: ['GET', 'POST'],
  },
});

// Function to get CPU load averages
function getCpuLoad(): CpuInfo {
  const cpus = os.cpus().length; // Number of CPU cores

  return {
    normalizedLoadAverage: os.loadavg()[0] / cpus,
    timestamp: new Date().getTime()
  };
}

// Handle client connection
io.on('connection', (socket) => {
  console.log('Client connected');

  // Function to send CPU load averages to the client
  const sendCpuLoad = () => {
    const data = getCpuLoad();
    socket.emit('cpu-load', data); // Emit the "cpu-load" event with the load data
  };

  // Send data every 10 seconds
  const interval = setInterval(sendCpuLoad, 10000);

  // Send initial data immediately
  sendCpuLoad();

  // Clean up when the client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

// Start the server
const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export interface CpuInfo {
  normalizedLoadAverage: number;
  timestamp: number;
}