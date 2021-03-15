const WebSocket = require('ws');

const port = process.env.PORT || 8080;

sprites = [
  {
    'uid' : '12345',
    'name' : 'monster',
    'top' : '100',
    'left' : '200'
  }
]

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    wss.clients.forEach(function each(client) {
     
        //client.send(data);
        console.log(`received:`);
        console.log(data);
        let tempPlayer = JSON.parse(data);
        sprites.pop(tempPlayer)
        console.log(sprites)
        // add player data to sprites array
        // check if the sprites array already has unique
       
        client.send(JSON.stringify(sprites));
      
    });
  });
});