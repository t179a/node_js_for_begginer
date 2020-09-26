'use strict'

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const readline = require('readline');

const host = 'localhost';
const port = 30922;

socket.on('listening', function(){
  const addr = socket.address();
  console.log('UDP socket listening on ' + addr.address + ':' + addr.port);
});

socket.on('message', function(msg, rinfo){
  console.log(rinfo.size + ' bytes received from ' + rinfo.address + ':' + rinfo.port);
  console.log(msg.toString());
  socket.send(msg, 0, msg.length, rinfo.port, rinfo.address);
});

socket.on('close', function(){
  console.log('UDP socket closed.')
});

socket.bind(port, host);

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  socket.close();
  rl.close();
});