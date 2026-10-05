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

function initApp() {
        // Header
    const header = createElement('header', 'header'); 
    const btnNewGame = createElement('button', 'btn-new-game', 'New Game');
    const btnLeaderboard = createElement('button', 'btn-leaderboard', 'Leader Board');
    header.append(btnNewGame, btnLeaderboard);
        // Main
    const main = createElement('main', 'main');
    const scoreBoard = createElement('div', 'scoreboard');
    const movesCounter = createElement('span', 'counter-moves', 'Movies: 0');
    const pairsCounter = createElement('span', 'counter-pairs', 'Pairs: 0 из 8');
    const gameBoard = createElement('div', 'game-board');
    main.append(scoreBoard, gameBoard);   
    scoreBoard.append(movesCounter, pairsCounter);
        // Footer
    const footer = createElement('footer', 'footer');

    document.body.append(header, main, footer);
}

document.addEventListener('DOMContentLoaded', initApp);