# Multi-Player Game Websocket
 
Web socket sever that will take in game data from multiple clients.
 
### Live Streams Building this Project

1. Setting up the websocket https://www.twitch.tv/videos/940972698
2. Websocket auto-deploy to cloud run https://www.twitch.tv/videos/946186034
3. Multiplayer on the Websocket with client rendering https://www.twitch.tv/videos/950001821

# Game Server

Web socket is setup to auto deploy to Google Cloud Run.

Websocket Game server is live at http://game-web-proxy-wekkejvrgq-uc.a.run.app/ note you should "upgrade required" because it requires a ws://game-web-proxy-wekkejvrgq-uc.a.run.app/ connection


# Client

This websocket connects to the client, you can see that code in the `client/` directory of this repository.

Client is live at http://storage.googleapis.com/webproxyinterface/index.html?purge=1


For next stream: - add player name above sprite
- create bound that the sprite cant leave
- make eash session unique
- collisions?
- leave game
- a / b button


