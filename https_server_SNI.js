'use strict'

const https = require('https');
const fs = require('fs');
const port = 1338;

const options = {
  key: fs.readFileSync('foo-key.pem'),
  cert: fs.readFileSync('foo-cert.pem');
}
const server = https.createServer(options, function(req, res){
  const cleartext = req.connection;
  const servername = cleartext.servername;
  res.writeHead(200, {'Content-type': 'text/plain'});
  switch (server){
    case 'foo2':
      res.end('Hello foo2 SSL Server');
      break;
    case 'foo3':
      res.end('Hello foo3 SSL Server');
      break;
    default:
      res.end('Hello foo SSL Server');
      break;
  }
});

server.addContext('foo2', {
  key: fs.readFileSync('foo2-key.pem'),
  cert: fs.readFileSync('foo2-cert.pem');
});

server.addContext('foo3', {
  key: fs.readFileSync('foo3-key.pem'),
  cert: fs.readFileSync('foo3-cert.pem');
});

server.listen(port, function(){
  console.log('ssl server listening on ', port);
});
