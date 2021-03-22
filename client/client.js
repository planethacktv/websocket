player = {
  uid: '',
  name: '',
  left: 0,
  top: 200,
  color: '#000000',
  classes: '',
  health: 100
};

playerGamepad = false;

// Game pad logic

window.addEventListener("gamepadconnected", (event) => {
  console.log("A gamepad connected:");
  console.log(event.gamepad);
  playerGamepad = true;
});
window.addEventListener("gamepaddisconnected", (event) => {
  console.log("A gamepad disconnected:");
  console.log(event.gamepad);
  playerGamepad = false;
});

oldPlayerPosition = {x:0,y:0}
const serverFPS = 10;
let serverTick;
const gameField = document.querySelector('#gameField');
const gameHeight = 500; // pixel based
const gameWidth = 100; // percentage based
const globalts = Date.now()
const serverHost = 'ws://game-web-proxy-wekkejvrgq-uc.a.run.app/'
const healthLoss = 5

 //const serverHost = 'ws://localhost:8080/'
function stringToHash(string) { 
                  
  var hash = 0; 
    
  if (string.length == 0) return hash; 
    
  for (i = 0; i < string.length; i++) { 
      char = string.charCodeAt(i); 
      hash = ((hash << 5) - hash) + char; 
      hash = hash & hash; 
  } 
    
  return hash; 
} 


(function () {
  
   
    const messages = document.querySelector('#messages');
    const playerList = document.querySelector('#playerList');
    const wsButton = document.querySelector('#wsButton');
    const wsSendButton = document.querySelector('#wsSendButton');
    const textInput = document.querySelector('#text1');
    const logout = document.querySelector('#logout');
    const login = document.querySelector('#login');
    const character = document.querySelector('#character1');
    const rightArrow = document.querySelector('#rightArrow');
    const leftArrow = document.querySelector('#leftArrow');
    const bButton = document.querySelector('#bButton');
    const aButton = document.querySelector('#aButton');


    function showMessage(message) {
      messages.textContent += `\n${message}`;
      messages.scrollTop = messages.scrollHeight;
    }
  
    function handleResponse(response) {
      return response.ok
        ? response.json().then((data) => JSON.stringify(data, null, 2))
        : Promise.reject(new Error('Unexpected response'));
    }

    function getPlayerSprite(){
      return document.getElementById(player.uid)
    }

    // player controls
    function playerMoveDown(){
      player.classes = 'sprite-move-down'
      let tempValue = player.top + 1
      if(tempValue > 90){
        tempValue = 90;
      }
      
      player.top = tempValue;
    }
    function playerMoveUp(){
      player.classes = 'sprite-move-up'
      let tempValue = player.top - 1
      if(tempValue < 0){
        tempValue = 0;
      }
      player.top = tempValue;
    }
    function playerMoveRight(){
      player.classes = 'sprite-move-right'
      let tempValue = player.left + 1
      if(tempValue > 96){
        tempValue = 96;
      }
      player.left = tempValue;
    }
    function playerMoveLeft(){
      player.classes = 'sprite-move-left'
      let tempValue = player.left - 1
      if(tempValue < 0){
        tempValue = 0;
      }
      player.left = tempValue;
    }

    function teleport(x,y){
      
      player.top = y
      player.left = x
    }

    function teleportRandom(){
      oldPlayerPosition = {
        x: player.left,
        y: player.top,
      }
      let randomTS = Date.now()
      let x = randomTS % 100
      randomTS = Date.now()
      let y = randomTS % 100
      teleport(x,y);
      showMessage(player.name + ' teleported!')
    }
    function teleportBack(){
      console.log(oldPlayerPosition);
      teleport(oldPlayerPosition.x,oldPlayerPosition.y);
    }
    
    rightArrow.onclick = () => playerMoveRight();
    leftArrow.onclick = () => playerMoveLeft();
    upArrow.onclick = () => playerMoveUp();
    downArrow.onclick = () => playerMoveDown();
    bButton.onclick = () => teleportBack();
    aButton.onclick = () => teleportRandom();


    window.addEventListener("keydown", function(event) { 
      if (event.defaultPrevented) { 
        return; // Do nothing if event already handled 
      } 
      
      switch(event.code) { 
        case "ArrowUp":
          event.preventDefault()
          playerMoveUp();
          break;
        case "ArrowRight":
          event.preventDefault()
          playerMoveRight();
          break;
        case "ArrowLeft":
          event.preventDefault()
          playerMoveLeft();
          break;
        case "ArrowDown":
          event.preventDefault()
          playerMoveDown();
          break;
        case "Space":
          event.preventDefault()
          teleportRandom();
          break;  
        case "Enter":
              event.preventDefault()
              teleportBack();
              break;      
      }
    });
 
  
    let ws;
  
    function isPlayerDead(player, ws){
      if(player.health <= 0 ){
        showMessage(`Player ${player.name} died!`);
 
        return true
      }
      return false
    }

    wsButton.onclick = function () {
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
      }
  
      ws = new WebSocket(serverHost);
      ws.onerror = function () {
        showMessage('WebSocket error');
      };

      // player spawn in
      ws.onopen = function () {
        let ts = Date.now()
        let uid = md5(navigator.userAgent+globalts)
        let mes = `Hello World! ${ts} ${textInput.value}`
        player.uid = 'player'+uid
        player.health = 100
        player.name = textInput.value
        player.color = Math.floor(Math.random()*16777215).toString(16);
        player.top = ts % 100
        player.left = ts % 100
        showMessage('Joined the game!');
        // repeating server tick interval begins
        serverTick = setInterval(function() {
           ws.send(JSON.stringify(player)); // if(!isPlayerDead(player, ws))
        }, (1000 / serverFPS) );
      };

      ws.onclose = function () {
        showMessage('WebSocket connection closed');
        ws = null;
      };

      ws.onmessage = function(event){
        let payload = JSON.parse(event.data);
          
          reRenderSprites(payload);
          updatePlayerList(payload);
        
      };
  
    };
  
    // exiting the gmae 
    logout.onclick = function () {
      if (!ws) {
        showMessage('No WebSocket connection');
        return;
      }
      clearInterval(serverTick);
      showMessage('Left the Game');
      ws.close();
      ws = false
    };

    wsSendButton.onclick = function () {
      if (!ws) {
        showMessage('No WebSocket connection');
        return;
      }
      let ts = Date.now()
      player.name = textInput.value
      player.color = Math.floor(Math.random()*16777215).toString(16);

      // let ts = Date.now()
      // let mes = `Hello World! ${ts} ${textInput.value}`
      // ws.send(mes);
      // showMessage('Sent "' + mes +'"');
    };

    // ws.onmessage = function(){
    //   showMessage('Pong');
    // };

    


    function collisionDetection(player, sprites){
      let hit = false;
      Object.keys(sprites).forEach(key => {
        let tempSprite = sprites[key];
        // verifying its not colliding with itself
        if(player.uid != tempSprite.uid){
          //showMessage('checking'+player.top + ' ' + tempSprite.top)
          if(player.top == tempSprite.top && player.left == tempSprite.left) hit = true;
        }
      })
  
      return hit;
    }
  
    function makeSprite(spriteObj){
      // sprite body
      let spriteDiv = document.createElement("div");
      spriteDiv.classList.add('sprite');
      if(spriteObj.classes != ''){
        spriteDiv.classList.add(spriteObj.classes);
      }
      spriteDiv.id = spriteObj.uid
      spriteDiv.style.top = spriteObj.top +'%';
      spriteDiv.style.left = spriteObj.left+'%';
      spriteDiv.style.backgroundColor = '#'+spriteObj.color;
      
      // sprite face
      let face = document.createElement("span");
      face.innerText = "|:)"
      spriteDiv.appendChild(face);
  
      // sprite health bar
      let healthBar = document.createElement("div");
      healthBar.classList.add('healthbar')
      healthBar.style.height = spriteObj.health + '%'
      spriteDiv.appendChild(healthBar);

      // sprite name tag
      let nameTag = document.createElement("div");
      let name = document.createTextNode(spriteObj.name);
      nameTag.appendChild(name);
      nameTag.classList.add('name-tag')
      spriteDiv.appendChild(nameTag);
      
      gameField.appendChild(spriteDiv);
    }
    function reRenderSprites(spriteList){
      gameField.innerHTML=''; // clear the field

      let gp 
      if(playerGamepad){
        var gamepads = navigator.getGamepads();
        
        gp = gamepads[0]
        // right
        if(gp.buttons[15].pressed == true) playerMoveRight()
        // left
        if(gp.buttons[14].pressed == true) playerMoveLeft()
        // up
        if(gp.buttons[12].pressed == true) playerMoveUp();
        // down
        if(gp.buttons[13].pressed) playerMoveDown();
        // start
        if(gp.buttons[8].pressed == true) showMessage('Game Started');
        // A
        if(gp.buttons[0].pressed) teleportRandom();
        // B
        if(gp.buttons[1].pressed) teleportBack();
        
      }

      Object.keys(spriteList).forEach(key => {
        //console.log(key, spriteList[key]);
        makeSprite(spriteList[key])
      
        if(collisionDetection(spriteList[key],spriteList)){
          if(spriteList[key].uid = player.uid) {
            player.health = player.health - healthLoss;
            if(playerGamepad){
              gp.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 500,
                weakMagnitude: 1.0,
                strongMagnitude: 1.0
              });
            }
          }
          showMessage(spriteList[key].name + ' collided!!!!')
        }
  
      });
      // character.style.left = payload[player.uid].left + 'px';
      // character.style.top = payload[player.uid].top + 'px';
    }
    

    function updatePlayerList(players) {
      playerList.innerHTML = '';
      Object.keys(players).forEach(key => {
        //if(/player/.test(players[key].uid)) { // add to only show players
          playerList.innerHTML += `[${players[key].name}] - hp:${players[key].health} x:${players[key].left} y:${players[key].top} <br>`
        //}
      });
    }


  })();

  