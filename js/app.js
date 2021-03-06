const deck = document.querySelector('.deck');
const modal = document.querySelector('.modal');
const moveCounter = document.querySelector('.move-counter');
const modalCounter = document.querySelector('.modal-counter');
const resetBtn = document.querySelector('.restart');
const resetAll = document.querySelector('.reset');
const appendTimer = document.querySelector('.timer');
const stars = document.querySelector('.stars');
const modalStars = document.querySelector('.star-rating');
const starRatingWrapper = document.querySelector('.star-rating-wrapper')
const getCards = Array.from(document.querySelectorAll('.deck li'));
let count = 0;
let time = 0;
let timer;
let timerOn = false;
let starsArray = [];
let openCards = [];
let matchingCards = [];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffleDeck() {
    const shuffledCards = shuffle(getCards);

    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}
shuffleDeck();

//Adds clicked cards into the openCards array
function addOpenCards(card) {
    if (card.classList.contains('open')) {
        openCards.push(card);
    }
}

//Tests the two clicked cards to see if they are matching
//returns True or False
function testOpenCards() {
    let doesCardMatch;
    if (openCards.length > 1) {
        if (openCards[0].innerHTML === openCards[1].innerHTML) {
            doesCardMatch = true;
        } else {
            doesCardMatch = false;
        }
    }
    return doesCardMatch;
}

//If cards match they get pushed into the matchingCards array, and the openCards array gets cleared.
//If cards don't match remove classes, then clear the openCards array.
//increment counter
function doCardsMatch() {
        if (testOpenCards()) {
            for (let i = 0; i < openCards.length; i++) {
                matchingCards.push(openCards[i]);
            }
            console.log(matchingCards);
            openCards = [];
            incrementCounter();
        } else {
            setTimeout(() => {
                openCards.forEach(card => {
                    toggleClass(card);
                });
                openCards = [];
            }, 1000);
            incrementCounter();
        }
    }

//=== === USEFUL FUNCTIONS === ===\\

function incrementCounter() {
    count++;
    moveCounter.innerHTML = count;
    modalCounter.innerHTML = count;
}

function toggleClass(element) {
    element.classList.toggle('open');
    element.classList.toggle('show');
    element.classList.toggle('avoid-click');
}

//function to open the Modal 
function openModal() {
    modal.style.display = 'block';
}

//function to close the Modal 
function closeModal() {
    modal.style.display = 'none';
}

//Win condition function
function winCondition() {
    if (matchingCards.length === 16) {
        stopTimer();
        modalCounter.innerHTML = `You won in ${count} moves`;
        setModalStars();
        openModal();
    }
}

//function to start the Timer
function startTimer() {
    timer = setInterval(() => {
        time++;
        displayTimer();
    }, 1000);
}

//function to Stop the Timer
function stopTimer() {
    clearInterval(timer);
}

//function to display the Timer to the DOM
function displayTimer() {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    if (sec < 10) {
        appendTimer.innerHTML = `it took you ${min}:0${sec}`;
    } else {
        appendTimer.innerHTML = `it took you ${min}:${sec}`;
    }
}

function setModalStars() {
    if (count < 12) {
        starRatingWrapper.innerHTML = `
        <h4>3 Stars?! You're a smart cookie<h4/>
        <ul class="star-rating">
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
    </ul>`
    } else if (count >= 12 && count < 18) {
        starRatingWrapper.innerHTML = `
        <h4>Not bad</h4> 
        <ul class="star-rating">
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
    </ul>`
    } else {
        starRatingWrapper.innerHTML = `<h4>Surely you can do better</h4> 
        <ul class="star-rating">
        <li><i class="fa fa-star"></i></li>
    </ul>`;
    }
}

//Display number of stars on Modal and in game.
function setStars(elem) {
    if (count < 12) {
        elem.innerHTML = `<li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>`;
    } else if (count >= 12 && count < 18) {
        elem.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
    } else {
        elem.innerHTML = '<li><i class="fa fa-star"></i></li>';
    }
}

//function for Resetting the game
function resetGame() {
    count = 0;
    moveCounter.innerHTML = count;
    for (let i = 0; i < matchingCards.length; i++) {
        toggleClass(matchingCards[i]);
    }
    openCards.forEach(card => {
        toggleClass(card);
    });
    matchingCards = [];
    stopTimer();
    closeModal();
    time = 0;
    timerOn = false;
    stars.innerHTML = `<li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>
    <li><i class="fa fa-star"></i></li>`
    openCards = [];
    shuffleDeck();
}

//Click Event Listener for when cards are clicked.
deck.addEventListener('click', event => {
    if (!timerOn) {
        startTimer();
        timerOn = true;
    }

    setStars(stars);

    if (event.target.classList.contains('card')) {
        if (openCards.length <= 1) {
            toggleClass(event.target);
            addOpenCards(event.target);

            if (openCards.length > 1) {
                testOpenCards();
                doCardsMatch();
        }
    }
}
    winCondition();
});

resetBtn.addEventListener('click', resetGame);
resetAll.addEventListener('click', resetGame);