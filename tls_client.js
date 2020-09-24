'use strict'

const tls = require('tls');
const fs = require('fs');

const options = {};
options.host = process.argv[2];
options.port = process.argv[3];

function connectWithoutCA(){
  const cleartext1 = tls.connect(options);
  cleartext1.on('error', function(e){
    console.log('Failed to connect in cleartext1 - ' +options.host + ':' + options.port);
    console.log(e.message);
  });

  cleartext1.on('secureConnect', function(){
    const cipher = cleartext1.getCipher();
    const cipher_info = cipher.name + ' ' + cipher.version;
    console.log('cleartext1 Connect - ' + options.host + ':' + options.port + ' ' +
    cipher_info );
    console.log('cleartext1 Authorization Result = ' + cleartext1.authorized);
    console.log('cleartext1 Authorization Error = ' + cleartext1.authorizationError);
    cleartext1.write('cleartext1: Hello');
    cleartext1.on('data', function(chunk){
      console.log(chunk.toString());
      cleartext1.end();
    });

    cleartext1.on('end', function(had_error){
      console.log('cleartext1 Connection End - ' + options.host + ':' + options.port);
      connectWithCA();
    });
  });
}

function connectWithCA(){
  options.ca = fs.readFileSync('server-cert.pem');
  const cleartext2 = tls.connect(options);

  cleartext2.on('error', function(){
    console.log('cleartext2 Connection Start - ' + options.host + ':' + options.port);
    console.log(e.message);
  });

  cleartext2.on('secureConnect', function(){
    const cipher = cleartext2.getCipher();
    const cipher_info = cipher.name + ' ' + cipher.version;
    console.log('cleartext2 Connect - ' + options.host + ':' + options.port + ' ' +
    cipher_info);
    console.log('cleartext2 Authorization Result = ' + cleartext2.authorized);
    console.log('cleartext2 Authorization Error = ' + cleartext2.authorizationError);
    cleartext2.write('cleartext2: Hello');
    cleartext2.on('data'function(chunk){
      console.log(chunk.toString());
      cleartext2.end();
    });

    cleartext2.on('end', function(had_error){
      console.log('cleartext2 Connection End - ' + options.host + ':' + options.port);
    });
  });
}

connectWithoutCA();