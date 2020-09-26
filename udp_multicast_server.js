'use strict'

const dgram = require('dgram');
const net = require('net');
const { arch } = require('os');

const socket = dgram.createSocket('udp6');

function showUsage(){
  console.error('Usage: node udp_multicast_server.js multicast_ip port');
  process.exit();
}

function checkIP(ip){
  if(net.isIPv4(ip)){
    return ip;
  }else {
    throw new Error(ip + 'is not a IPv4 address');
  }
}

function checkPort(port){
  if((port = Number(port)) >= 0){
    return port;
  }else {
    throw new Error(port + ' is not a port number');
  }
}

if(process.argv[2]){
  const m_address = checkIP(process.argv[2]);
}else{
  showUsage();
}

if(process.argv[3]){
  const m_port = checkPort(process.argv[3]);
}else{
  showUsage();
}

function closeSocket(socket){
  const end_msg = 'Server ends';
  const end = new Buffer(end_msg);
  socket.send(end, 0, end.length, m_port, m_address, function(){
    console.log(end_msg);
    socket.close();
  });
}

function multicastSend(i){
  maxcall = 10;
  if(i > maxcall){
    closeSocket(socket);
    return;
  }
  const hello = new Buffer(i + ': hello from server pid=' + process.pid);

  setTimeout(function(){
    socket.send(hello, 0, hello.length, m_port, m_address);
    multicastSend(++i);
  }, 1000);
}

socket.on('listening', function(data){
  const addr = socket.address();
  console.log('Start Multicast Server - ' +
              addr.address + ':' + addr.port);
  const join = new Buffer('Server joins. pid=' + process.pid);

  socket.send(join, 0, join.length, m_port, m_address);
  multicastSend(0);
});

socket.on('message', function(data){
  console.log(data.toString());
});

socket.bind(m_port, m_address);

socket.setMulticastTTL(1);

socket.addSourceSpecificMembership(m_address);

