function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);
    if (className) {
        element.classList.add(className);
    }
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

const cardIcons = ['🦊', '🐰', '🦁', '🐻', '🐼', '🐨', '🐸', '🐙']
let cardsData = [];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function prepareCards() {
    const doubleCards = [...cardIcons, ...cardIcons];
    cardsData = shuffle(doubleCards);
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard = null;
let secondCard = null;

let moves = 0;
let matchedPairs = 0;
let timeoutId = null;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flipped');
    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    moves++;
    updateScoreBoard();
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.querySelector('.card-front').textContent === secondCard.querySelector('.card-front').textContent;
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    matchedPairs++;
    updateScoreBoard();
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    timeoutId = setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function updateScoreBoard() {
    document.querySelector('.counter-moves').textContent = `Moves: ${moves}`;
    document.querySelector('.counter-pairs').textContent = `Pairs: ${matchedPairs} of 8`;
}

function resetBoard() {
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    timeoutId = null;
}

function createGrid(gameBoard) {
    gameBoard.textContent = '';
    prepareCards();
    cardsData.forEach((icon) => {
        const card = createElement('div', 'card');
        const cardInner = createElement('div', 'card-inner');
        const cardFront = createElement('div', 'card-front', icon);
        const cardBack = createElement('div', 'card-back', '?');
        cardInner.append(cardFront, cardBack);
        card.append(cardInner);
        card.addEventListener('click', flipCard);
        gameBoard.append(card);
    })
}

function restartGame() {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    moves = 0;
    matchedPairs = 0;
    resetBoard();
    updateScoreBoard();
    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) {
        createGrid(gameBoard);
    }
    console.log('Игра успешно перезапущена без перезагрузки страницы!');
}

function initApp() {
        // Header
    const header = createElement('header', 'header'); 
    const title = createElement('h1', 'title', 'Memory Game')
    const btnNewGame = createElement('button', 'btn-new-game', 'New Game');
    const btnLeaderboard = createElement('button', 'btn-leaderboard', 'Leader Board');
    header.append(title, btnNewGame, btnLeaderboard);
    btnNewGame.addEventListener('click', restartGame);
        // Main
    const main = createElement('main', 'main');
    const scoreBoard = createElement('div', 'scoreboard');
    const movesCounter = createElement('span', 'counter-moves', 'Moves: 0');
    const pairsCounter = createElement('span', 'counter-pairs', 'Pairs: 0 of 8');   
    scoreBoard.append(movesCounter, pairsCounter);
    const gameBoard = createElement('div', 'game-board');
    createGrid(gameBoard);
    main.append(scoreBoard, gameBoard); 
        // Footer
    const footer = createElement('footer', 'footer');

    document.body.append(header, main, footer);
}

document.addEventListener('DOMContentLoaded', initApp);