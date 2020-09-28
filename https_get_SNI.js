'use strict'

const https = require('https');
const port = 1338;
const options1 = {host: 'foo', port: port};
const req1 = https.get(options1, function(res){
  const data = '';
  res.on('data', function(chunk){
    data += chunk;
  });
  res.on('end', function(){
    console.log('foo GET:', data);
  });
});

const options2 = {host: 'foo2', port: port};
const req2 = https.get(options2, function(res){
  const data = '';
  res.on('data', function(chunk){
    data += chunk;
  });
  res.on('end', function(){
    console.log('foo2 GET:', data);
  });
});

const options3 = {host: 'foo3', port: port};
const req3 = https.get(options3, function(res){
  const data = '';
  res.on('data', function(chunk){
    data += chunk;
  });
  res.on('end', function(){
    console.log('foo3 GET:', data);
  });
});