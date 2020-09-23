'use strict'

const net = require('net');
const readline = require('readline');

const server = net.createServer();
server.maxConnections = 3;

function Client(socket){
  this.counter = 0;
  this.socket = socket;
  this.t_queue = {};
  this.tmout = null;
};

Client.prototype.writeData = function(d, id){
  const socket = this.socket;
  const t_queue = this.t_queue;
  if(socket.writable){
    const key = socket.remoteAddress + ':' + socket.remotePort;
    socket.write('[R] ' + d, function(){
      delete t_queue[id];
    });
    process.stdout.write(key + ' ' + socket.byteWritten + ' bytes Written\n')
  }
};

const clients = {};

server.on('connection', function(socket){
  const status = server.connections + '/' + server.maxConnections;
  const key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Connection Start(' + status + ') - ' + key);
  clietnts[key] = new Client(socket);
  controlSocket(clients[key], 'pause', 10);
});

function controlSocket(client, action, delay){
  const socket = client.socket;
  const key = socket.remoteAddress + ':' + socket.remotePort;
  if(action === 'pause'){
    socket.pause();
    console.log(key + ' socket paused');
    client.tmout = setTimeout(function(){
      controlSocket(client, 'resume', Math.random() * 3 * 1000);
    }, delay);
  }else if(action === 'resume'){
    socket.resume();
    console.log(key + ' socket resumed');
    client.tmout = setTimeout(function(){
      controlSocket(client, 'pause', Math.random() * 10 * 1000);
    }, delay);
  }
}

server.on('connection', function(socket){
  let data = '';
  const newline = /\r\n|\n/;
  socket.on('data', function(chunk){
    data += chunk.toString();
    const key = socket.remoteAddress + ':' + socket.remotePort;
    if(newline.test(data)){
      clients[key].writeData(data);
      process.stdout.write(key + ' ' + socket.bytesRead + ' bytes Read\n');
      data = '';
    }
  });
});

server.on('connection', function(socket){
  const key = socket.remoteAddress + ':' + socket.remotePort;
  socket.on('end', function(){
    const status = server.connections + '/' + server.maxConnections;
    console.log('Connection End(' + status + ') - ' + key );
    if(clients[key].tmout){
      clearTimeout(clients[key].tmout);
    }
    delete clients[key];
  });
});

server.on('close', function(){
  console.log('Server Closed');
});

server.listen(11111, function(){
  const addr = server.address();
  console.log('Listening Start on Server - ' +
              addr.address + ':' + addr.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);

rl.on('SIGINT', function(){
  for(let i in clients){
    if(clients[i].tmout){
      clearTimeout(clients[i].socket);
    }
    const socket = clients[i].socket;
    const t_queue = clients[i].t_queue;
    socket.end();
    for(let id in t_queue){
      clearTimeout(t_queue[id]);
    }
  }
  server.close();
  rl.close();
})