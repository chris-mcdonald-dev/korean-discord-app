const { isExercisesChannel } = require("./../utilities");

const typingGame = require("./typing-game");

const GAMES = {
	[typingGame.gameName]: typingGame
}

let noResponseTimeout = null;
let explanationTimeout = null;
let currentGame = null;

/* ___________________ Sends Game Explanation Message _________________ */
function gameExplanation(message) {
	if (!isExercisesChannel(message.channel)) {
		return;
	}

	// Sends typing game explanation
	clearTimeout(noResponseTimeout);

	//Ignores messages from the bot unless it's a message signaling end of game
	if (message.author.bot && !message.content.includes("wins")) {
		clearTimeout(explanationTimeout);
		// Ignores typing game explanation message
		// But sends explanation when game timeout runs out
		if (!message.content.includes("!t")) {
			noResponseTimeout = setTimeout(() => {
				sendResponse(message);
			}, 30000);
		}
		return;
	}
	//Clears timeout and starts new timeout for game explanation
	clearTimeout(explanationTimeout);
	explanationTimeout = setTimeout(() => {
		sendResponse(message);
	}, 25000);
}
/* ------------------------------------------------- */

function sendResponse(message) {
	message.channel.send(
		"...uhh,\n\nAhem... If you would like to start the typing exercise, " +
		"you can type:\n\n<@!" + process.env.CLIENT_ID + "> `" + GAMES[typingGame.gameName].commands.long +
		"`\n- ***OR*** -\n`" + GAMES[typingGame.gameName].commands.short + "` or `" + GAMES[typingGame.gameName].commands.hangul + "`"
	);
	if (gameIsRunning()) {
		GAMES[currentGame].endGame();
		currentGame = null;
	}
}

function shouldStartGame(message, client) {
	if (!isExercisesChannel(message.channel)) {
		sendWrongChannelMessage(client, message);
		return false;
	}
	for (let gameIdentifier in GAMES) {
		if (containsCommandForGame(message.content, gameIdentifier)) {
			return true;
		}
	}
	return false;
}

function sendWrongChannelMessage(client, message) {
	client.channels.fetch(process.env.EXERCISES_CHANNEL).then((exerciseChannel) => {
		message.reply(`Psst...I think you meant to send this in the ${exerciseChannel} channel.\nBut don't worry, no one noticed!`);
	});
}

function containsCommandForGame(messageContent, gameName) {
	if (messageContent.includes(process.env.CLIENT_ID) && messageContent.includes(GAMES[gameName].commands.long)) {
		return true;
	}
	if (messageContent.endsWith(GAMES[gameName].commands.short)) {
		return true;
	}
	return false;
}

function startGame(message) {
	if (gameIsRunning()) {
		endGame(message);
	}

	setUpCurrentGame(message.content).then(() => {
		GAMES[currentGame].startGame(message);
	});
}

function gameIsRunning() {
	return Boolean(currentGame) && GAMES[currentGame].gameIsInProgress();
}

function endGame(message, wroteStopFlag) {
	handleEndGameMessage(message, wroteStopFlag);
	if (gameIsRunning()) {
		GAMES[currentGame].endGame();
	}
	currentGame = null;
}

function handleEndGameMessage(message, wroteStopFlag) {
	if (wroteStopFlag && !gameIsRunning()) {
		message.channel.send("We weren't doing any exercises, silly.");
		return;
	}

	if (wroteStopFlag) {
		message.channel.send('Fine, just don\'t ask me to call you "professor fasty fast" anymore.');
		return;
	}

	if (gameIsRunning()) {
		message.channel.send('Okay, let\'s restart the exercise then, "professor fasty fast".');
		return;
	}
}

async function setUpCurrentGame(messageContent) {
	setGame(messageContent);
	return await GAMES[currentGame].setUp();
}

function setGame(messageContent) {
	for (let gameName in GAMES) {
		if (containsCommandForGame(messageContent, gameName)) {
			currentGame = gameName;
			return;
		}
	}
}

function gameListener(message) {
	GAMES[currentGame].handleMessageDuringGame(message);
	if (!gameIsRunning()) {
		endGame(message, false);
	}
}

module.exports = { gameExplanation, shouldStartGame, startGame, endGame, gameIsRunning, gameListener };
