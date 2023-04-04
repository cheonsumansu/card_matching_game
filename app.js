const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const finishButton = document.getElementById("finish");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controlsContainer = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

/** 카드 종류 */
const items = [
    {name: "alien", image: "images/alien.png"},
    {name: "asteroid", image: "images/asteroid.png"},
    {name: "black-hole", image: "images/black-hole.png"},
    {name: "comet", image: "images/comet.png"},
    {name: "earth", image: "images/earth.png"},
    {name: "moon", image: "images/moon.png"},
    {name: "spaceship", image: "images/spaceship.png"},
    {name: "sun", image: "images/sun.png"}
];

/** 시간 */
let seconds = 0, minutes = 0;
/** 움직인 횟수 */
let movesCount = 0
/** 성공한 횟수 */
let winCount = 0;

/** 타이머 설정 */
const timeGenerator = ()=> {
    seconds += 1;
    if(seconds>=60) {
        minutes += 1;
        seconds = 0;
    }
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

/** 움직임 횟수 세기 */
const movesCounter = ()=> {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

/** 카드에서 랜덤으로 뽑기 */
const generateRandom = (size=4)=> {
    let tempArray = [...items];     //임시배열
    let cardValues = [];            //찐배열
    size = (size*size)/2;
    for (let i=0; i<size; i++) {
        const randomIndex = Math.floor(Math.random()*tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        tempArray.splice(randomIndex, 1);   //임시배열에 있으면 제거, 중복제거
    }
    return cardValues;
};

/** 카드 깔기 */
const matrixGenerator = (cardValues, size=4)=> {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues,...cardValues];     //카드는 쌍이니까
    cardValues.sort(()=> (Math.random()-0.5));        //최대한 골고루 섞기
    for (let i=0; i<size*size; i++) {
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after">
                <img src="${cardValues[i].image}" class="image"/>
            </div>
        </div>`;
    }
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;
    
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card)=> {
        /** 첫번째 카드가 두번째 카드랑 다를 경우 */
        card.addEventListener("click", ()=> {
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");
                /** 방금 뒤집힌게 첫번째 카드일 경우 */
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    /** 첫번째랑 두번째카드가 같으면 firstCard 리셋시키고 다 맞췄으면 글씨 띄움 */
                    if (firstCardValue==secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        winCount += 1;
                        if (winCount==Math.floor(cardValues.length/2)) {
                            result.innerHTML = `<h1>You Won!</h1>
                            <h3>Moves: ${movesCount}</h3>`;
                            finishGame();
                        }
                    } else {
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        setTimeout(()=> {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 700);
                    }
                }
            } 
        });
    });
};

startButton.addEventListener("click", ()=> {
    movesCount = 0;
    time = 0;
    /** 컨트롤컨테이너랑 피니쉬버튼 활성화 */
    controlsContainer.classList.add("hide");
    finishButton.classList.remove("hide");
    startButton.classList.add("hide");

    /** 타이머 시작 */
    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>moves: </span>${movesCount}`;
    initializer();
});

finishButton.addEventListener("click", function finishGame() {
    /** 시작버튼만 활성화 */
    controlsContainer.classList.remove("hide");
    finishButton.classList.add("hide");
    startButton.classList.remove("hide");
    /** 타이머 제거, 리셋 */
    clearInterval(interval);
});

/** cardValues 설정, 게임코드 불러오기 */
const initializer = ()=> {
    result.innerHTML = "";
    winCount = 0;
    let cardValues = generateRandom();
    matrixGenerator(cardValues);
}
