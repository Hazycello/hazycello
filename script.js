const cells = document.querySelectorAll('.cell');
const statusDiv = document.querySelector('.status');
const resetButton = document.querySelector('.reset');

let currentPlayer = 'X';  // Player 'X' is the human
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleClick(event) {
    const cellIndex = event.target.getAttribute('data-index');

    if (board[cellIndex] !== '' || !gameActive || currentPlayer === 'O') {
        return;
    }

    makeMove(cellIndex, currentPlayer);

    if (checkWin()) {
        statusDiv.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (board.every(cell => cell !== '')) {
        statusDiv.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        currentPlayer = 'O';
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
        setTimeout(aiMove, 500); // AI makes a move after a short delay
    }
}

function aiMove() {
    const bestMove = getBestMove();
    makeMove(bestMove, 'O');

    if (checkWin()) {
        statusDiv.textContent = 'Player O wins!';
        gameActive = false;
    } else if (board.every(cell => cell !== '')) {
        statusDiv.textContent = 'It\'s a draw!';
        gameActive = false;
    } else {
        currentPlayer = 'X';
        statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].classList.add(player.toLowerCase());
    cells[index].textContent = player;
}

function checkWin() {
    return winningConditions.some(condition => {
        const [a, b, c] = condition;
        return board[a] && board[a] === board[b] && board[a] === board[c];
    });
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O'; // Try the move
            const score = minimax(board, 0, false);
            board[i] = ''; // Undo the move
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin()) return isMaximizing ? -10 : 10;
    if (board.every(cell => cell !== '')) return 0;

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = isMaximizing ? 'O' : 'X';
            const score = minimax(board, depth + 1, !isMaximizing);
            board[i] = '';
            bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
        }
    }

    return bestScore;
}

function handleReset() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    currentPlayer = 'X';
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    gameActive = true;
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', handleReset);
