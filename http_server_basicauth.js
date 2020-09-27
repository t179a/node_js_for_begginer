'use strict';

const http = require('http');
const host = 'localhost';
const port = 1337;
const htpasswd = {'alice': 'alicepass'};
const server = http.createServer(function(req, res){
  function showAuthContent(res, username, password){
    if(username in htpasswd && htpasswd[username] === password){
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello Authed World\n');
    }else{
      res.writeHead(403, {'Content-Type': 'text/plain'});
      res.end('Forbidden\n');
    }
  }
  if(req.headers.authorization){
    
    const header = req.headers.authorization.split(' ');
    if(header[0] === 'Basic' && header[1]){
      const data = (new Buffer(header[1], 'base64').toString()).split(':');
      showAuthContent(res, data[0], data[1]);
    }else{
      res.writeHead(403, {Content-Type: 'text/plain'});
      res.end('Forbidden\n');
    }
  }else{

    res.writeHead(401, {'Content-Type' : 'text/plain',
                  'WWW-Authenticate': 'Basic realm="Username"'});
    res.end('Authorization Required');
  }
});

server.listen(port, function(){
  console.log('listening on', host + ':' + port);
});