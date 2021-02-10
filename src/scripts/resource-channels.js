const { mute } = require("./users/permissions");
const { logMessageDate } = require("./utilities");
const { User } = require("./users/user-utilities");

const timeLimit = 120000;
const warnOn = 3;
const muteOn = 4;
const timeouts = {};

// Resource Channel Spam Observer
function resourcesObserver(message, users, client) {
	if (message.member.hasPermission("MANAGE_ROLES")) return;

	const id = message.author.id;
	const name = message.author.username;
	const channelName = message.channel.name;

	// Initializes new User instance if not defined.
	users[id] = users[id] || new User(name, id);
	users[id].addChannelMsg(message);

	users[id].incrementCount(channelName);

	const params = { users, id, channelName, message, client };
	checkTimeoutFlag(params);
	checkCount(params);
}

// Checks count and warns or mutes accordingly
function checkCount(params) {
	const { users, id, channelName, message, client } = params;
	if (users[id].getCount(channelName) === warnOn) {
		logMessageDate();
		resourceChannelWarning(message, client);
	}
	if (users[id].getCount(channelName) === muteOn) {
		logMessageDate();
		mute(message);
		resourcesMuteMessage(message, client);
	}
}

// Check if message cooldown time is up (shown by timeoutFlag)
function checkTimeoutFlag(params) {
	const { users, id, channelName } = params;
	const userChannelKey = id + channelName; // Key to access appropriate timeout
	if (!users[id].getTimeoutFlag(channelName)) {
		users[id].setTimeoutFlag(channelName, true);
		startTimeout(params, userChannelKey);
	} else {
		clearTimeout(timeouts[userChannelKey]);
		startTimeout(params, userChannelKey);
	}
}

// Resets user-specific counter variable after timeout
function startTimeout(params, userChannelKey) {
	const { users, id, channelName } = params;
	timeouts[userChannelKey] = setTimeout(() => {
		users[id].resetCount(channelName);
		users[id].setTimeoutFlag(channelName, false);
	}, timeLimit);
}

//Warns User
function resourceChannelWarning(message, client) {
	client.channels
		.fetch(process.env.CHAT_CHANNEL)
		.then((channel) => {
			message.reply(`Let's try to use ${channel} for longer conversations!\nThat way it's easier for people to find study resources when they need it. :smiley:`);
		})
		.catch(console.error);
}

//Sends message informing user they've been muted
function resourcesMuteMessage(message, client) {
	client.channels
		.fetch(process.env.CHAT_CHANNEL)
		.then((channel) => {
			message.reply(`Please use ${channel} for longer conversations. \nI hate to do it, but I had to mute you for a little while. :sob: \nDon't worry, you'll be able to post your study resources again after 1 minute!`);
		})
		.catch(console.error);
}

module.exports = { resourcesObserver };
