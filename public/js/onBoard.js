import { transferPiece, changeColor, cloneBoard, updateBoard } from "./utility.js";
import { movePiece } from "./movePiece.js";

export const onBoard = (squares, square, me, socket, button='') => {

    return {
        click: function(){

            console.log('square', square);

            const selectPiece = () => {
                me.selectedPiece.name = square.firstElementChild.classList[0];
                me.selectedPiece.color = square.firstElementChild.classList[1];
                me.selectedPiece.xValue = +square.dataset.vert;
                me.selectedPiece.yValue = +square.dataset.hori;
                me.selectedPiece.position = +square.dataset.pos;
                square.classList.add('highlighter');
            }

            const unselectPiece = () => {
                squares[me.selectedPiece.position].classList.remove('highlighter');
                me.selectedPiece.name = '';
                me.selectedPiece.color = '';
                me.selectedPiece.xValue = '';
                me.selectedPiece.yValue = '';
                me.selectedPiece.position = '';
            }

            const pieceDataStore = {
                checkType: '',
                swap: false,
                hasKingCastled: me.hasKingCastled,
                probeBoard: me.board.slice()
            };
            let movedPiece;

            switch(me.selectedPiece.color) {
                case '':
                    if (square.firstElementChild && (square.firstElementChild.classList[1] === me.playersTurn)) {
                        selectPiece();
                    }
                    break;
                case 'white':
                case 'black':
                    if (square.firstElementChild && (square.firstElementChild.classList[1] === me.selectedPiece.color)) {
                        unselectPiece();
                        break;
                    }
                    if (me.playersTurn !== me.playersColor) {
                        unselectPiece();
                        break;
                    }
                    if (!pieceDataStore.swap) {
                        me.targetSquare = {
                            name: ((square.firstElementChild && square.firstElementChild.classList[0]) || ''),
                            color: ((square.firstElementChild && square.firstElementChild.classList[1]) || ''),
                            xValue: +square.dataset.vert,
                            yValue: +square.dataset.hori,
                            position: +square.dataset.pos
                        }
                    }
                    movedPiece = movePiece(me.selectedPiece, me.targetSquare, pieceDataStore, button);
                    if (movedPiece) {
                        me.playersTurn = changeColor(me.playersTurn);
                        console.log("thisme", me);
                        try {
                            socket.emit('movePiece', 
                            {
                                name: me.name,
                                username: me.username,
                                board: pieceDataStore.probeBoard,
                                playersTurn: me.playersTurn,
                                hasKingCastled: pieceDataStore.hasKingCastled,
                                checkType: pieceDataStore.checkType
                            }, 
                            (error) => {
                                if (error) {
                                    console.log(error)
                                }
                                console.log('weback');
                                me.hasKingCastled = pieceDataStore.hasKingCastled;
                                me.board = pieceDataStore.probeBoard;
                                console.log('thatme', me);
                                //transferPiece(squares, me.selectedPiece.position, me.targetSquare.position);
                                updateBoard(pieceDataStore.probeBoard);
                                unselectPiece();
                            });
                        } catch {
                            me.playersTurn = changeColor(me.playersTurn);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
}