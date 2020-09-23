'use strict'

const net = require('net');
const readline = require('readline');
const { rootCertificates } = require('tls');

const options = {};
options.host = process.argv[2];
options.port = process.argv[3];

const client = net.createConnection(options);

client.on('error', function(e){
  console.log('Connection Failed - ' + options.host + ':' + options.port);
  console.error(e.message);
});

client.on('connect', function(){
  console.log('Connected - ' + options.host + ':' + options.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  console.log('Connection Closed - ' + options.host + ':' + options.port);
  client.end();
  rl.close();
});

client.setTimeout(1000);
client.on('timeout', function(){
  const str = '';
  for(let i = 0; i < 20000; i++){
    str += 'Hello World,';
  }
  str += '\n';
  const  ret = client.write(str);
  if(!ret){
    client.setTimeout(0);
  }
  process.stdout.write('write:' + ret + ', ' +
                        client.bytesWritten + 'byteWritten, bufferSize:' +
                        client.bufferSize + 'byte\n');
});

client.on('drain', function(){
  console.log('drain emitted');
  client.setTimeout(1000);
});

client.on('end', function(had_error){
  client.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('end', function(){
  console.log('Client Closed');
  rl.close();
});