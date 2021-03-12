const WebSocket = require('ws');

const port = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: port });

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