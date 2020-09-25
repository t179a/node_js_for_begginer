'use strict'

const net = require('net');
const tls = require('tls');
const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');
const { clear } = require('console');

const options = {};
options.host = process.argv[2];
options.port = process.argv[3];

function Client(socket){
  this.secured = false;
  this.handle = socket;
}

Client.prototype.setHandle = function(handle){
  this.handle = handle;
};

Client.prototype.writeData = function(d){
  const handle = this.handle;
  if(handle.writable){
    const status = this.secured ? 'Encrypted' : 'Plain';
    process.stdout.write('[' + status + ' S] ' + d);
    handle.write(d);
  }
};

const socket = net.connect(options);
const client = new Client(socket);

socket.on('error', function(){
  console.log('Connection Failed - ' + options.host + ':' + options.port);
  console.error(err);
});

socket.on('connect', function(){
  console.log('Connected - ' + options.host + ':' + options.port);

  setTimeout(function(){
    client.writeData('STARTTLS\r\n');
  }, 3500);
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  console.log('Closing - ' + options.host + ':' + options.port);
  socket.end();
  rl.close();
});

const i = 0;
socket.setTimeout(1000);

socket.on('timeout', function(){
  const str = i + ': Hello World\n';
  client.writeData(str);
  i = i + 1;
});

socket.on('data', function listener(chunk){
  process.stdout.write('[Plain R] ' + chunk);

  if(chunk.toString() === 'STARTTLS\r\n'){
    socket.removeListener('data', listener);
    socket.emit('starttls', client);
  }
});

socket.on('starttls', function(client){
  console.log('STARTTLS');

  const sslcontext = crypto.createCredentials({
    ca: fs.readFileSync('server-cert.pem')
  });

  const pair = tls.createSecurePair(sslcontext, false);

  const cleartext = pipe(pair, socket);

  client.setHandle(cleartext);

  pair.on('secure', function(){
    console.log('TLS Established');
    client.secured = true;
    const verifyError = pair.ssl.verifyError();
    if(verifyError){
      cleartext.auhthorized = false;
      cleartext.authorizationError = verifyError;
    }else{
      cleartext.authorized = true;
    }
    cleartext._controlReleased = true;
    console.log('TLS Established. authorized:' + cleartext.authorized);
  });

  cleartext.on('data', function(chunk){
    process.stdout.write('[ Encrypted R] ' + chunk);
  })
});

socket.on('end', function(had_error){
  socket.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

socket.on('close', function(){
  console.log('Socket Closed');
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
