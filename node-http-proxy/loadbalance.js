const http = require('http');
const httpProxy = require('http-proxy');

const address = [
  {target: 'http://localhost:3000'},
  {target: 'http://localhost:3001'},
  {target: 'http://localhost:3002'}
];

function target(){
  const rand = Math.floor(Math.random() * (address.length));
  return address[rand];
}

httpProxy.createProxyServer(target()).listen(4000);