'use strict'

const child_process = require('child_process');
const option = {
      cwd: undefined
    , env: process.env
    , setsid: true
};

console.log('master on', process.pid);

const worker = child_process.spawn('node', ['worker.js'], option);

worker.stdout.on('data', function(data){
  console.log('stdout: ' + data);
});

worker.stderr.on('data', function(data){
  console.log('stderr: ' + data)
});

setTimeout(function(){
  worker.kill('SIGKILL');
}, 3000);

worker.on('exit', function(code, signal){
  if(signal){
    console.error(signal);

    process.exit(1);
  }
});