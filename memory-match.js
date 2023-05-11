//These notes are for my own learning.

// A variable containing all html elements with the "memory card" class
const cards = document.querySelectorAll(".memory-card");
const timer = document.getElementById("timer");
const moves = document.getElementById("moves");
console.log(moves);
console.log(timer);
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let cardsFlipped = [];
let interval;
let seconds = 0,
  minutes = 0;
let movesCount = 0;

const setTime = () => {
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timer.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

//Inserting a timer into the HTML
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  setTime();
};

/*Flips the card if it has not already been clicked.
 Adds the "flip" class from the CSS code to the classList of this HTMLElement,
 if the card has not been flipped the card will flip and assign this element to the 
 firsCard variable. if a card is already flipped the next clicked card is assigned to  
 secondCard variable
  */
function flipCard() {
  movesCount++;
  moves.innerHTML = `<span>Moves Count:</span>${movesCount}`;
  // console.log(cards.length);
  console.log(movesCount);
  // console.log(cardsFlipped.length);
  if (lockBoard) return;
  if (this === firstCard) return;
  if (cardsFlipped.length === 0 && movesCount === 1) {
    interval = setInterval(timeGenerator, 1000);
  }
  this.classList.add("flip");
  // console.log(this.classList);
  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

/*checks to see if the two flipped cards match using the data-framework attribute 
in the HTML element. */

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  // console.log(firstCard.dataset);
  // console.log(firstCard.dataset.framework);
  isMatch ? disableCards() : unflipCards();
  if (cardsFlipped.length === cards.length) {
    clearInterval(interval);
  }
}

/* Removes the event listener, add flipped couple to the array.
 variables reset
*/
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  cardsFlipped.push(firstCard);
  cardsFlipped.push(secondCard);
  console.log(cardsFlipped.length);
  resetBoard();
}
/*Cannot click any cards when lockboard variable is set to true,
removes flip from the HTMLElement class list and resets board after 1.5 seconds*/
function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

//test

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

//This function is called automatically. Order is changed with reference to the CSS Code
(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

/*Resets the variables. Removes the flip class from each card. randomises positions
adds the click event listener*/
function startOver() {
  resetBoard();
  cardsFlipped = [];
  hasFlippedCard = false;
  lockBoard = false;
  clearInterval(interval);
  [seconds, minutes] = [0, 0];
  setTime();
  movesCount = 0;
  moves.innerHTML = `<span>Moves Count:</span>${movesCount}`;
  cards.forEach((card) => {
    card.classList.remove("flip");
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
    cards.forEach((card) => card.addEventListener("click", flipCard));
  });
}

//Calls the flipcard function when the element is clicked.
cards.forEach((card) => card.addEventListener("click", flipCard));
