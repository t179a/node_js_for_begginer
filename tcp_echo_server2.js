'use strict'

const net = require('net');
const readline = require('readline');

const server = net.createServer();

server.maxConnections = 3;

function Client(socket){
  this.counter = 0;
  this.socket = socket;

  this.t_queue = {};
};


Client.prototype.writeData = function(d, id){
  const socket = this.socket;
  const t_queue = this.t_queue;
  if(socket.writable){
    const key = socket.remoteAddress + ':' + socket.remotePort;
    process.stdout.write('[' + key + '] - ' + d);

    socket.write('[R] ' + d, function() {
      delete t_queue[id];
    });
  }
};

const clients = {};

server.on('connecion', function(socket){
  const status = server.connections + '/' + server.maxConnections;
  const key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Connection Start(' + status + ') - ' + key);
  clients[key] = new Client(socket);
});

server.on('connection', function(socket){
  let data = '';
  const newline = /\r\n|\n/;
  socket.on('data', function(chunk){
    function writeDataDelayed(key, d){
      const client = clients[key];
      const tmout = setTimeout(function(){
        clients.writeData(d, client.counter);
      }, Math.random() * 10 * 1000);
      client.t_queue[client.counter++] = tmout;
    }
    data += chunk.toString();
    const key = socket.remoteAddress + ':' + socket.remotePort;
    if(newline.test(data)){
      writeDataDelayed(key, data);
      data = '';
    }
  });
});

server.on('connection', function(socket){
  const key = socket.remotePort + ':' + socket.remotePort;

  socket.on('end', function(){
    const status = server.connections + '/' + server.maxConnections;
    console.log('Connection End(' + status + ') - ' + key);
    delete clients[key];
  });
});

server.on('close', function(){
  console.log('Server Closed');
});

server.listen(11111, '127.0.0.1', function(){
  const addr = server.address();
  console.log('Listening Start on Server - ' +
              addr.address + ':' + addr.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);

rl.on('SIGINT', function(){
  for(let i in clients){
    const socket = clients[i].socket;
    const t_queue = clients[i].t_queue;
    socket.end();
    for(let id in t_queue){
      clearTimeout(t_queue[id]);
    }
  }
  server.close();
  rl.close();
});



