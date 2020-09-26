'use strict';

const dgram = require('dgram');
const net = require('net');
const socket = dgram.createSocket('udp4');

function showUsage(){
  console.error('Usage: node udp_multicast_server.js multicast_ip port');
  process.exit();
}

function checkIP(ip){
  if(net.isIPv4(ip)){
    return ip;
  }else{
    throw new Error(ip + ' is not a IPv4 address');
  }
}

function checkPort(port){
  if((port = Number(port)) >= 0){
    return port;
  }else{
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
  socket.close();
  console.log('client ends');
}

let tmout;
socket.on('listening', function(){
  const addr = socket.address();
  console.log('Start Multicast Client - ' +
              addr.address + ':' + addr.port);
  
  const join = new Buffer('Client joins. pid=' + process.pid);

  socket.send(join, 0, join.length, m_port, m_address);

  tmou = setTimeout(function(){
    closeSocket(socket);
    }, 20 * 1000);
});

socket.on('message', function(data){
  const msg = data.toString();
  console.log(msg);

  if(msg === 'Server ends'){
    clearTimeout(tmout);
    closeSocket(socket);
  }
});

socket.bind(m_port, m_address);

socket.setMulticastTTL(1);

socket.addMembership(m_address);

