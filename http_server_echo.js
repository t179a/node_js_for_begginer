'use strict'

const http = require('http');
const server = http.createServer();
const port = 1337;

server.on('request', function(req, res){
  const data = '';
  req.on('data', function(chunk){
    data += chunk;
  });
  req.on('end', function(){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Body Echo: ' + data + '\n');
  });
});

server.on('connection', function(socket){
  console.log('=== Raw Socket Data Start ===');
  socket.on('data', function(chunk){
    console.log(chunk.toString());
  });
  socket.on('end', function(){
    console.log('=== Raw Socket Data End ===')
  });
});


server.on('clientError', function(e){
  console.log('Client Error: ' , e.message);
});

server.listen(port, function(){
  console.log('listening on ' + port);
});