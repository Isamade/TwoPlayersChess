const socket = io();

let game, squares;

import { cloneBoard, transferPiece, findKings, changeColor, updateBoard } from "./utility.js";
import { newGame } from "./newGame.js";
import { joinGame } from "./joinGame.js";
import { onBoard } from "./onBoard.js";
import { movePiece } from "./movePiece.js";
import { kingCheckType } from "./kingCheckType.js";
import { pawn } from "./chessPieces.js";

document.querySelector('.new-game').addEventListener('click', () => {
    game = new newGame();
    game.startGame(socket, squares);
});

document.querySelector('.join-game').addEventListener('click', () => {
    game = new joinGame();
    game.playGame(socket, squares);
});

socket.on('playerTwo', (username) => {
    game.opponent = username;
});

socket.on('movedPiece', ({board, checkType}) => {
    game.board = board;
    game.playersTurn = changeColor(game.playersTurn);
    console.log('game', game);
    updateBoard(board, squares, game, socket);
    if (checkType) {
        console.log(checkType)
    }
});