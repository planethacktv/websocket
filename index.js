const e = require('express');
const WebSocket = require('ws');

const port = process.env.PORT || 8080;

sprites = {
  'monster1' : {
    'uid' : '12345',
    'name' : 'BadGuyNPC',
    'top' : '5',
    'left' : '5',
    'health': 1000,
    'color' : '#00CC00',
    'type': 'NPC' 
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
        sprites.monster1 = monsterMove(sprites.monster1)
        // add player data to sprites array
        // check if the sprites array already has unique
       
        client.send(JSON.stringify(sprites));
      //}
    });
  });
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function monsterMove(monster){
  let movements = [-1,1,0]
  if(monster.top == 100){
    monster.top = 99
  } else if (monster.top == 0){
    monster.top = 1
  } else {
    monster.top = monster.top + movements[getRandomInt(movements.length)]
  }
  if(monster.left == 100){
    monster.left = 99
  } else if (monster.left == 0){
    monster.left = 1
  } else {
    monster.left = monster.left + movements[getRandomInt(movements.length)]
  }

  return monster
}

