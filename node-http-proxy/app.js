const express = require('express');
const app = module.exports = express();
const port = process.argv[2];

app.get('/', function(req, res){
  const msg = 'access to pid =' + process.pid;
  console.log(msg);
  res.send(msg);
});

if(require.main === module){

  app.listen(port);
}