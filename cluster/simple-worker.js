const http = require('http');
const port = process.argv[2];

const server = http.createServer(function(req, res){
  const msg = 'access to pid = ' + process.pid;
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log(msg);
  res.end(msg);
});

module.exports = server;

if(require.main === module){

  server.listen(port);
};