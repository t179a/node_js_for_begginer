'use strict'

const net = require('net');
const readline = require('readline');
const { connect } = require('http2');

const options = {};

options.host = process.argv[2];
options.port = process.argv[3];

const client = net.connect(options);

client.on('error', function(e){
  console.error('Connection Failed - ' + options.host + ':' + options.port);
})

client.on('connect', function(){
  console.log('Connected - ' + options.host + ':' + options.port);
});

const rl = readline.createInterface(process.stdin, process.stdout);
rl.on('SIGINT', function(){
  console.log('Connection Closed - ' + options.host + ':' + options.port);
  client.end();
  rl.close();
});

let i = 0;

client.setTimeout(1000);
client.on('timeout', function(){
  const str = i + ': Hello World\n';
  process.stdout.write('[S] ' + str);
  client.write(str);
  i = i + 1;
});


client.on('data', function(chunk) {
  process.stdout.write(chunk.toString());
});

client.on('end', function(had_error){
  client.setTimeout(0);
  console.log('Connection End - ' + options.host + ':' + options.port);
});

client.on('close', function(){
  console.log('Client Closed');
  rl.close();
})