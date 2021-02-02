/* ________________ Vocab Words _______________ */

const vocabWords = {
	나: "I / Me",
	회사원: "Employee of a company",
	너무: "Too / Very",
	바쁘다: "To be busy",
	우리: "We / Our",
	보통: "Usually / Usual / Regular",
	주말: "Weekend",
	만나다: "To meet",
	영화: "Movie",
	카페: "Cafe",
	매일: "Everyday",
	일찍: "Early",
	일어나다: "To get up / To wake up",
	물: "Water",
	마시다: "To drink",
	세수하다: "To wash your face",
	옷: "Clothes",
	입다: "To wear / To put on (clothes)",
	화장: "Make-up",
	회사: "Company",
	시험: "Test / Exam",
	의자: "Chair",
	책상: "Desk",
	더럽다: "Dirty",
	위: "Up / Top / Above",
	청소: "Cleaning",
	청소하다: "To clean",
	깨끗하다: "To be clean",
	공책: "Notebook",
	필통: "Pencil Case",
	시작하다: "To begin / To start",
	연락하다: "To contact (someone)",
	타다: "To ride (a bus/subway/car)",
	나오다: "To come out",
	나가다: "To go out",
	들어오다: "To come in",
	들어가다: "To go in",
	사진: "A photograph",
	찍다: "To take (a picture)",
	올해: "This year",
	상황: "A situation",
	한가하다: "To be free / To have time",
	받다: "To receive / To get (something)",
	주다: "To give (something)",
	머리: "Head / Hair",
	허리: "Back / Waist",
	목: "Neck",
	손: "Hand",
	팔: "Arm",
	다리: "Leg",
	발: "Foot",
	배: "Stomach",
	배고프다: "To be hungry",
	배부르다: "To be full",
	다치다: "To get hurt",
	아프다: "To hurt / be sick",
	신발: "Shoe",
	"목이 마르다": "To be thirsty",
	빵: "Bread",
	음료수: "Beverage",
	"좋은 아침이에요": "Good morning",
	아까: "Earlier",
	아침: "Morning (Breakfast)",
	점심: "Lunch",
	저녁: "Evening (Dinner)",
	"잘 자다": "To sleep well",
	"잘 먹겠습니다": "I will eat well",
	먹다: "To eat",
};

const weeklyVocab = {
	피곤하다: "To be tired, exhausted",
	아름답다: "To be beautiful",
	덥다: "To be hot (regarding weather)",
	나무: "Tree",
	춥다: "To be cold",
	산: "Mountain",
	강: "River",
	산책하다: "To take a walk, stroll",
	"해가 뜨다": "To rise (sunrise)",
	"해가 지다": "To set (sunset)",
};
/* --------------------------------------- */

/* ____________ Main Typing Game Function ____________ */

function typingGame(message, client) {
	if (message.channel.id !== process.env.EXERCISES_CHANNEL) {
		client.channels.fetch(process.env.EXERCISES_CHANNEL).then((exerciseChannel) => {
			message.reply(`Psst...I think you meant to send this in the ${exerciseChannel} channel.\nBut don't worry, no one noticed!`);
		});
		return;
	}

	try {
		// Creates Global Typing Game object
		global.typingGame = global.typingGame || {};

		// Checks if waiting to receive input from users
		if (typeof global.typingGame.listenerFlag === "undefined" || global.typingGame.listenerFlag) {
			endTypingGame(message);
		}

		// Sets flag showing game is in play to true
		global.typingFlag = true;

		/* Immediately sets listener flag to true at the start of each round */
		global.typingGame.listenerFlag = true;

		const [max, seed, key, definition] = getVocab();

		if (!global.tgFirstRoundStarted) {
			setTimeout(() => message.channel.send(`So you're professor fasty fast. :smirk:\nWell let's see you type this word in Korean then!`), 1000);
			setTimeout(
				() =>
					message.channel.send("I'll give you the first word in **5**").then((msg) => {
						setTimeout(() => msg.edit("I'll give you the first word in **4**"), 1000);
						setTimeout(() => msg.edit("I'll give you the first word in **3**"), 2000);
						setTimeout(() => msg.edit("I'll give you the first word in **2**"), 3000);
						setTimeout(() => msg.edit("I'll give you the first word in **1**"), 4000);
						setTimeout(() => msg.edit("Quick, type the **Korean** word below!"), 5000);
					}),
				2000
			);

			// Send Korean vocab word to chat
			global.typingGameTimeout = setTimeout(() => {
				message.channel.send(`**${key}** - (${definition})`);
				// 500 ms to approximately account for slight latency
				global.typingGame.startTime = Date.now() + 500;
			}, 7200);
		} else {
			message.channel.send(`**${key}** - (${definition})`);
			global.typingGame.startTime = Date.now() + 500;
		}

		// Sets flag showing first round started to true
		global.tgFirstRoundStarted = true;
		global.typingGameKey = key;
	} catch (error) {
		console.log(error);
		return;
	}
}
/* ------------------------------------------- */

function getVocab() {
	// Pulls random word from vocabWords
	const oldOrNewVocab = Math.floor(Math.random() * Math.floor(4)); //Determines whether user gets old or new vocab
	if (oldOrNewVocab < 1) {
		const max = Object.keys(vocabWords).length;
		const seed = Math.floor(Math.random() * Math.floor(max));
		const key = Object.keys(vocabWords)[seed];
		const definition = vocabWords[key];
		return [max, seed, key, definition];
	} else {
		const max = Object.keys(weeklyVocab).length;
		const seed = Math.floor(Math.random() * Math.floor(max));
		const key = Object.keys(weeklyVocab)[seed];
		const definition = weeklyVocab[key];
		return [max, seed, key, definition];
	}
}

/* _________________ Listens for messages from participants ___________________ */

function typingGameListener(message, client) {
	try {
		if (message.content === global.typingGameKey) {
			/* Sets listener flag to false when user gives the correct answer */
			global.typingGame.listenerFlag = false;
			global.typingGameKey = undefined;

			// Creates round counter and increases count
			global.typingGame.roundCount = global.typingGame.roundCount + 1 || 1;

			const author = message.author;

			//Creates list of winners
			global.typingGame.winners = global.typingGame.winners || {};

			// Keeps track of how many times a user has won in the round
			global.typingGame.winners[author] = global.typingGame.winners[author] + 1 || 1;

			// Calculates time elapsed
			global.typingGame.endTime = Date.now();
			global.typingGame.elapsed = global.typingGame.endTime - global.typingGame.startTime;
			const inSeconds = (global.typingGame.elapsed / 1000).toFixed(2);
			global.typingGame.fullTime = global.typingGame.fullTime || 0;
			const unroundedNum = parseFloat(global.typingGame.fullTime) + parseFloat(inSeconds);
			global.typingGame.fullTime = unroundedNum.toFixed(2);

			message.channel.send(`Manomanoman, you sure are good at this!\n**${author} won round ${global.typingGame.roundCount}!**\nI wasn't really counting or anything, but it took you **${inSeconds} seconds**.`);

			if (global.typingGame.roundCount < 5) {
				setTimeout(
					() =>
						message.channel.send(`Round ${global.typingGame.roundCount + 1} starts in **5**`).then((msg) => {
							setTimeout(() => msg.edit(`Round ${global.typingGame.roundCount + 1} starts in **4**`), 1000);
							setTimeout(() => msg.edit(`Round ${global.typingGame.roundCount + 1} starts in **3**`), 2000);
							setTimeout(() => msg.edit(`Round ${global.typingGame.roundCount + 1} starts in **2**`), 3000);
							setTimeout(() => msg.edit(`Round ${global.typingGame.roundCount + 1} starts in **1**`), 4000);
							setTimeout(() => msg.edit("Quick, type the Korean word below!"), 5000);
							setTimeout(() => typingGame(message), 5000);
						}),
					1000
				);
			} else {
				const winners = global.typingGame.winners;
				const fullTime = global.typingGame.fullTime;
				setTimeout(() => message.channel.send("I'm going to have to bring my A-game next time."), 1000);
				setTimeout(() => message.channel.send(`__Here are this exercise's **results**__:`), 1250);
				setTimeout(() => message.channel.send(`You got through the entire thing in a total of **${fullTime}** seconds.`), 1500);
				Object.keys(winners).forEach((winner) => {
					setTimeout(() => message.channel.send(`${winner}: ${winners[winner]} wins`), 1600);
				});
				// Ends game
				global.typingGame.listenerFlag = false;
				global.typingFlag = false;
				endTypingGame(message);
			}
		}
	} catch (error) {
		console.log(error);
		return;
	}
}
/* -------------------------------------------------- */

/* ____________________ Ends Typing Game __________________ */

function endTypingGame(message) {
	if (typeof wroteStopFlag !== "undefined") {
		if (global.typingFlag) {
			message.channel.send('Fine, just don\'t ask me to call you "professor fasty fast" anymore.');
		} else {
			message.channel.send("We weren't doing any exercises, silly.");
		}
	} else if (global.typingFlag) {
		message.channel.send('Okay, let\'s restart the exercise then, "professor fasty fast".');
	}
	clearTimeout(global.typingGameTimeout);
	global.typingGame = {};
	// Sets flag showing game is in play to false
	global.typingFlag = false;
	global.tgFirstRoundStarted = false;
}
/* -------------------------------------------------- */

/* ___________________ Sends Game Explanation Message _________________ */
function gameExplanation(message) {
	const text = message.content;
	// Sends typing game explanation
	if (message.channel.id === process.env.EXERCISES_CHANNEL) {
		clearTimeout(global.noResponseTimeout);

		//Ignores messages from the bot unless it's a message signaling end of game
		if (message.author.bot && !text.includes("wins")) {
			clearTimeout(global.explanationTimeout);
			// Ignores typing game explanation message
			// But sends explanation when game timeout runs out
			if (!text.includes("!t")) {
				global.noResponseTimeout = setTimeout(() => {
					sendResponse(message);
				}, 30000);
			}
			return;
		}
		//Clears timeout and starts new timeout for game explanation
		clearTimeout(global.explanationTimeout);
		global.explanationTimeout = setTimeout(() => {
			sendResponse(message);
		}, 10000);
	}
	function sendResponse(message) {
		message.channel.send("...uhh,\n\nAhem... If you would like to start the typing exercise, you can type:\n\n<@!784522323755663411> `typing`\n- ***OR*** -\n`!t`");
	}
}
/* ------------------------------------------------- */

module.exports = { typingGame, typingGameListener, endTypingGame, gameExplanation };
