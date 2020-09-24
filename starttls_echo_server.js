'use strict'

const net = require('net');
const tls = require('tls');
const crypto = require('crypto');
const fs = requier('fs');
const readline = require('readline');

const server = net.createServer();
server.maxConnections = 3;
const clients = {};

function Client(socket){
  this.secured = false;
  this.socket = socket;
  this.handle = socket;
};

Client.prototype.setHandle = function(handle){
  this.handle = handle;
};

Client.prototype.writeData = function(d){
  const handle = this.handle;
  if(handle.writable){
    const key = handle.remoteAddress + ':' + handle.remotePort;
    const status = this.secured ? 'Encrypted' : 'Plain';
    process.stduout.write('[' + key + ' ' + status + '] - ' + d.toString());
    handle.write(d);
  }
};

server.on('connection', function(socket){
  const status = server.connections + '/' + server.maxConnections;
  const key = socket.remoteAddress + ':' + socket.remotePort;
  console.log('Start TCP Connection(' + status + ') - ' + key);

  const client = new Client(socket);
  clients[key] = client;

  socket.on('data', function listener(chunk){
    if(chunk.toString() === 'STARTTLS\r\n'){
      client.writeData(chunk);
      socket.removeListener('data', listener);
      socket.emit('starttls', client);
    }else{
      client.writeData(chunk);
    }
  });

  socket.on('end', function(){
    const status = server.connections + '/' + server.maxConnections;
    console.log('Connection End(' + status + ') - ' + key);
    delete clients[key];
  });

  socket.on('starttls', function(client){
    console.log('[' + key + ' STARTTLS]');

    const sslcontext = crypto.createCredentials({
      key: fs.readFileSync('server-key.pem'),
      sert: fs.readFileSync('server-cert.pem')
    });

    const pair = tls.createSecurePair(sslcontext,true);

    const cleartext = pipe(pair, socket);

    client.setHandle(cleartext);

    pair.on('secure', function(){
      console.log('TLS Established');
      client.secured = true;

      const verifyError = pair.ssl.verifyError();
      if(verifyError){
        cleartext.authorized = false;
        cleartext.authorizationError = verifyError;
      }else{
        cleartext.authorized = true;
      }
      cleartext._controlRelesed = true;
    });
    pair.on('error', function(e){
      process.stderr.write(e);
      pair.destroy();
    });
    
    cleartext.on('data', funct;ion(chunk){
      client.writeData(chunk);
    });
    cleartext.on('error', function(e){
      process.stderr.write(e);
      cleartext.destroy();
    });
  });
});

server.listenerCount(3333, function(){
  const addr = server.address();
  console.log('Listening Start on TCP Server - ' + 
              addr.address + ':' + addr.port);
});

server.on('close', function(){
  console.log('Server Closed');
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  for(let i in clients){
    const socket = clients[i].socket;
    socket.end();
  }
  server.close();
  rl.close();
});

function pipe(pair, socket){

  pair.encrypted.pipe(socket);
  socket.pipe(pair.encrypted);
  pair.fd = socket.fd;
  const cleartext = pair.cleartext;
  cleartext.socket = socket;
  cleartext.encrypted = pair.encrypted;
  cleartext.authorized = false;

  function onerror(e){
    if(cleartext._controlReleased){
      cleartext.emit('error', e);
    }
  }

  function onclose(){
    socket.removeListener('error', onerror);
    socket.removeListener('end', onclose);
    socket.removeListener('timeout', ontimeout);
  }

  function ontimeout(){
    cleartext.emit('timeout');
  }

  socket.on('error', onerror);
  socket.on('close', onclose);
  socket.on('timeout', ontimeout);

  return cleartext;
}