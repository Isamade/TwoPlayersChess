import { onBoard } from "./onBoard.js";

export const updateBoard = (board, squares, me, socket) => {
    const table = document.querySelector('#grid');
    table.innerHTML = '';
    for (let y = 1; y < 9; y++){
        const row = document.createElement('tr');
        for (let x = 1; x < 9; x++){
            const cell = document.createElement('td');
            const position = (y - 1) * 8 + (x - 1);
            cell.dataset.hori = `${y}`;
            cell.dataset.vert = `${x}`;
            cell.dataset.pos = `${position}`;
            cell.classList.add('selectall');

            let chessPiece;
            if (board[position]){
                chessPiece = document.createElement('div');
                chessPiece.textContent = board[position].charAt(0);
                chessPiece.classList.add(board[position]);
                chessPiece.classList.add(
                    findColor(board[position])
                );
                cell.appendChild(chessPiece);
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    squares = document.querySelectorAll('.selectall');
    squares.forEach((square) => { 
        square.addEventListener('click', onBoard(squares, square, me, socket).click)
    });
}

export const cloneBoard = (squares) => {
    const arr = [];
    squares.forEach(square => {
        arr.push(
            ((square.firstElementChild && square.firstElementChild.classList[0]) || '')
        )
    });
    return arr;
}

export const transferPiece = (squares, currentSquare, targetSquare) => {
    console.log(currentSquare, targetSquare);
    console.log('target', squares[targetSquare]);
    console.log('current', squares[currentSquare]);
    squares[targetSquare].firstElementChild && squares[targetSquare].removeChild(squares[targetSquare].firstElementChild);
    squares[targetSquare].appendChild(squares[currentSquare].firstElementChild);
    //squares[currentSquare].removeChild(squares[currentSquare]);
}

export const findKings = (board) => {
    const kingsPositions = {
        white: null,
        black: null
    }
    board.forEach((value, index) => {
        if (value === 'KW') {
            kingsPositions.white = index;
        }
        if (value === 'KB') {
            kingsPositions.black = index;
        }
    });
    return kingsPositions;
}

export const changeColor = (color) => {
    return (color === 'white') ? 'black' : 'white';
}

export const findColor = (chessPiece) => {
    return chessPiece.charAt(1) === 'W' ? 'white' : chessPiece.charAt(1) === 'B' ? 'black' : '';
}

export const updatePosition = (probeBoard, currentPosition, targetPosition) => {
    probeBoard[targetPosition] = probeBoard[currentPosition];
    probeBoard[currentPosition] = '';
}

export const diagonalMove = (probeBoard, currentSquare, targetSquare) => {
    let movePossible = false;
    if (Math.abs(currentSquare.xValue - targetSquare.xValue) === Math.abs(currentSquare.yValue - targetSquare.yValue)) {
        movePossible = true;
        if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
            for (let pos = currentSquare.position - 9; pos > targetSquare.position; pos = pos - 9) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false };
            }
        }
        else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
            for (let pos = currentSquare.position - 7; pos > targetSquare.position; pos = pos - 7) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
            for (let pos = currentSquare.position + 7; pos < targetSquare.position; pos = pos + 7) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
            for (let pos = currentSquare.position + 9; pos < targetSquare.position; pos = pos + 9) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
    }
    return movePossible;
}

export const linearMove = (probeBoard, currentSquare, targetSquare) => {
    let movePossible = false;
    if (currentSquare.xValue === targetSquare.xValue || currentSquare.yValue === targetSquare.yValue) {
        movePossible = true;
        if ((targetSquare.xValue === currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
            for (let pos = currentSquare.position - 8; pos > targetSquare.position; pos = pos - 8) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue === currentSquare.yValue)) {
            for (let pos = currentSquare.position - 1; pos > targetSquare.position; pos = pos - 1) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue === currentSquare.yValue)) {
            for (let pos = currentSquare.position + 1; pos < targetSquare.position; pos = pos + 1) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue === currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
            for (let pos = currentSquare.position + 8; pos < targetSquare.position; pos = pos + 8) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
    }
    return movePossible;
}