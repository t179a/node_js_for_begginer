'use strict'

const child_process = require('child_process');
const command = '/bin/echo';
const args = ['hello world'];

child_process.execFile(command, args, function(err, stdout, stderr){
  console.log(stdout);
});