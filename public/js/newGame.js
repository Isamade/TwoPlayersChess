import { cloneBoard } from "./utility.js";
import { onBoard } from "./onBoard.js";

export class newGame {
    constructor(name='firstMatch', username='jackie', color='white') {
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
        this.playersTurn = 'white';
        this.playersColor = color;
        this.board = [];
        this.hasKingCastled = false;
    }

    startGame(socket, squares){
        const table = document.querySelector('#grid');
        table.innerHTML = '';
        const me = this;

        for (let y = 1; y < 9; y++){
            const row = document.createElement('tr');
            for (let x = 1; x < 9; x++){
                const cell = document.createElement('td');
                const position = (y - 1) * 8 + (x - 1);
                cell.dataset.hori = `${y}`;
                cell.dataset.vert = `${x}`;
                cell.dataset.pos = `${position}`;
                cell.classList.add('selectall');
                if((y === 1 || y === 8) && (x === 1 || x === 8)){
                    const rook = document.createElement('div');
                    rook.textContent = 'R';
                    if(y === 1 && (x === 1 || x === 8)){
                        rook.classList.add('RW');
                        rook.classList.add('white');
                        cell.appendChild(rook);
                    }
                    if(y === 8 && (x === 1 || x === 8)){
                        rook.classList.add('RB');
                        rook.classList.add('black');
                        cell.appendChild(rook);
                    }
                }
                if((y === 1 || y === 8) && (x === 2 || x === 7)){
                    const knight = document.createElement('div');
                    knight.textContent = 'Kn';
                    if(y === 1 && (x === 2 || x === 7)){
                        knight.classList.add('NW');
                        knight.classList.add('white');
                        cell.appendChild(knight);
                    }
                    if(y === 8 && (x === 2 || x === 7)){
                        knight.classList.add('NB');
                        knight.classList.add('black');
                        cell.appendChild(knight);
                    }
                }
                if((y === 1 || y === 8) && (x === 3 || x === 6)){
                    const bishop = document.createElement('div');
                    bishop.textContent = 'B';
                    if(y === 1 && (x === 3 || x === 6)){
                        bishop.classList.add('BW');
                        bishop.classList.add('white');
                        cell.appendChild(bishop);
                    }
                    if(y === 8 && (x === 3 || x === 6)){
                        bishop.classList.add('BB');
                        bishop.classList.add('black');
                        cell.appendChild(bishop);
                    }
                }
                if(y === 1 && x === 4){
                    const king = document.createElement('div');
                    king.classList.add('KW');
                    king.classList.add('white');
                    king.textContent = 'K';
                    cell.appendChild(king);
                }
                if(y === 8 && x === 4){
                    const king = document.createElement('div');
                    king.classList.add('KB');
                    king.classList.add('black');
                    king.textContent = 'K';
                    cell.appendChild(king);
                }
                if(y === 1 && x === 5){
                    const queen = document.createElement('div');
                    queen.classList.add('QW');
                    queen.classList.add('white');
                    queen.textContent = 'Q';
                    cell.appendChild(queen);
                }
                if(y === 8 && x === 5){
                    const queen = document.createElement('div');
                    queen.classList.add('QB');
                    queen.classList.add('black');
                    queen.textContent = 'Q';
                    cell.appendChild(queen);
                }
                if(y === 2 && (0 < x < 9)){
                    const pawn = document.createElement('div');
                    pawn.classList.add('PW');
                    pawn.classList.add('white');
                    pawn.textContent = 'P';
                    cell.appendChild(pawn);
                }
                if(y === 7 && (0 < x < 9)){
                    const pawn = document.createElement('div');
                    pawn.classList.add('PB');
                    pawn.classList.add('black');
                    pawn.textContent = 'P';
                    cell.appendChild(pawn);
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        squares = document.querySelectorAll('.selectall');    
        this.board = cloneBoard(squares);

        socket.emit('newGame', {name: this.name, username: this.username, playersColor: this.playersColor, board: this.board}, (error, id) => {    
            if (error) {
                return console.log(error)
            }

            this.id = id;
            
            squares.forEach((square) => { 
                square.addEventListener('click', onBoard(squares, square, me, socket).click)
            });

            document.querySelectorAll('.swap-btn').forEach((button) => {
                button.addEventListener('click', onBoard(squares, this.targetSquare, me, socket, button).click)
            });
        });
    }
}