'use strict'

const http = require('http');
const port = 1337;
const obj = {};
const server = http.createServer(function(req,res){
  const remoteAddress = req.connection.remoteAddress;
  const header = {'Connection': 'close', 'Content-Length':0};
  const key = req.url;

  switch(req.method){

    case 'POST':
      if(obj[key]){
        res.writeHead(403, header);
        res.end();
      }else{
        const data = '';
        req.on('data', function(chunk){
          data += chunk;
        });
        req.on('end', function(){
          try {
            obj[key] = JSON.parse(data);
            res.writeHead(200, header);
            console.log('POST', key, obj[key], ' from ' + remoteAddress);
          } catch(e){
            res.writeHead(400, e.message, header);
          }
          res.end()
        });
      }
      breadk;

    case 'GET':
      if(obj[key]){
        const json = JSON.stringify(obj[key]);
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(json),
          'Content-Type': 'application/json',
          'Connection': 'close'
        });
        res.write(json);
        console.log('GET', key, 'from ' + remoteAddress);
      }else{
        res.writeHead(404, header);
      }
      res.end();
      break;

    case 'PUT':
      if(obj[key]){
        const data = '';
        req.on('data', function(chunk){
          data += chunk;
        });
        req.on('end', function(){
          try{
            obj[key] = JSON.parse(data);
            res.writeHead(200, header);
            console.log('PUT', key, obj[key], ' from ' + remoteAddress);
          }catch(e){
            res.writeHead(400, e.message, header);
          }
          res.end()
        });
      }else{
        res.writeHead(403, header);
        res.end();
      }
      break;

      case 'DELETE':
        if(obj[key]){
          delete obj[key];
          res.writeHead(200, header);
          console.log('DELETE', key, ' from ' + remoteAddress);
        }else {
          res.writeHead(404, header);
        }
        res.end();
        break;
  }
});

server.on('error', function(e){
  console.log('Client Error', e.message);
});

server.listen(port, function(){
  console.log('listening on ' + port);
});