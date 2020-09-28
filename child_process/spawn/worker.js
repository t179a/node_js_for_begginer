'use strict'

setInterval(function(){
  console.log('worker on', process.pid);
},500);