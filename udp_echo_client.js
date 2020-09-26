'use strict'

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const readline = require('readline');
const { clearTimeout } = require('timers');

const host = 'localhost';
const port = 30922;
const interval = 1000;

socket.on('message', function(msg, rinfo){
  console.log(rinfo.size + ' bytes received from ' + rinfo.address + ':' + rinfo.port);
  console.log(msg.toString());
});

socket.on('close', function(){
  console.log('UDP socket closed.');
});

const tmout = setInterval(function(){
  const buf = new Buffer('Hello World');
  socket.send(buf, 0, buf.length, port, host, function(){

  });
}, interval);

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  clearTimeout(tmout);
  socket.close();
  rl.close();
});