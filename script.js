
let ws = new WebSocket('ws://localhost:8080');
// выводим новые сообщения в консоль
ws.onopen = () => {
	ws.onmessage = ({data}) => {
		switch (data) {
			case 'wait':
				resetGame();
				gameStartFlag = false;
				console.log('Waiting for opponent...');
			break;
			case 'start':
				selectionButtons.forEach(selectionButton => {
					selectionButton.removeAttribute('disabled');
				});
				gameStartFlag = true;
				console.log('The game is on...');
			break;
			case 'chose':
				finalColumn.classList.add('chosen');
				break;
			default:
				if (gameStartFlag) makeSelection(data);
		}
	}
}

ws.onclose = () => {
	ws.close();
	resetGame();
	console.log('Closed');
}

//---------------------------------------------------------------------

let gameStartFlag = false;

const selectionButtons = document.querySelectorAll('[data-selection]');
const finalColumn = document.querySelector('[data-final-column]');
const yourScoreSpan = document.querySelector('[data-your-score]');
const opponentScoreSpan = document.querySelector('[data-opponent-score]');
const SELECTIONS = [
	{
		name:'rock',
		emoji: '✊',
		beats: 'scissors'
	},
	{
		name:'paper',
		emoji: '✋',
		beats: 'rock'
	},
	{
		name:'scissors',
		emoji: '✌️',
		beats: 'paper'
	}
];

selectionButtons.forEach(selectionButton => {
	selectionButton.addEventListener('click', e => {
		const selectionName = selectionButton.dataset.selection;
		const selection = SELECTIONS.find(selection => selection.name === selectionName);
		selectionButtons.forEach(selectionButton => {
			selectionButton.classList.remove('selection_checked');
		});
		selectionButton.classList.add('selection_checked');
		ws.send(JSON.stringify(selection));
	});
});

function makeSelection(data) {
	data = JSON.parse(data);
	let selection = JSON.parse(data.selection);
	let opponentSelection = JSON.parse(data.opponentSelection);
	let winner = data.winner;
	let opponentWinner = data.opponentWinner;

	addSelectionResult(opponentSelection, opponentWinner);
	addSelectionResult(selection, winner);

	if (winner) incrementScore(yourScoreSpan);
	if (opponentWinner) incrementScore(opponentScoreSpan);

	selectionButtons.forEach(selectionButton => {
		selectionButton.classList.remove('selection_checked');
	});
	finalColumn.classList.remove('chosen');
}

function addSelectionResult(selection, winner) {
	const div = document.createElement('div');
	div.innerText = selection.emoji;
	div.classList.add('result-selection');
	if (winner) div.classList.add('winner');
	finalColumn.after(div);
}

function incrementScore(scoreSpan) {
	scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1;
}

function resetGame() {
	selectionButtons.forEach(selectionButton => {
		selectionButton.setAttribute('disabled', 'disabled');
		selectionButton.classList.remove('selection_checked');
	});
	finalColumn.classList.remove('chosen');
	yourScoreSpan.innerText = '0';
	opponentScoreSpan.innerText = '0';
	let selectionResults = document.querySelectorAll('.result-selection');
	selectionResults.forEach(item => {
		item.remove();
	});
}