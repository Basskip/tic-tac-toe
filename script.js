const BOARD_SIZE = 3;

const gameBoard = ((squares) => {
    let board = new Array();

    for (let index = 0; index < squares; index++) {
        board.push(new Array(squares));
    }

    function clearBoard() {
        for (x = 0; x < squares; x++) {
            for (y = 0; y < squares; y++) {
                board[x][y] = 0;
            }
        }
    }

    function getSquare(x, y) {
        return board[x][y];
    }

    function setSquare(x, y, value) {
        board[x][y] = value;
    }

    function _rowWin(y) {
        return _stepWin(0, y, 1, 0);
    }

    function _columnWin(x) {
        return _stepWin(x, 0, 0, 1);
    }

    function _diagonalWin() {
        return (_stepWin(0, 0, 1, 1) || _stepWin(0, squares - 1, 1, -1));
    }

    function _stepWin(xStart, yStart, xStep, yStep) {
        let xCurrent = xStart;
        let yCurrent = yStart;
        let current = getSquare(xStart, yStart);
        let next;

        while ((xCurrent + xStep < squares) && (yCurrent + yStep < squares)) {
            next = getSquare(xCurrent + xStep, yCurrent + yStep);
            if (next == 0 || current != next) {
                return 0;
            }
            xCurrent += xStep;
            yCurrent += yStep;
            current = next;
        }
        return current;
    }

    function winner() {
        let result = 0;
        for (let i = 0; i < squares; i++) {
            result = _rowWin(i);
            if (result != 0) {
                return result;
            }
            result = _columnWin(i);
            if (result != 0) {
                return result;
            }
        }
        return _diagonalWin();
    }

    function boardFull() {
        for (let x = 0; x < squares; x++) {
            for (let y = 0; y < squares; y++) {
                if (getSquare(x, y) == 0) {
                    return false;
                }
            }
        }
        return true;
    }


    return {
        getSquare,
        setSquare,
        clearBoard,
        board,
        winner,
        boardFull,
    }
})(BOARD_SIZE);

const playerFactory = (name, marker) => {
    return { name, marker };
};

const displayController = ((displaySelector, boardSelector, squares) => {
    const container = document.querySelector(boardSelector);
    const display = document.querySelector(displaySelector);

    function setupBoard() {
        for (y = squares - 1; y >= 0; y--) {
            for (x = 0; x < squares; x++) {
                let boardSquare = document.createElement("div");
                boardSquare.setAttribute('class', 'game-space');
                boardSquare.setAttribute('onclick', `game.clickSquare(${x},${y})`)
                container.appendChild(boardSquare);
            }
        }
        let sheet = document.createElement('style');
        sheet.innerHTML = `#game-board {grid-template-columns: repeat(${squares}, 1fr); grid-template-rows: repeat(${squares}, 1fr) }`;
        document.body.appendChild(sheet);
    }

    function renderBoard() {
        let index = 0;
        for (y = squares - 1; y >= 0; y--) {
            for (x = 0; x < squares; x++) {
                let boardSquare = container.children[index];
                let value = gameBoard.getSquare(x, y);
                if (value != 0) {
                    boardSquare.innerHTML = value;
                } else {
                    boardSquare.innerHTML = '';
                }
                index++;
            }
        }
    }

    function setText(text) {
        display.innerHTML = text;
    }

    return {
        setupBoard,
        renderBoard,
        setText,
    }
})('#alert-area', '#game-board', BOARD_SIZE);

const game = (() => {
    let activePlayer = 1;
    let player1;
    let player2;
    let gameOver = 1;

    function clickSquare(x, y) {
        if (!gameOver && gameBoard.getSquare(x, y) == 0) {
            gameBoard.setSquare(x, y, activePlayer.marker);
            _swapActivePlayer();
            _displayTurn();
            _updateGameOver();
            displayController.renderBoard();
        }
    }

    function startGame() {
        player1 = playerFactory(document.querySelector('#p1-area').value, 'X');
        player2 = playerFactory(document.querySelector('#p2-area').value, 'O');
        gameOver = 0;
        activePlayer = player1;
        gameBoard.clearBoard();
        _displayTurn();
        displayController.renderBoard();
    }

    function _displayWinner() {
        if (gameBoard.winner() != 0) {
            displayController.setText(`Player ${gameBoard.winner()} wins!`);
        } else {
            displayController.setText("It's a draw!");
        }
    }

    function _updateGameOver() {
        if (gameBoard.winner() != 0 || gameBoard.boardFull()) {
            gameOver = 1;
            _displayWinner();
        } else {
            gameOver = 0;
        }
    }

    function _displayTurn() {
        displayController.setText(`Current turn: ${activePlayer.name}`);
    }

    function _swapActivePlayer() {
        if (activePlayer == player1) {
            activePlayer = player2;
        } else {
            activePlayer = player1;
        }
    }

    return {
        clickSquare,
        startGame,
    }

})();

displayController.setupBoard();
gameBoard.clearBoard();