'use strict';

const http = require('http');
const options = {host: 'localhost', port: 1337, auth: 'alice:alicepass'};

const req = http.request(options, function(res){
  const data = '';
  res.on('data', function(chunk){
    data += chunk;
  });
  res.on('end', function(){
    console.log('==== Response Data ====');
    console.log(data);
  });
});

req.end();

req.on('socket', function(socket){
  console.log('==== Socket Data ====');
  socket.on('data', function(chunk){
    console.log(chunk.toString());
  });
});