/* ___________ REQUIRE CORE DEPENDENCIES AND CONFIG FILES ___________ */

const Discord = require("discord.js");
require("dotenv").config();
require("./connections/google-sheets-conn");
require("./database");
import "core-js/stable";
import "regenerator-runtime/runtime";

/* ------------------------------------------------------- */

/* ________________ REQUIRE CUSTOM FUNCTIONS ________________ */

const { explicitWordFilter } = require("./scripts/expletives");
const { koreanObserver } = require("./scripts/korean-channel");
const { resourcesObserver } = require("./scripts/resource-channels");
const { manualUnMute } = require("./scripts/users/permissions");
const { regularQualifyCheck } = require("./scripts/users/user-utilities");
const { isDm, handleDmReactionAdd } = require("./scripts/users/dm/dm");
const { addBookmark, removeBookmark } = require("./scripts/users/dm/bookmarks");
const { unPin50thMsg, getAllChannels, ping, handleHelpCommand } = require("./scripts/utilities");
const { typingGame, typingGameListener, endTypingGame, gameExplanation } = require("./scripts/activities/games");
const { createStudySession, getUpcomingStudySessions, cancelStudySessionFromCommand, cancelStudySessionFromDeletion, subscribeStudySession, unsubscribeStudySession, updateStudySessionDetails } = require("./scripts/activities/study-session");
const { createDynamicTime } = require("./scripts/utility-commands/time-and-date");
const { loadMessageReaction } = require("./utils/cache");
const runScheduler = require("./scheduler").default;
/* ------------------------------------------------------ */

/* ________________ DECLARE MAIN VARIABLES ________________ */

const client = new Discord.Client({ partials: ["CHANNEL", "MESSAGE", "REACTION"] });

const users = {}; // Message counter object for users
const chnlMsgs = {}; // Separate message counter object unrelated to users
function isMessageIgnored(message) {
	if (!message.guild) return true; // Ignores DMs
	if (message.author.bot) {
		if (message.type === "PINS_ADD") message.delete();
		return true; // Ignores messages from bots
	}
	if (message.type === "PINS_ADD") return true; // Ignores PIN messages
	return false;
}

global.tgFirstRoundStarted = false; // Flag for Typing Game below
/* -------------------------------------------------------- */

/* ________________ INITIATING FUNCTION ________________ */

client.on("ready", () => {
	console.log("\nLittle LyonHeart ♡ is online.\n");
	runScheduler(client);
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
	if (isMessageIgnored(message)) return;
	const text = (message.content ?? "").toLowerCase();

	// Filters Explicit Words
	if (explicitWordFilter(message)) {
		return;
	}

	regularQualifyCheck(message);

	// Sends typing game explanation to exercise channel
	gameExplanation(message);

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
		case (text.includes(process.env.CLIENT_ID) && text.includes("typing")) || text === "!t" || text === "!ㅌ":
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
		koreanObserver(message, chnlMsgs, client);
	}

	// Ensure long conversations aren't being had in Resource Channel
	if (channel.id === process.env.LINKS_CHANNEL) {
		resourcesObserver(message, users, client);
	}

	// Create study session
	if (text.startsWith("!study")) createStudySession(message);

	// Find upcoming study sessions
	if (text.startsWith("!upcoming study")) getUpcomingStudySessions(message);

	if (text.startsWith("!cancel study")) {
		cancelStudySessionFromCommand(message);
		return;
	}

	if (text.startsWith("!help")) {
		handleHelpCommand(message);
		return;
	}

	if (text.startsWith("!time")) {
		createDynamicTime(message);
		return;
	}
});
/* --------------------------------------------------- */

client.on("messageUpdate", (oldMessage, newMessage) => {
	explicitWordFilter(newMessage);
	oldMessage.fetch().then((oldMessage) => {
		if (oldMessage.content.startsWith("!study")) {
			updateStudySessionDetails(oldMessage, newMessage);
		}
	});
});

client.on("messageDelete", (message) => {
	const text = (message.content ?? "").toLowerCase();
	if (text.startsWith("!study")) {
		cancelStudySessionFromDeletion(message);
		return;
	}
});

/* ________________ MAIN MESSAGE REACTION ADD LISTENER ________________ */

client.on("messageReactionAdd", async (messageReaction, user) => {
	// If the server has restarted, messages may not be cached
	if (messageReaction.partial) await loadMessageReaction(messageReaction);

	const { message, emoji } = messageReaction;
	const text = (message.content ?? "").toLowerCase();

	// Don't intercept Bot's reactions
	if (user.id === client.user.id) return;

	if (isDm(message)) {
		handleDmReactionAdd(emoji, message);
		return;
	}

	if (emoji.name === '🔖') {
		addBookmark(user, message);
		return;
	}

	// Subscribe to a study session
	if (text.startsWith("!study") && emoji.name === "⭐") subscribeStudySession(message, user);
});
/* --------------------------------------------------- */

/* ________________ MAIN MESSAGE REACTION REMOVE LISTENER ________________ */

client.on("messageReactionRemove", async (messageReaction, user) => {
	// If the server has restarted, messages may not be cached
	if (messageReaction.partial) await loadMessageReaction(messageReaction);
	const { message, emoji } = messageReaction;
	const text = (message.content ?? "").toLowerCase();

	// Don't intercept Bot's reactions
	if (user.id === client.user.id) return;

	if (emoji.name === '🔖') {
		removeBookmark(client, user, message);
		return;
	}

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
	const oldRole = [...oldMember.roles.cache][0][1];
	const newRole = [...newMember.roles.cache][0][1];
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
