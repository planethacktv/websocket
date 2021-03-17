player = {
  uid: '',
  name: '',
  left: 0,
  top: 200,
  color: '#000000'
};



const gameField = document.querySelector('#gameField');
const gameHeight = 500; // pixel based
const gameWidth = 100; // percentage based
const globalts = Date.now()

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
    const serverHost = 'ws://game-web-proxy-wekkejvrgq-uc.a.run.app/'
    //const serverHost = 'ws://localhost:8080/'
    const messages = document.querySelector('#messages');
    const wsButton = document.querySelector('#wsButton');
    const wsSendButton = document.querySelector('#wsSendButton');
    const textInput = document.querySelector('#text1');
    const logout = document.querySelector('#logout');
    const login = document.querySelector('#login');
    const character = document.querySelector('#character1');
    const rightArrow = document.querySelector('#rightArrow');
    const leftArrow = document.querySelector('#leftArrow');


    function showMessage(message) {
      messages.textContent += `\n${message}`;
      messages.scrollTop = messages.scrollHeight;
    }
  
    function handleResponse(response) {
      return response.ok
        ? response.json().then((data) => JSON.stringify(data, null, 2))
        : Promise.reject(new Error('Unexpected response'));
    }

    // player controls
    function playerMoveDown(){
      let tempValue = player.top + 1
      if(tempValue > 90){
        tempValue = 90;
      }
      player.top = tempValue;
    }
    function playerMoveUp(){
      let tempValue = player.top - 1
      if(tempValue < 0){
        tempValue = 0;
      }
      player.top = tempValue;
    }
    function playerMoveRight(){
      let tempValue = player.left + 1
      if(tempValue > 96){
        tempValue = 96;
      }
      player.left = tempValue;
    }
    function playerMoveLeft(){
      let tempValue = player.left - 1
      if(tempValue < 0){
        tempValue = 0;
      }
      player.left = tempValue;
    }
    
    rightArrow.onclick = () => playerMoveRight();
    leftArrow.onclick = () => playerMoveLeft();
    upArrow.onclick = () => playerMoveUp();
    downArrow.onclick = () => playerMoveDown();


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
      }
    });
  
    // login.onclick = function () {
    //   fetch('/login', { method: 'POST', credentials: 'same-origin' })
    //     .then(handleResponse)
    //     .then(showMessage)
    //     .catch(function (err) {
    //       showMessage(err.message);
    //     });
    // };
  
    // logout.onclick = function () {
    //   fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
    //     .then(handleResponse)
    //     .then(showMessage)
    //     .catch(function (err) {
    //       showMessage(err.message);
    //     });
    // };
  
    let ws;
  
    wsButton.onclick = function () {
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
        // spawn player
        // render other players
           
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
        player.name = textInput.value
        player.color = Math.floor(Math.random()*16777215).toString(16);
        player.top = ts % 100
        player.left = ts % 100
        showMessage('WebSocket connection established');
      };
      ws.onclose = function () {
        showMessage('WebSocket connection closed');
        ws = null;
      };
      ws.onmessage = function(event){
        //console.log(event.data);
        let payload = JSON.parse(event.data);
        reRenderSprites(payload);
        
      };

      // repeating interval
      var intervalId = setInterval(function() {
        ws.send(JSON.stringify(player));
      }, 500);
  
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
      let face = document.createTextNode("|:)");
      spriteDiv.classList.add('sprite');
      spriteDiv.style.top = spriteObj.top +'%';
      spriteDiv.style.left = spriteObj.left+'%';
      spriteDiv.style.backgroundColor = '#'+spriteObj.color;
      spriteDiv.appendChild(face);
  
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
      Object.keys(spriteList).forEach(key => {
        //console.log(key, spriteList[key]);
        makeSprite(spriteList[key])
        
        if(collisionDetection(spriteList[key],spriteList)){
          showMessage(spriteList[key].name + ' collided!!!!')
        }
  
      });
      // character.style.left = payload[player.uid].left + 'px';
      // character.style.top = payload[player.uid].top + 'px';
    }
    


  })();

  