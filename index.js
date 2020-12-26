// Require core dependencies and config files
const Discord = require("discord.js");
require("dotenv").config();

// Require higher level functions
const { explicitWordFilter } = require("./scripts/expletives");
const { koreanObserver } = require("./scripts/korean-channel");
const { resourcesObserver } = require("./scripts/resource-channels");
const { manualUnMute } = require("./scripts/users/permissions");
const { regularQualifyCheck } = require("./scripts/users/user-utilities");
const { unPin50thMsg, getAllChannels, logMessageDate, ping } = require("./scripts/utilities");
const { typingGame, typingGameListener, endTypingGame } = require("./scripts/activities/games");

const client = new Discord.Client();
const counter = {};
global.tgFirstRoundStarted = false;

// ----- TRIGGERED EVENTS -----

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

// Message Listener
client.on("message", (message) => {
	if (!message.guild) return; // Ignores DMs
	text = message.content.toLowerCase();
	regularQualifyCheck(message);
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

	wroteStopFlag = false;
	// --- EXERCISES ---
	switch (true) {
		case text.includes(process.env.CLIENT_ID) && text.includes("typing"):
			typingGame(message);
			break;
		// case text === `{process.env.CLIENT_ID} categories`:
		// 	categoriesGame(message, client);
		// 	break;
		case text.includes(process.env.CLIENT_ID) && text.includes("stop"):
			wroteStopFlag = true;
			endTypingGame(message, wroteStopFlag);
			break;
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

	// Korean Channel Observer
	channel = message.channel;
	if (channel.id === process.env.KOREAN_CHANNEL || channel.id === process.env.TEST_CHANNEL) {
		koreanObserver(message, counter, client);
	}

	// Resource Channel Observer
	if (channel.id === process.env.LINKS_CHANNEL) {
		resourcesObserver(message, counter, client);
	}
});

client.on("channelPinsUpdate", (channel) => {
	channel.messages
		.fetchPinned()
		.then((messages) => {
			if (messages.size === 50) unPin50thMsg(channel);
		})
		.catch(console.error);
});

// Sends message to new members added to the 선배 role
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

client.login(process.env.ACCESS_TOKEN);
