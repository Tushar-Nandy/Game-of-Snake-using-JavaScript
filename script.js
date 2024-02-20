//getting html elements
const board=document.getElementById("game-board");
const instruction=document.getElementById("instruction-text");
const logo=document.getElementById('logo');
const score=document.getElementById('score');
const highScoreText=document.getElementById('highScore');

//define game variable
const gridSize=20;
let snake=[{x:10,y:10}];
let food=generateFood();
let gameInterval;
let direction='right';
let gameSpeedDelay=250; //game speed in milli sec
let gameStarted=false;
let highScore=0;

// to draw snake and food
function draw(){
    board.innerHTML='';//to reset the board
    drawSnake();
    drawFood();
    updateScore();
}

function drawSnake(){
    snake.forEach((segment)=> {
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement,segment);
        board.appendChild(snakeElement);
    });
}

//function to create snake or food cube/div
function createGameElement(tag,className){
    const element=document.createElement(tag);
    element.className=className; //giving the element a className using the variable className
    return element;
}


//draw the snake
//draw();

//set position of the snake or the food
function setPosition(element,position){
    element.style.gridColumn=position.x;
    element.style.gridRow=position.y;
}

function drawFood(){
    if(gameStarted)  {
        const foodElement=createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
}
}

function generateFood(){
    const x= Math.floor(Math.random()*gridSize+1);
    const y= Math.floor(Math.random()*gridSize+1);
    return {x,y};
}

//move the snake
function move(){
    const head={...snake[0]};
    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'top':
            head.y--;
            break;
        case 'bottom':
            head.y++;
            break;   
        }
    snake.unshift(head);//appends head to the head of the snake
    //snake.pop();//removes an element from the tail of the snake in order to maintain the shape of the snake
    if(head.x==food.x && head.y==food.y){
        food=generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval= setInterval(()=>{
            move();
            checkCollision();
            draw();
        },gameSpeedDelay);
    }else{
        snake.pop();
    }

}


//test moving
// setInterval(()=>{
//     move();
//     draw(); //draw again
// },200)

//game start function
function gameStart(){
    gameStarted=true;//keep track of running game
    instruction.style.display='none';
    logo.style.display='none';
    gameInterval= setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);
}

//KeyPress event handler
function handleKeyPress(event){
    if((!gameStarted && event.code=='Space') || (!gameStarted && event.key===' ')){
        gameStart();
    }else{
        switch (event.key) {
            case 'ArrowUp':
                direction='top';
                break;
            case 'ArrowDown':
                direction='bottom';
                break;
            case 'ArrowLeft':
                direction='left';
                break;
            case 'ArrowRight':
                direction='right';
                break;
        
           
        }
    }
}

document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    console.log(gameSpeedDelay);
    if(gameSpeedDelay>150){
        gameSpeedDelay-=5;
    }else if(gameSpeedDelay>100){
        gameSpeedDelay-=3;
    }else if(gameSpeedDelay>50){
        gameSpeedDelay-=2;
    }else if(gameSpeedDelay>25){
        gameSpeedDelay-=1;
    }
}

function checkCollision(){
    const head=snake[0];

    if(head.x<1 || head.x>gridSize || head.y<1 || head.y>gridSize){
        resetGame();
    }

    for(let i=1;i<snake.length;i++) {
        if(head.x===snake[i].x && head.y===snake[i].y){
            resetGame();
        }

    }
}

function resetGame() {
    updateHighscore();
    stopGame();
    snake=[{x:10,y:10}];
    food=generateFood();
    direction='right';
    gameSpeedDelay=250;
    updateScore();
}

function updateScore(){
    const currentScore=snake.length-1;
    score.textContent=currentScore.toString().padStart(3,'0'); //for a triple digit number by adding zeroes b4
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted=false;
    instruction.style.display='block';
    logo.style.display='block';
}

function updateHighscore(){
    const currentScore=snake.length-1;
    if(currentScore>highScore){
        highScore=currentScore;
        highScoreText.textContent=highScore.toString().padStart(3,'0');
    }
    highScoreText.style.display='block';
}