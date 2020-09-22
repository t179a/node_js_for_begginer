'use strict'

const net = require('net');
const server = net.createServer();

server.maxConnections = 3;

function Data(d){
  this.data = d;
  this.responded = false;
}

function Client(socket){
  this.counter = 0;
  this.socket = socket;
  this.t_queue = {};
  this.w_queue = [];
}

Client.prototype.writeData = function(d, id){
  const socket = this.socket;
  const w_queue = this.w_queue;
  const t_queue = this.t_queue;
  if(w_queue[0].data !== d) return;

  while(w_queue[0] && w_queue[0].responded){
    const w_data = w_queue.shift().data;
    if(socket.writable){
      const key = socket.remoteAddress + ':' + socket.remotePort;
      process.stdout.write('[' + key + '] - ' + w_data );
      socket.write('[R] ' + w_data, function(){
        delete t_queue[id];
      });
    }
  }
}

server.on('connection', function(socket){
  const status = server.connections + '/' + server.maxConnections;
  const key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Connection Start(' + status + ') - ' + key);
  clients[key] = new Client(socket);
});

server.on('connection', function(socket){
  let data = '';
  let newline = /\r\n|\n/;
  socket.on('data',function(chunk){
    function writeDataDelayed(key,d){
      const client = clients[key];
      const d_obj = new Data(d);
      client.w_queue.push(d_obj);
      const tmout = setTimeout(function(){
        d_obj.responded = true;
        client.writeData(d_obj.data, client.counter);
      }, Math,random() * 10 * 1000);
      client.t_queue[client.counter++] = tmout;
    }

    data += chunk.toString();
    const key = socket.remotePort + ':' + socket.remotePort;
    if(newline.test(data)){
      writeDataDelayed(key, data);
      data = '';
    }
  });
})

server.on('connection', function(socket){
  const key = socket.remotePort + ':' + socket.remotePort;
  socket.on('end', function(){
    const status = server.connections + ':' + server.maxConnections;
    console.log('Connection End(' + status + ') -' + key);
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

const readline = require('readline');
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