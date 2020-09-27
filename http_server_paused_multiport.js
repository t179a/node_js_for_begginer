'use strict'

const http = require('http');
const { SSL_OP_CRYPTOPRO_TLSEXT_BUG } = require('constants');
const servers = {};
const server_num = 3;
const host = 'localhost';
const port_start = 10001;

function createServer(servers, port){
  const name = host + ':' + port;
  servers[name] = http.createServer(function(req, res){
    const max_res_delay = 10;
    const delay = Math.floor(max_res_delay * Math.random());

    setTimeout(function(){
      res.writeHead(200, {'Content-Type' : 'text/plain'});
      res.end('Delayed ' + delay + '[sec]');
    }, delay * 1000)
  });
}

for (const i = 0; i < server_num; i++){
  createServer(servers, port_start++);
}