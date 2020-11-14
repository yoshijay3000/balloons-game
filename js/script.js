"use strict";

let body = document.body;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let scores = document.querySelectorAll('.score');
let num = 0; //number of ballons popped
let total = 100; // total number of ballons you must pop to win
let currentBalloon = 0;
let gameOver = false;
let totalShadow = document.querySelector('.total-shadow');

function randomColor(){
    let colors = ['yellow', 'red', 'blue', 'violet', 'green'];
    let index = Math.trunc(Math.random() * colors.length);
    return colors[index];
}

function animateBalloon(elem){
    let pos = 0;
    let random = Math.floor(Math.random() * 6 - 3);
    let interval = setInterval(frame, 12- Math.floor(num/10) + random);

    //the balloon will move by one frame
    function frame(){
        //if the balloon reaches the position equal to the browser screen + the height of the balloon (200px), then the function will be stopped immediately
        if (pos >= windowHeight + 200) {
            clearInterval(interval);
            //checking to see if elem has already been popped
            if (!elem.classList.contains('popped') && !elem.classList.contains('popped-over')){
                deleteBalloon(elem);
                gameOver = true;
            }
        }
        else{
            pos++;
            elem.style.top = windowHeight - pos + 'px';
        }
    }
}

function createBalloon(){
    let div = document.createElement('div');
    let color = randomColor();
    div.classList.add('balloon');
    div.classList.add(`balloon-${color}`);

    currentBalloon++;
    div.setAttribute('data-number', currentBalloon);

    //randomly position the ballon at the bottom of the screen
    let randomPos = Math.floor(Math.random() * (windowWidth - 100));
    div.style.left = randomPos + 'px';
    body.append(div);

    //make the ballon float to the top
    animateBalloon(div);
}

function deleteBalloon(elem){
    elem.remove();
}

function updateScore(){
    scores.forEach(score=>{
        score.textContent = num;
    });
}

//attach event listener to the whole document
document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('balloon')){
        e.target.classList.add('popped');
        playBallSound();
        deleteBalloon(e.target);
        num++;
        updateScore(num);
    };
})

function startGame() {
    let timeout = 0;
    let loop = setInterval(()=>{
        timeout = Math.floor(Math.random() * 600 - 100);
        if (!gameOver && num <= total){
            createBalloon();
        }
        else if (num <= total){
            clearInterval(loop);
            totalShadow.style.display = "flex";
            totalShadow.querySelector('.lose').style.display = 'block';
        }
        else{
            clearInterval(loop);
            totalShadow.style.display = "flex";
            totalShadow.querySelector('.win').style.display = 'block';
        }
    }, 400 + timeout);
}

function playBallSound() {
    let audio = document.createElement('audio');
    audio.src = 'sounds/pop.mp3';
    audio.play();
}

//restart buttons click event
let restarts = document.querySelectorAll('.restart');
restarts.forEach(restart=>{
    restart.addEventListener('click', () => {
        //delete all balloons on screen
        document.querySelectorAll('.balloon').forEach(balloon => {
            balloon.classList.add('popped-over');
            deleteBalloon(balloon);
        });
        //reset values, close popup and start game
        num = 0;
        currentBalloon = 0;
        gameOver = false;
        updateScore();
        totalShadow.style.display = "none";
        totalShadow.querySelector('.lose').style.display = 'none';
        startGame();
    });
});

//cancel buttons click event
let cancels = document.querySelectorAll('.cancel');
cancels.forEach(cancel=>{
    cancel.addEventListener('click', ()=>totalShadow.style.display = "none");
});


document.querySelector('.start-game-button').addEventListener('click', ()=>{
    startGame();
    document.querySelector('.start-game-window').style.display = 'none';
    let audio = document.querySelector('.bg-music');
    audio.play();
});

