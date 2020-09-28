'use strict'

const http = require('http');
const server_num = 3;
const host = 'localhost';
const port_start = 10001;
const req_targets = [];
const loop_counter = 0;
const agents = {};


function printStatus(name, sockets, requests, evname){
  const requests_num = requests[name] ? requests[name].length : 0;
  const sockets_num = sockets[name] ? sockets[name].length : 0;
  console.log(name, 'conns:', sockets_num, 'waits:', requests_num, ':', evname);
  return requests_num;
}

function clientRequest(req_targets, agents){
  const max_loop_counter = 100;
  const max_requests_queue = 10;
  const name = req_targets[loop_counter % req_targets.length];
  const requests = agents[name].requests;
  const sockets = agents[name].sockets;
  const target = name.split(':');

  const req = http.get({host: target[0], port: target[1], agents: agents[name]});
  req.on('response', function(res){
    const data = '';
    res.on('data', function(res){
      data += chunk;
    });
    res.on('end', function(){
      printStatus(name, sockets, requests, 'res end: ' + data);
    });
  });

  if(printStatus(name, sockets, requests, 'http.get') >= max_requests_queue){
    console.log('===== no more new http.get() to', name, '=====');
    req_targets.splice(req_targets.indexOf(name), 1);
  }
  if(req_targets.length && loop_counter++ < max_loop_counter){
    return true;
  }else{
    return false;
  }
}

function runLoop(req_targets, agents){
  const req_interval = 0.1;
  setTimeout(function(){
    if (clientRequest(req_targets, agents)){
      runLoop(req_targets, agents);
    }
  }, req_interval * 1000);
}

for (let i = 0; i < server_num; i++){
  const name = host + ':' + port_start;

  agents[name] = new http.Agent({maxSockets: i + 1});
  req_targets.push(name);
  port_start++;
}

console.log('===== http requests with custom Agent start =====');
runLoop(req_targets, agents);