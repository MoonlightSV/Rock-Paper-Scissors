
let ws = new WebSocket("ws://localhost:8080");
// выводим новые сообщения в консоль
ws.onopen = () => {
	ws.onmessage = ({data}) => {
		data = JSON.parse(data);
		let selection = JSON.parse(data.selection);
		let opponentSelection = JSON.parse(data.opponentSelection);
		let winner = data.winner;
		let opponentWinner = data.opponentWinner;

		addSelectionResult(opponentSelection, opponentWinner);
		addSelectionResult(selection, winner);

		if (winner) incrementScore(yourScoreSpan);
		if (opponentWinner) incrementScore(opponentScoreSpan);
	}
}

ws.onclose = () => {
	ws.close();
	console.log('Closed');
}

//---------------------------------------------------------------------

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
		//makeSelection(selection);
		ws.send(JSON.stringify(selection));
	});
});

function makeSelection(selection) {
	console.log(selection);
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