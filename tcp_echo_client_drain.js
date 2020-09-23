'use strict'

const net = require('net');
const readline = require('readline');

const options = {};
options.host = process.argv[2];
options.port = process.argv[3];

const client = net.connect(options);

client.on('error', function(e){
  console.error('Connection Failed - ' + options.host + ':' + options.port);
});

client.on('connect', function(){
  console.log('Connection Failed - ' + options.host + ':' + options.port);
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
  const ret = client.write(str);
  process.stdout.write('write:' + ret + ', ' +
                        client.bytesWritten + 'byteWritten, bufferSize:' +
                        client.bufferSize + 'byte\n');
});

client.on('drain' function(){
  console.log('drain emitted');
});

client.on('end',function(had_error){
  client.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('close', function(){
  console.log('Client Closed');
  rl.close()
})