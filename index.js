const WebSocket = require('ws');

const port = process.env.PORT || 8080;

sprites = {
  'monster1' : {
    'uid' : '12345',
    'name' : 'monster',
    'top' : '5',
    'left' : '5',
    'health': 1000,
    'color' : '#00CC00'
  }
}

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws, request, client) {
  
  ws.on('message', function incoming(data) {
    
    console.log(`Received message ${data} from user ${client}`);
    
    wss.clients.forEach(function each(client) {
     // if (client !== ws && client.readyState === WebSocket.OPEN) {
  
        let tempPlayer = JSON.parse(data);
        if(tempPlayer.health <= 0){
          delete sprites[tempPlayer.uid]  
        } else {
          sprites[tempPlayer.uid] = tempPlayer
        }
        // add player data to sprites array
        // check if the sprites array already has unique
       
        client.send(JSON.stringify(sprites));
      //}
    });
  });
});