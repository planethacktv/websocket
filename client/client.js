player = {
  uid: '',
  name: '',
  left: 0,
  top: 200,
  color: '#000000'
};

const gameField = document.querySelector('#gameField');

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
      player.top = player.top + 1
    }
    function playerMoveUp(){
      player.top = player.top - 1
    }
    function playerMoveRight(){
      player.left = player.left + 1
    }
    function playerMoveLeft(){
      player.left = player.left - 1
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
      ws.onopen = function () {
        let ts = Date.now()
        let mes = `Hello World! ${ts} ${textInput.value}`
        player.uid = 'player'+ts
        player.name = textInput.value
        player.color = Math.floor(Math.random()*16777215).toString(16);

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



  })();

  function makeSprite(spriteObj){
    let spriteDiv = document.createElement("div");
    let face = document.createTextNode("|:)");
    spriteDiv.classList.add('sprite');
    spriteDiv.style.top = spriteObj.top +'px';
    spriteDiv.style.left = spriteObj.left+'px';
    spriteDiv.style.backgroundColor = '#'+spriteObj.color;
    
    spriteDiv.appendChild(face);
    gameField.appendChild(spriteDiv);
  }
  function reRenderSprites(spriteList){
    gameField.innerHTML=''; // clear the field
    Object.keys(spriteList).forEach(key => {
      //console.log(key, spriteList[key]);
      makeSprite(spriteList[key])
    });
    // character.style.left = payload[player.uid].left + 'px';
    // character.style.top = payload[player.uid].top + 'px';
  }
  