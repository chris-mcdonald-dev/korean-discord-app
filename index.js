/* ___________ REQUIRE CORE DEPENDENCIES AND CONFIG FILES ___________ */

const Discord = require("discord.js");
require("dotenv").config();
require("./database");

/* ------------------------------------------------------- */

/* ________________ REQUIRE CUSTOM FUNCTIONS ________________ */

const { explicitWordFilter } = require("./scripts/expletives");
const { koreanObserver } = require("./scripts/korean-channel");
const { resourcesObserver } = require("./scripts/resource-channels");
const { manualUnMute } = require("./scripts/users/permissions");
const { regularQualifyCheck } = require("./scripts/users/user-utilities");
const { unPin50thMsg, getAllChannels, logMessageDate, ping } = require("./scripts/utilities");
const { typingGame, typingGameListener, endTypingGame, gameExplanation } = require("./scripts/activities/games");
const { createStudySession, getUpcomingStudySessions, subscribeStudySession, unsubscribeStudySession, cancelConfirmationStudySession } = require("./scripts/activities/study-session");
/* ------------------------------------------------------ */

/* ________________ DECLARE MAIN VARIABLES ________________ */

const client = new Discord.Client();
const counter = {}; // Message counter object for users
global.tgFirstRoundStarted = false; // Flag for Typing Game below
/* -------------------------------------------------------- */

/* ________________ INITIATING FUNCTION ________________ */

client.on("ready", () => {
	console.log("\nLittle LyonHeart ♡ is online.\n");
	client.guilds
		.fetch(process.env.SERVER_ID) //server ID
		.then((guild) => {
			global.guild = guild;
		})
		.catch(console.error);
	getAllChannels(client);
});
/* --------------------------------------------- */

/* ________________ MAIN MESSAGE LISTENER ________________ */

client.on("message", (message) => {
	if (!message.guild) return; // Ignores DMs
	const text = message.content.toLowerCase();
	regularQualifyCheck(message);

	// Sends typing game explanation to exercise channel
	gameExplanation(message);

	if (message.author.bot) {
		if (message.type === "PINS_ADD") message.delete();
		return; // Ignores messages from bots
	}
	if (message.type === "PINS_ADD") return; // Ignores PIN messages
	if (text.includes("http")) return; // Ignores all links
	if (text.includes("wake up") && text.includes(process.env.CLIENT_ID)) {
		// Bot's ID
		ping(message);
		return;
	}
	if (text.includes("unmute everyone") && text.includes(process.env.CLIENT_ID)) {
		unMuteAll(message);
		return;
	}
	if (text.includes("copy") && text.includes("pins") && text.includes(process.env.CLIENT_ID)) {
		getPinned(message);
		return;
	}
	if (text.includes("paste") && text.includes("pins") && text.includes(process.env.CLIENT_ID)) {
		movePinned(message, global.pinnedMessages);
		return;
	}

	// --- EXERCISES ---
	let wroteStopFlag = false;

	switch (true) {
		// Start Typing Game
		case (text.includes(process.env.CLIENT_ID) && text.includes("typing")) || text === "!t":
			typingGame(message, client);
			break;
		// Stop Typing Game
		case text.includes(process.env.CLIENT_ID) && text.includes("stop"):
			wroteStopFlag = true;
			endTypingGame(message, wroteStopFlag);
			break;
		// Pass Message to Listener (while exercise is in progress)
		case global.typingFlag === true:
			typingGameListener(message, client);
			break;
	}

	// Filters Explicit Words
	explicitWordFilter(message);

	// Manual unmute
	if (text.includes("unmute <@!") || text.includes("unmute @")) {
		try {
			userId = text.split(" ")[1];
			userId = userId.match(/\d/g).join("");
			manualUnMute(message, userId, client);
		} catch (e) {
			console.log(e);
		}
	}

	// Ensure long conversations in English aren't being had in Korean Channel
	const channel = message.channel;
	if (channel.id === process.env.KOREAN_CHANNEL) {
		koreanObserver(message, counter, client);
	}

	// Ensure long conversations aren't being had in Resource Channel
	if (channel.id === process.env.LINKS_CHANNEL) {
		resourcesObserver(message, counter, client);
	}

	// Create study session
	if(text.startsWith("!study")) createStudySession(message);

	// Find upcoming study sessions
	if(text.startsWith("!upcoming study")) getUpcomingStudySessions(message);
});
/* --------------------------------------------------- */

/* ________________ MAIN MESSAGE REACTION ADD LISTENER ________________ */

client.on("messageReactionAdd", (messageReaction, user) => {
	const {message, emoji} = messageReaction;
	const text = message.content.toLowerCase();

	// Don't intercept Bot's reactions
	if (user.id === client.user.id) return;

	// Subscribe to a study session
	if (text.startsWith("!study") && emoji.name === "⭐") subscribeStudySession(message, user);

	// Cancel study session
	if (text.startsWith("!study") && emoji.name === "❌") cancelConfirmationStudySession(message, user);
});
/* --------------------------------------------------- */

/* ________________ MAIN MESSAGE REACTION REMOVE LISTENER ________________ */

client.on("messageReactionRemove", (messageReaction, user) => {
	const {message, emoji} = messageReaction;
	const text = message.content.toLowerCase();

	// Don't intercept Bot's reactions
	if (user.id === client.user.id) return;

	// Unsubscribe to a study session
	if (text.startsWith("!study") && emoji.name === "⭐") unsubscribeStudySession(message, user);
});
/* --------------------------------------------------- */

/* ________________ MANAGE PINNED MESSAGES ________________ */
client.on("channelPinsUpdate", (channel) => {
	channel.messages
		.fetchPinned()
		.then((messages) => {
			// Discord only allows 50 pinned messages at once
			if (messages.size === 50) unPin50thMsg(channel);
		})
		.catch(console.error);
});
/* ------------------------------------------------- */

/* _____________ SENDS MESSAGE TO NEW MEMBERS ADDED TO THE 선배 ROLE _____________*/
client.on("guildMemberUpdate", (oldMember, newMember) => {
	oldRole = [...oldMember.roles.cache][0][1];
	newRole = [...newMember.roles.cache][0][1];
	if (oldRole.id === newRole.id) return;
	console.log(`${newMember.user.username}\n  Old Role:\n     ${oldRole.name} \n  New Role:\n     ${newRole.name}`);
	if (newRole.id === process.env.MODERATORS) {
		client.channels.fetch(process.env.LINKS_CHANNEL).then((resources) => {
			client.channels.fetch(process.env.MOD_CHANNEL).then((seniorChannel) => {
				newMember.user.send(`Hey! \nChris just added you to the 선배 (Senior Classmates) role. Thanks for helping people out in the study group! :smiley: \n\nYou'll notice that you now have access to the ${seniorChannel}. It's a way for us to communicate with each other and make sure the group is running smoothly.\nYou now have the ability to pin messages in the ${resources} channel. :pushpin: \n\nThere are also a few other things you can do now as well. You can head over to the ${seniorChannel} and check out the pinned messages!`);
			});
		});
	}
});
/* ------------------------------------------------- */

/* ________________ FINALLY LOG IN TO DISCORD ________________ */

client.login(process.env.ACCESS_TOKEN);
/* ---------------------------------------------------- */
