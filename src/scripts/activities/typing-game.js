const GoogleSheets = require("../../connections/google-sheets-conn");

const gameName = "typingGame";
const commands = {
    long: "typing",
    short: "!t",
    hangul: "!ㅌ"
};
const numberOfRounds = 5;
let weeklyVocab = {};
let vocabWords = {};

let gameInProgress = false;
let roundCount = 0;
let gameTimeout = null;
let startTime = null;
let endTime = null;
let elapsed = null;
let fullTime = null;
let answers = [];
let winners = {};

async function setUp() {
    vocabWords = await GoogleSheets.fetchVocab("Old Vocab!A2:B");
    weeklyVocab = await GoogleSheets.fetchVocab("Weekly Vocab!A2:B");
    resetGameVariables();
}

function resetGameVariables() {
    gameInProgress = false;
    roundCount = 0;
    gameTimeout = null;
    startTime = null;
    endTime = null;
    elapsed = null;
    fullTime = null;
    answers = getAnswers();
    winners = {};
}

function getAnswers() {
    let answers = [];
    while (answers.length < numberOfRounds) {
        answers.push(getOneVocabWord());
    }
    return answers;
}

function getOneVocabWord() {
    let vocabWord = null;
    const oldOrNewVocab = Math.floor(Math.random() * 4);
    const vocabList = oldOrNewVocab < 1 ? vocabWords : weeklyVocab;
    do {
        const seed = Math.floor(Math.random() * vocabList.length);
        vocabWord = vocabList[seed];
    } while (vocabWordAlreadyUsed(vocabWord))

    return vocabWord;
}

function vocabWordAlreadyUsed(vocabWord) {
    return answers.some((answerObject) => {
        return answerObject.word === vocabWord.word;
    });
}

async function startGame(message) {
    try {
        gameInProgress = true;
        const { word, definition } = answers[roundCount];

        if (roundCount === 0) {
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
            gameTimeout = setTimeout(() => {
                sendChallenge(message, word, definition);
            }, 7200);
        } else {
            sendChallenge(message, word, definition);
        }
    } catch (error) {
        console.log(error);
        return;
    }
}

function sendChallenge(message, word, definition) {
    message.channel.send(`**${word}** - (${definition})`).then(() => {
        startTime = Date.now();
    });
}

function handleMessageDuringGame(message) {
    if (userRestartedGame(message)) return;
    try {
        if (message.content === answers[roundCount].word) {
            roundCount = roundCount + 1;

            // Keeps track of how many times a user has won in the round
            const author = message.author;
            winners[author] = winners[author] + 1 || 1;

            // Calculates time elapsed
            endTime = Date.now();
            elapsed = endTime - startTime;
            const inSeconds = (elapsed / 1000).toFixed(2);
            fullTime = fullTime || 0;
            const unroundedNum = parseFloat(fullTime) + parseFloat(inSeconds);
            fullTime = unroundedNum.toFixed(2);

            message.channel.send(`Manomanoman, you sure are good at this!\n**${author} won round ${roundCount}!**\nI wasn't really counting or anything, but it took you **${inSeconds} seconds**.`);

            if (roundCount < numberOfRounds) {
                setTimeout(
                    () =>
                        message.channel.send(`Round ${roundCount + 1} starts in **5**`).then((msg) => {
                            setTimeout(() => msg.edit(`Round ${roundCount + 1} starts in **4**`), 1000);
                            setTimeout(() => msg.edit(`Round ${roundCount + 1} starts in **3**`), 2000);
                            setTimeout(() => msg.edit(`Round ${roundCount + 1} starts in **2**`), 3000);
                            setTimeout(() => msg.edit(`Round ${roundCount + 1} starts in **1**`), 4000);
                            setTimeout(() => msg.edit("Quick, type the Korean word below!"), 5000);
                            setTimeout(() => startGame(message), 5000);
                        }),
                    1000
                );
            } else {
                setTimeout(() => message.channel.send("I'm going to have to bring my A-game next time."), 1000);
                setTimeout(() => message.channel.send(`__Here are this exercise's **results**__:`), 1250);
                setTimeout(() => message.channel.send(`You got through the entire thing in a total of **${fullTime}** seconds.`), 1500);
                Object.keys(winners).forEach((winner) => {
                    setTimeout(() => message.channel.send(`${winner}: ${winners[winner]} wins`), 1600);
                });

                // Clear the current game variable to trigger the endGame function
                gameInProgress = false;
            }
        }
    } catch (error) {
        console.log(error);
        return;
    }
}

function endGame() {
    clearTimeout(gameTimeout);
    resetGameVariables();
}

function gameIsInProgress() {
    return gameInProgress;
}

function userRestartedGame(message) {
    Object.keys(commands).forEach((command) => {
        if (message.content.includes(commands[command])) {
            endGame();
            startGame(message);
            return true;
        }
    })
    return false;
}

module.exports = { gameName, commands, setUp, startGame, handleMessageDuringGame, endGame, gameIsInProgress };
