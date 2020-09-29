'use strict'

const http = require('http');
const child = require('child_process').fork(__dirname + '/socket-worker.js');

const server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log('\033[32m' + 'Master' + '\033[39m');
  res.end('Hello Master\n');
});

server.listen(3000, function(){
  child.send('serverHandle', server._handle);
});
