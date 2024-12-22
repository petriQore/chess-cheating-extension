import { Chess } from 'chess.js'

const string = "e4 e6 Bb5 a5 d4 f5 exf5 exf5 Qe2+ Kf7 Bc4+ Kg6 Nf3 h5 Ne5+ Kh7 Qxh5+ Nh6";


let moves = string.split(" ");
const chess = new Chess();

moves.forEach(move => {
    chess.move(move);
});

console.log(chess.fen());

