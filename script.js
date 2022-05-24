
//Constants and Variables
const canvas = document.querySelector(".myCanvas");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let collisionCount = 0;
let ballArr = new Array();
const STEP = 0.8;
const PLAYER_STEP = 5;

//Helper Functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomFillStyle() {
    return "rgb(" + getRandomInt(256) + "," + getRandomInt(256) + "," + getRandomInt(256) + ")";
}

function getFillStyle(r,g,b) {
    return `rgb(${r},${g},${b})`;
}

function sort(arr) {
    let possiblePos = 1;
    for(let j = 1; j < arr.length; j++) {
        for(let i = j; i > 0; i--) {
            if(arr[j].radius < arr[i-1].radius) {
                possiblePos--;
            }
        }
        let temp = arr[j];
        for(let i = j; i > possiblePos; i--) {
            arr[i] = arr[i-1];
        }
        arr[possiblePos] = temp;
        possiblePos = j+1;
    }
    return arr;
}

function degToRad(degrees) {
    return degrees * Math.PI / 180;
};

function distance(x1,x2,y1,y2) {
    return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
}

//Classes
class Ball {

    //Instance Variables & Constructor
    constructor() {
        this.centerX = getRandomInt(width-500)+250;
        this.centerY = getRandomInt(height-500)+250;
        this.radius = getRandomInt(Math.floor(height/100+width/100))+20;
        this.speed = getRandomInt(1)+1;
        this.direction = degToRad(getRandomInt(360));
        this.R = 0;
        this.G = getRandomInt(200)+56;
        this.B = getRandomInt(200)+56;
        this.fillStyle = getFillStyle(this.R,this.G,this.B);
    }

    //Helper Methods
    updateBall() {
        ctx.beginPath();

        if(this.centerX + this.radius > width || this.centerX - this.radius < 0) {
            console.log("collisionCount: " + collisionCount);
            collisionCount++;
            this.direction = Math.PI - this.direction;
            if(this.radius > 20) {
                this.radius-=2.01;
            }
        }
        if(this.centerY + this.radius > height || this.centerY - this.radius < 0) {
            console.log("collisionCount: " + collisionCount);
            collisionCount++;
            this.direction = -this.direction;
            if(this.radius > 20) {
                this.radius-=2.01;
            }
        }

        this.fillStyle = getFillStyle(this.R, this.G, this.B);
        this.centerX += this.speed * Math.cos(this.direction);
        this.centerY += this.speed * Math.sin(this.direction);

        ctx.fillStyle = this.fillStyle;
        ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,true);
        ctx.fill();
    }

    collisionWith(other) {
       if(Math.sqrt(Math.pow(this.centerX - other.centerX,2) + Math.pow(this.centerY - other.centerY,2)) < this.radius + other.radius) {
           return true;
       } else {
           return false;
       }
    }
}

class Player extends Ball{
    //Instance Variables & Constructor
    constructor() {
        super();
        this.centerX = 100;
        this.centerY = 100;
        this.radius = 40;
        this.R = 255;
        this.G = 255;
        this.B = 255;
        this.fillStyle = 'rgb(255,255,255)';
        this.speed = 0;
        this.direction = 0;
    }

    //Helper Methods
    updateBall() {
        ctx.beginPath();

        if(this.centerX + this.radius >= width || this.centerX - this.radius <= 0) {
            //console.log("collisionCount: " + collisionCount);
            collisionCount++;
            this.direction = Math.PI - this.direction;
            if(this.radius > 20) {
                this.radius-=2.01;
            }
        }
        if(this.centerY + this.radius >= height || this.centerY - this.radius <= 0) {
            //console.log("collisionCount: " + collisionCount);
            collisionCount++;
            this.direction = -this.direction;
            if(this.radius > 20) {
                this.radius-=2.01;
            }
        }

        this.centerX += this.speed * Math.cos(this.direction);
        this.centerY += this.speed * Math.sin(this.direction);

        this.fillStyle = getFillStyle(this.R, this.G, this.B);
        ctx.fillStyle = this.fillStyle;
        ctx.arc(this.centerX,this.centerY,this.radius,0,2*Math.PI,true);
        ctx.fill();
    }

    collisionWith(other) {
        if(Math.sqrt(Math.pow(this.centerX - other.centerX,2) + Math.pow(this.centerY - other.centerY,2)) < this.radius + other.radius) {
            return true;
        } else {
            return false;
        }
     }
}

console.log("BECOME THE BIGGEST: INSTRUCTIONS ON HOW TO PLAY");
console.log("The white ball in the top left corner is You");
console.log("The ball will follow your mouse");
console.log("You will absorb other balls if you come into contact with them and you are bigger");
console.log("Otherwise, you will be absorbed");
console.log("Good Luck!");

//Load non-player balls into array
for(let i = 0; i < Math.floor(height/100+width/100); i++) {
    ballArr.push(new Ball());
}

//Load the player ball into the array
const player = new Player();
ballArr.push(player);

//Loop function describing the actions taken every frame
function loop() {
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0,width,height);

    sort(ballArr);

    //Checks every ball with the other balls for collisions
    for(let i = 0; i < ballArr.length; i++) {
        for(let j = i+1; j < ballArr.length; j++) {
            if(ballArr[i].collisionWith(ballArr[j])) {
                if(ballArr[i].radius > ballArr[j].radius) {
                    if(ballArr[j].radius < 5) {
                        ballArr[i].radius = Math.sqrt(Math.pow(ballArr[i].radius,2) + Math.pow(ballArr[j].radius,2));
                        ballArr.splice(j,1);
                    } else {
                        ballArr[j].radius -= STEP;
                        ballArr[i].radius += STEP/3*2;
                        if(ballArr[j].R > 0) {ballArr[j].R--;}
                        if(ballArr[i].R < 255) {ballArr[i].R++;}
                        if(ballArr[j].G < 255) {ballArr[j].G++;}
                        if(ballArr[i].G > 0) {ballArr[i].G--;}
                        if(ballArr[j].B < 255) {ballArr[j].B++;}
                        if(ballArr[i].B > 0) {ballArr[i].B--;}
                    }
                } else {
                    if(ballArr[i].radius < 5) {
                        ballArr[j].radius = Math.sqrt(Math.pow(ballArr[i].radius,2) + Math.pow(ballArr[j].radius,2));
                        ballArr.splice(i,1);
                    } else {
                        ballArr[i].radius -= STEP;
                        ballArr[j].radius += STEP/3*2;
                        if(ballArr[i].R > 0) {ballArr[i].R--;}
                        if(ballArr[j].R < 255) {ballArr[j].R++;}
                        if(ballArr[i].G < 255) {ballArr[i].G++;}
                        if(ballArr[j].G > 0) {ballArr[j].G--;}
                        if(ballArr[i].B < 255) {ballArr[i].B++;}
                        if(ballArr[j].B > 0) {ballArr[j].B--;}
                    }
                }
            };
        }
        
        //Updates all balls based on previous tests
        ballArr[i].updateBall();
    }
    //loop the function
    window.requestAnimationFrame(loop);
}

//Listens for a mouse click, and will refresh the page
document.body.addEventListener('click', () => {
    window.location.reload();
});

//Listens for the mouse to move
document.body.addEventListener('mousemove', (event) => {
    //Sets the speed of the player
    player.speed = PLAYER_STEP;

    //Sets the direction for the player (if statements are used for the various quadrants)
    if((event.clientY-player.centerY) >= 0) {
        if((event.clientX - player.centerX) >= 0) {
            player.direction = Math.abs(Math.atan((event.clientY-player.centerY)/(event.clientX-player.centerX)));
        } else {
            player.direction = Math.PI - Math.abs(Math.atan((event.clientY-player.centerY)/(event.clientX-player.centerX)));
        }
    } else {
        if((event.clientX - player.centerX) >= 0) {
            player.direction = 2*Math.PI - Math.abs(Math.atan((event.clientY-player.centerY)/(event.clientX-player.centerX)));
        } else {
            player.direction = Math.PI + Math.abs(Math.atan((event.clientY-player.centerY)/(event.clientX-player.centerX)));
        }
    }
});

loop();
  
