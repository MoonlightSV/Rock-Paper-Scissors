const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080
});

let playerNumber = 0;
let players = [];
let selections = new Map();
let winner = new Map();

wss.on('connection', ws => {
  ws.on('message', message => {
    selections.set(ws, message);
    if (selections.size === 2) {
      makeSelection();
    }    
  });

  ws.on('close', () => {
    playerNumber -= 1;
    if (players.includes(ws)) players.splice(players.indexOf(ws), 1);
  });

  playerNumber += 1;
  if (playerNumber <= 2) {
    players.push(ws);
  } else {
    console.log('Too much');
    ws.close();
  }
});

function makeSelection() {
  winner.set(
    players[0], 
    isWinner(
      JSON.parse( selections.get(players[0]) ),
      JSON.parse( selections.get(players[1]) )
    )
  );
  winner.set(
    players[1],
    isWinner( 
      JSON.parse( selections.get(players[1]) ),
      JSON.parse( selections.get(players[0]) )
    )
  );

  sendData(players[0], players[1]);
  sendData(players[1], players[0]); 

  selections.clear();
  winner.clear();
}

function isWinner(selection, opponentSelection) {
  return selection.beats === opponentSelection.name;
}

function sendData(player, opponent) {
  let data = new Object();

  data.selection = selections.get(player);
  data.opponentSelection = selections.get(opponent);
  data.winner = winner.get(player);
  data.opponentWinner = winner.get(opponent);

  player.send(JSON.stringify(data));
} 