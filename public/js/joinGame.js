import { updateBoard } from "./utility.js";
import { onBoard } from "./onBoard.js";

export class joinGame {
    constructor(name='firstMatch', username='john') {
        this.id = '';
        this.name = name;
        this.username = username;
        this.opponent = '';
        this.selectedPiece = {
            name: '',
            color: '',
            xValue: '',
            yValue: '',
            position: ''
        };
        this.targetSquare = {};
        this.playersTurn = '';
        this.playersColor = '';
        this.board = [];
        this.hasKingCastled = false;
    }

    playGame(socket, squares){
        const me = this;

        socket.emit('joinGame', {name: this.name, username: this.username}, (error, id, opponent, playersColor, board, playersTurn) => {  
            if (error) {
                return console.log(error)
            };

            this.id = id;
            this.opponent = opponent;
            this.playersColor = playersColor;
            this.board = board;
            this.playersTurn = playersTurn;

            updateBoard(board, squares, this, socket);

            /*squares = document.querySelectorAll('.selectall');
            squares.forEach((square) => { 
                square.addEventListener('click', onBoard(squares, square, me, socket).click)
            });*/

            document.querySelectorAll('.swap-btn').forEach((button) => {
                button.addEventListener('click', onBoard(squares, this.targetSquare, me, socket, button).click)
            });
        });
    }
}