const connect = require('connect');
const http = require('http');

const app = connect();

const log = function(req, res, next){
  console.log(req.url);
  next();
};

const routing = function(req, res, next){
  if(req.url === '/route2'){
    return next();
  }
  const msg = 'GET /';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': msg.length
  });
  res.end(msg);
};

const routing2 = function(req, res, next){
  const msg = 'GET /route2';
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': msg.length
  });
  res.end(msg);
};

app.use(log);
app.use(routing);
app.use(routing2);


http.createServer(app).listen(3000);

