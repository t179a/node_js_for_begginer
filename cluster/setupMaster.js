const cluster = require('cluster');

if(cluster.isMaster){
  console.log('master:', process.pid);
  cluster.setupMaster({
    exec: 'simple-worker.js',
    args: [3000]
  });
  for(let i = 0; i < 4; i++){
    const worker = cluster.fork();
  }
}