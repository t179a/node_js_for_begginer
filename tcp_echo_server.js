'use strict'

const net = require('net');
const readline = require('readline');
const { read } = require('fs');

const server = net.createServer();

server.maxConnections = 3;

function Client(socket){
  this.socket = socket;
}

Client.prototype.writeData = function(d){
  const socket = this.socket;
  if(socket.writable){
    const key = socket.remoteAddress + '/' + socket.remotePort;
    process.stdout.write('[' + key + '] - ' + d);
    socket.write('[R] ' + d);
  }
};

const clients = {};

server.on('connection', function(socket){
  const status = server.connections + '/' + server.maxConnections;
  const key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Connection Start(' + status + ') - ' + key);
  clients[key] = new Client(socket);
});

server.on('connection', function(socket){
  let data = '';
  const newline = /\r\n|\n/;
  socket.on('data',function(chunk){

    data += chunk.toString();
    const key = socket.remoteAddress + ':' + socket.remotePort;
    if(newline.test(data)){
      clients[key].writeData(data);
      data = '';
    }
  })
});

server.on('connection', function(socket){
  const key = socket.remoteAddress + ':' + socket.remotePort;
  socket.on('end',function(){
    const status = server.connections + '/' + server.maxConnections;
    console.log('Connection End(' + status + ') - ' + key);
    delete clients[key];
  });
});

server.on('close', function(){
  console.log('Server Closed');
});

server.listen(11111, '127.0.0.1',function(){
  const addr = server.address();
  console.log('Listening Start on Server - ' + addr.address + ':' + addr.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);

rl.on('SIGINT', function(){

  for(var i in clients){
    const socket = clients[i].socket;
    socket.end();
  }
  server.close();
  rl.close();
})