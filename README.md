# Memory Game

## **Memory Game** is a classic card-matching game designed to test and improve visual memory. The main objective is to find and match all pairs of identical cards in the fewest moves possible. Developed as a task for the RS School.

## How to Play
The game starts automatically as soon as the page loads, presenting a grid of sixteen face-down cards. Click on any card to flip it over and reveal the hidden emoji. Your goal is to find its identical match by flipping a second card. If the two cards match, they will stay face-up for the rest of the game, and the pairs counter will increase. If they do not match, the board will briefly lock while the cards automatically flip back down after one second, allowing you to memorize their positions. Every time you flip a second card, the total move counter increases. At any point during the game, you can click the "New Game" button to instantly reset your score, cancel any active animations, and completely reshuffle the deck for a fresh start.

## Local Setup
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Latira/memory-game.git
   ```
2. Navigate to the project folder:
   ```bash
   cd memory-game
   ```
3. Switch to the development branch:
   ```bash
   git checkout memory-game
   ```
4. Open the `index.html` file using a local development server (such as the **Live Server** extension in VS Code or by running `npx serve` in your terminal).

## Tech Stack
The application is built completely with standard web technologies without any frameworks. The core layout utilizes a pure HTML5 skeleton where all elements are dynamically injected via Vanilla JavaScript . Modern CSS variables, native nesting, and 3D transforms handle responsive scaling and smooth card-flipping animations.
