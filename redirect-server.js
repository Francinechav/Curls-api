const http = require('http');

const LOCAL_FRONTEND_PORT = 3000; // Your frontend dev port
const PUBLIC_PORT = 80; // External port PayChangu will hit

http.createServer((req, res) => {
  console.log(`Redirecting ${req.url} to http://localhost:${LOCAL_FRONTEND_PORT}${req.url}`);
  res.writeHead(302, { Location: `http://localhost:${LOCAL_FRONTEND_PORT}${req.url}` });
  res.end();
}).listen(PUBLIC_PORT, () => {
  console.log(`Redirect server running on port ${PUBLIC_PORT}`);
}).on('error', (err) => {
  console.error('Error starting redirect server:', err);
  if (err.code === 'EACCES') {
    console.error('Port 80 requires admin privileges. Run terminal as Administrator / sudo and try again.');
  }
});
