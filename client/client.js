player = {
  uid: '',
  name: '',
  left: 0,
  top: 200
};

(function () {
    //const serverHost = 'ws://game-web-proxy-wekkejvrgq-uc.a.run.app/'
    const serverHost = 'ws://localhost:8080/'
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
    rightArrow.onclick = function () {
      player.left = player.left + 1
      console.log(player.left)
    };
    leftArrow.onclick = function () {
      player.left = player.left - 1
      console.log(player.left)
    };

  
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
        showMessage('WebSocket connection established');
      };
      ws.onclose = function () {
        showMessage('WebSocket connection closed');
        ws = null;
      };
      ws.onmessage = function(event){
        console.log(event.data);
        let obj = JSON.parse(event.data);
        character.style.left = obj.left + 'px';
        character.style.top = obj.top + 'px'
      };

      // repeating interval
      var intervalId = setInterval(function() {
        // let ts = Date.now()
        // let num = parseInt(ts) % 100;
        // let obj = {"left":num,"top":200}
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

      // let ts = Date.now()
      // let mes = `Hello World! ${ts} ${textInput.value}`
      // ws.send(mes);
      // showMessage('Sent "' + mes +'"');
    };

    // ws.onmessage = function(){
    //   showMessage('Pong');
    // };



  })();