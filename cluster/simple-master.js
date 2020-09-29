const cluster = require('cluster');
const server = require('./simple-worker');
const port = process.argv[2];

if(cluster.isMaster){
  console.log('master:', process.pid);
  for(let i = 0; i < 4; i++){
    const worker = cluster.fork();
  }
}

if(cluster.isWorker){
  server.listen(port);
}