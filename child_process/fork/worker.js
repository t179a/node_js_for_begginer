'use strict'

console.log('worker on', process.pid);

process.on('message', function(msg){
  process.send('from worker to master');
  console.log(msg);
})