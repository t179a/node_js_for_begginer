'use strict'

const child_process = require('child_process');
const command = 'echo "hello world"';

child_process.exec(command, function(err, stdout, stderr){
  console.log(stdout);
});