'use strict'

const child_process = require('child_process');
console.log('master on', process.pid);

const worker = child_process.fork(__dirname + '/worker.js');

worker.send('from master to worker');

worker.on('message', function(msg){
  console.log(msg);

  worker.kill('SIGKILL');
});