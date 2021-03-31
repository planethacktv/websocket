class Character {
    constructor(name){
        this.name = name
        this.instantiate();

    }
    instantiate(){
        this.setUID()
        
        this.color = this.getRandomColor()
        this.health = 100
        this.maxHealth = 100
        this.moveSpeed = 1
        this.points = 0
        this.speed = 1
        this.x = this.getRandomCoordinate(100)
        this.y = this.getRandomCoordinate(100)
        
    }
    setUID(){
        let ts = Date.now()
        let uid = md5(navigator.userAgent+ts)
        this.uid = this.type+uid
    }
    getRandomColor(){
        return Math.floor(Math.random()*16777215).toString(16);
    }
    getRandomCoordinate(max){
        return Math.floor(Math.random() * Math.floor(max));
    }

    move(x,y) {
        this.x += x * this.speed
        this.y += y * this.speed 
    }

    setMoveSpeed(num) {
        this.moveSpeed = num
    }

    teleport(x,y) {
        this.x = x
        this.y = y
    }



}

class Player extends Character {
    changeName(name){
        this.name = name
    }
    instantiate(){
        
        this.type = 'Player'
        this.color = this.getRandomColor()
        this.health = 100
        this.maxHealth = 100
        this.moveSpeed = 1
        this.points = 0
        this.speed = 1
        this.x = this.getRandomCoordinate(100)
        this.y = this.getRandomCoordinate(100)
        this.setUID()
    }
}