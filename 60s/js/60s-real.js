// 60s on-line game prototype created by Lige Marshall Jr. III 7/2/18
// 60s On-line Basketball game JAVASCRIPT

function resetPage() {
location.reload();
return;
}

//creates containers for games audible and visible objects
var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var passSound = new sound("audio/pass.mp3");
var stealSound = new sound("audio/steal.mp3");
var restartSound = new sound("audio/restart.mp3");


function startGame() {

//creates game obj
myGamePiece = new component(30, 30, "https://i.imgur.com/YcloK0v.png", 10, 120, "image");
// renders the game obj
myGamePiece.render();

 //creates background obj
myBackground = new component(481, 271, "https://i.imgur.com/2jhiUAV.jpg", 0, 0, "background");
// render the background obj
myBackground.render(); 

//creates score obj
myScore = new component("24px", "Arial", "#fff", 320, 263, "text");

myGameArea.start();
}

function restart(){
restartSound.play();
startGame();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
 stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//components
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
}
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        if (type == "background") {
            ctx.drawImage(this.image, 
                this.x + this.width, 
                this.y,
                this.width, this.height);
             }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }
//listens for crash
this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

//updatedGameAreaa
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
//activates on steal
        if (myGamePiece.crashWith(myObstacles[i])) {
            stealSound.play();
            myGameArea.stop();
            return;
        } 
    }

    myGameArea.clear();
    myGameArea.frameNo += 1;
    myBackground.speedX = -1;

    myBackground.newPos();
    myBackground.update();

    if (myGameArea.frameNo == 1 || everyinterval(120)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(15, height, "black", x, 0));
        myObstacles.push(new component(15, x - height - gap, "black", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= 1;
        myObstacles[i].update();
    }
myScore.text="SCORE: " + myGameArea.frameNo;
myScore.update();
myGamePiece.newPos();
myGamePiece.update();
}//end updatedGameArea

//changes moving ball to the alternate image
function move(dir) {
    myGamePiece.image.src = "images/basketballmove.png";
    if (dir == "up") {myGamePiece.speedY = -1, passSound.play(); }
    if (dir == "down") {myGamePiece.speedY = 1, passSound.play(); }
    if (dir == "left") {myGamePiece.speedX = -1, passSound.play(); }
    if (dir == "right") {myGamePiece.speedX = 1, passSound.play(); }
}

//changes moving ball back to default ball
function clearmove() {
myGamePiece.image.src = "images/basketball.png";
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}

//sound method
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
return false;
}