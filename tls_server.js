'use strict'

const tls = require('tls');
const fs = require('fs');
const readline = require('readline');

const server = tls.createServer({
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
});
server.maxConnections = 3;

function Client(cleartextStream){
  this.cleartextStream = creartextStream;
}

Client.prototype.writeData = function(d){
  const cleartextStream = this.cleartextStream;
  if(cleartextStream.writable){
    const key = cleartextStream.remoteAddress + ':' + cleartextStream.remotePort;
    console.log('[' + key + '] - ' + d.toString());
    cleartextStream.write(d);
  }
};

const clients= {};

server.on('secureConnection', function(cleartextStream){
  const status = server.connections + '/' + server.maxConnections;
  const key = cleartextStream.remoteAddress + ':' + creartextStream.remotePort;

  const cipher = cleartextStream.getCipher();
  const cipher_info = cipher.name + ' ' + cipher.version;
  console.log('Start TLS Connection(' + status + ') - ' + key + ' ' + cipher_info);
  clients[key] = new Client(cleartextStream);
  cleartextStream.on('error', function(e){
    console.log(e.message);
  });
});

server.on('secureConnection', function(cleartextStream){
  cleartextStream.on('data', function(chunk){
    const key = cleartextStream.remoteAddress + ':' + cleartextStream.remotePort;
    clients[key].writeData(chunk);
  });
});

server.on('secureConnection', function(cleartextStream){
  const key = cleartextStream.remoteAddress + ':' +cleartextStream.remotePort;
  cleartextStream.on('end' function(){
    const status = server.connections + '/' + server.maxConnections;
    console.log('TLS Connection End(' + status + ') - ' + key);
    delete clients[key];
  }) ;
});

server.listen(3333, function(){
  const addr = server.address();
  console.log('Listening Start on TLS Server -' +
              addr.address + ':' + addr.port);
});

server.on('close', function(){
  const addr = server.address();
  console.log('Listening Start on TLS Server - ' +
              addr.address + ':' + addr.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  for(let i in clients){
    const cleartextStream = clients[i].creartextStream;
    cleartextStream.end();
  }
  server.close();
  rl.close();
});
