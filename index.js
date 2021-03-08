const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
     
        //client.send(data);
        console.log(`received:`);
        console.log(data);
        
        //client.send('ping');
        client.send(data);
      
    });
  });
});