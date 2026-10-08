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

let firstActiveCard = null;
let secondActiveCard = null;
let timerActive = false;

let moves = 0;
let matchedPairs = 0;
let timeoutId = null;

function flipCard() {
    if (timerActive) return;
    if (this === firstActiveCard) return;
    this.classList.add('flipped');
    if (firstActiveCard === null) {
        firstActiveCard = this;
        return;
    } else {
        secondActiveCard = this;
    }
    moves++;
    updateScoreBoard();
    const isMatch = firstActiveCard.querySelector('.card-front').textContent === secondActiveCard.querySelector('.card-front').textContent;
    if (isMatch) {
        disableCards();
    } else {
        closeCards();
    }
}

function disableCards() {
    matchedPairs++;
    updateScoreBoard();
    firstActiveCard.removeEventListener('click', flipCard);
    secondActiveCard.removeEventListener('click', flipCard);
    if (matchedPairs === 8) {
        setTimeout(() => {
            saveResult(moves);
            showWinModal();
        }, 500)
    }
    resetBoard();
}

function closeCards() {
    timerActive = true;
    timeoutId = setTimeout(() => {
        firstActiveCard.classList.remove('flipped');
        secondActiveCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function updateScoreBoard() {
    document.querySelector('.counter-moves').textContent = `Moves: ${moves}`;
    document.querySelector('.counter-pairs').textContent = `Pairs: ${matchedPairs} of 8`;
}

function resetBoard() {
    timerActive = false;
    firstActiveCard = null;
    secondActiveCard = null;
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

function createModal(id, titleText, closeCallBack) {
    const overlay = createElement('div', 'modal-overlay');
    overlay.id = id;
    const content = createElement('div', 'modal-content');
    const title = createElement('h2', 'modal-title', titleText);
    content.append(title);
    overlay.append(content);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeCallBack();
        }
    });
    return { overlay, content};
}

function createModals() {
        // Win Modal
    const winModal = createModal('win-modal', 'Congratulations! 🎉', () => closeModal('win-modal'));
    const winStats = createElement('p', 'modal-stats');
    winStats.id = 'modal-stats-text';
    const winBtnNewGame = createElement('button', 'modal-btn', 'Play Again');
    winBtnNewGame.addEventListener('click', () => {
        closeModal('win-modal');
        restartGame();
    });
    const winBtnClose = createElement ('button', 'modal-btn', 'Close');
    winBtnClose.addEventListener('click', () => closeModal('win-modal'));
    const buttonsContainer = createElement('div', 'modal-buttons-container');
    buttonsContainer.append(winBtnNewGame, winBtnClose);
    winModal.content.append(winStats, buttonsContainer);
        // Leader Modal
    const leaderModal = createModal('leaderboard-modal', 'Top 10 Leaders', () => closeModal('leaderboard-modal'));
    const tableContainer = createElement('div', 'table-container');
    tableContainer.id = 'leaderboard-table-container';
    const leaderBtnClose = createElement('button', 'modal-btn', 'Close');
    leaderBtnClose.addEventListener('click', () => closeModal('leaderboard-modal'));
    leaderModal.content.append(tableContainer, leaderBtnClose);

    document.body.append(winModal.overlay, leaderModal.overlay);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal('win-modal');
            closeModal('leaderboard-modal');
        }
    });
}

function showWinModal() {
    const overlay = document.getElementById('win-modal');
    const statsText = document.getElementById('modal-stats-text');
    if (overlay && statsText) {
        statsText.textContent = `You won the game in ${moves} moves!`;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function showLeaderboardModal() {
    const overlay = document.getElementById('leaderboard-modal');
    const container = document.getElementById('leaderboard-table-container');
    if (!overlay || !container) return;
    container.textContent = '';
    const results = JSON.parse(localStorage.getItem('memoryGameResults')) || [];
    if (results.length === 0) {
        const noResultsMsg = createElement('p', 'modal-stats', 'No games played yet. Be the first!');
        container.append(noResultsMsg);
    } else {
        const table = createElement('table', 'leaderboard-table');
        const thead = createElement('thead');
        const headerRow = createElement('tr');
        headerRow.append(
            createElement('th', null, 'Rank'),
            createElement('th', null, 'Moves'),
            createElement('th', null, 'Date'),
        );
        thead.append(headerRow);
        const tbody = createElement('tbody');
        results.forEach((res, index) => {
            const row = createElement('tr');
            row.append(
                createElement('td', null, `#${index + 1}`),
                createElement('td', null, `${res.moves} moves`),
                createElement('td', null, res.date)
            );
            tbody.append(row);
        });
        table.append(thead, tbody);
        container.append(table);
    }
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const overlay = document.getElementById(modalId);
    if (overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        const anyActive = document.querySelector('.modal-overlay.active');
        if (!anyActive) {
            document.body.style.overflow = '';
        } 
    }
}

function saveResult(currentMoves) {
    let results = JSON.parse(localStorage.getItem('memoryGameResults')) || [];
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    results.push({ moves: currentMoves, date: formattedDate });
    results.sort((a,b) => a.moves - b.moves);
    localStorage.setItem('memoryGameResults', JSON.stringify(results.slice(0, 10)));
}

function restartGame() {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    moves = 0;
    matchedPairs = 0;
    resetBoard();
    updateScoreBoard();
    closeModal('win-modal');
    closeModal('leaderboard-modal');
    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) {
        createGrid(gameBoard);
    }
}

function initApp() {
        // Header
    const header = createElement('header', 'header'); 
    const title = createElement('h1', 'title', 'Memory Game')
    const btnNewGame = createElement('button', 'btn-new-game', 'New Game');
    const btnLeaderboard = createElement('button', 'btn-leaderboard', 'Leader Board');
    header.append(title, btnNewGame, btnLeaderboard);
    btnNewGame.addEventListener('click', restartGame);
    btnLeaderboard.addEventListener('click', showLeaderboardModal);
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
    const githubLink = createElement('a', 'footer-link', 'Github Latira');
    githubLink.href = 'https://github.com/Latira';
    const footerYear = createElement('p', 'footer-year', '2026');
    const rsLink = createElement('a', 'footer-link', 'Training app for RS School');
    rsLink.href = 'https://rs.school/';
    footer.append(githubLink, footerYear, rsLink);

    document.body.append(header, main, footer);
    createModals();
}

document.addEventListener('DOMContentLoaded', initApp);