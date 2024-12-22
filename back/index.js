import { Chess } from 'chess.js';
import { spawn } from 'child_process';
import express from 'express';
const app = express();
import cors from 'cors';
app.use(cors());
const stockfish = spawn("../stockfish.exe"); 

stockfish.stdin.write("uci\n");
stockfish.stdin.write('setoption name multipv value 5\n');

const port = 3000;

app.get('/send-data', (req, res) => {
    const moves = req.query.moves.trim().split(" ");
    analyzePosition(moves).then(result => {
        res.json(result);
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


// const string = "g4 f6 d4 a6 e4 Kf7 Bc4+ e6 d5 c5 a4 Ra7 Bf4 Qa5+ Nc3 d6 dxe6+ Ke8 Bd2 Bd7 exd7+ Nxd7 f4 Qb6 Nf3 h6 O-O Qd8 Qe2 Qc8 Nd5 h5 gxh5 Ne5 fxe5 dxe5 Qg2 Rh6 Kh1 Qd8 Bxh6 Nxh6 Qg6+ Kd7 Be2 Qa5 Nxe5+ Kd8 Rxf6 gxf6";

// let moves = string.trim().split(" ");
// const chess = new Chess();

// moves.forEach(move => {
//     chess.move(move);
// });

// const fen = chess.fen();
// console.log('FEN:', fen);

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

async function analyzePosition(moves) {
    if (!stockfish) {
      throw new Error('errrrrrrr');
    }
  
    const chess = new Chess();
    moves.forEach(move => {
      chess.move(move);
  });
  const fen = chess.fen();


    return new Promise((resolve) => {
      const score = [];
      const nextmove = [];
      
      stockfish.stdout.on('data', (data) => {
        const output = data.toString();
        // console.log('output:', output);  // comment lme
        
        if (output.includes('info depth 15')) {

          const scoreMatches = output.matchAll(/score\s(\S+\s*\S*)/g);
          for (const match of scoreMatches) {
            score.push(match[1]);
          }
          
          const moveMatches = output.matchAll(/(?<=pv\s)([a-h][1-8][a-h][1-8](?:\s[a-h][1-8][a-h][1-8])*)/g);
          for (const match of moveMatches) {
            nextmove.push(match[1].split(" ")[0]);
          }
        }
        
        const result = zip(nextmove, score);    
        const uniqueResult = Array.from(
          new Set(result.map(item => JSON.stringify(item)))
        ).map(item => JSON.parse(item));


        if (output.includes('bestmove')) {
            console.log('Result:', uniqueResult);
            resolve(uniqueResult);
        }
      });
  

      stockfish.stdin.write(`position fen ${fen}\n`);
      stockfish.stdin.write("go depth 15\n");
    });
  }

// analyzePosition(fen);  

//match score???: score\s(\S*\s*\S*)
