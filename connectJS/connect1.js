const connect = require('connect');
const http = require('http');


const app = connect();

const routing = function(req, res, next){
  const msg = 'Hello World!!!!';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-length': msg.length
  });
  res.end(msg);
};

app.use(routing);

http.createServer(app).listen(3000);