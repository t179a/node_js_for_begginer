'use strict'

const events = require('events');
const util = require('util');
function AsyncCB(cb){
  if(cb){
    process.nextTick(function(){
      cb();
    });
  }
}
util.inherits(AsyncCB, events.EventEmitter);
AsyncCB.prototype.setbaz = function(arg){
  this.baz = arg;
};

const foo = new AsyncCB(function(){
  foo.setbaz('bar');
  console.log(foo.baz);
})
