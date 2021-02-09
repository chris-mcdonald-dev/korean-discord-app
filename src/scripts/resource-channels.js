const { mute } = require("./users/permissions");
const { logMessageDate } = require("./utilities");

const timeLimit = 120000;
const warnOn = 3;
const muteOn = 4;

// Spam Observer
function resourcesObserver(message, counter, client) {
	// if (message.member.hasPermission("MANAGE_ROLES")) return;

	// Initializes user-specific variables if undefined.
	const channelName = message.channel.name;
	const userReference = message.author.username + " " + message.author.id;
	counter = createUserCounter(counter, userReference, channelName);

	let timeout;
	function startTimeout() {
		timeout = setTimeout(() => {
			counter[userReference][message.channel.name].count = 0;
			counter[userReference][message.channel.name].timeoutFlag = false;
		}, timeLimit);
	}
	// Resets user-specific counter variable after timeout
	if (counter[userReference][message.channel.name].timeoutFlag === false) {
		counter[userReference][message.channel.name].timeoutFlag = true;
		startTimeout();
	} else {
		clearTimeout(timeout);
		startTimeout();
	}

	counter[userReference][message.channel.name].count++;

	console.log(`${message.author.username}'s Message number: ${counter[userReference][message.channel.name].count}`);

	const userParams = { counter, userReference, channelName, message, client };
	checkCount(userParams);
}

function createUserCounter(counter, userReference, channelName) {
	counter[userReference] = counter[userReference] || {
		[channelName]: {
			timeoutFlag: false,
			count: 0,
		},
	};
	return counter;
}

function checkCount(userParams) {
	const { counter, userReference, channelName, message, client } = userParams;
	if (counter[userReference][channelName].count === warnOn) {
		logMessageDate();
		resourceChannelWarning(message, client);
	}
	if (counter[userReference][channelName].count === muteOn) {
		logMessageDate();
		mute(message);
		resourcesMuteMessage(message, client);
	}
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

//Mutes User
function resourcesMuteMessage(message, client) {
	client.channels
		.fetch(process.env.CHAT_CHANNEL)
		.then((channel) => {
			message.reply(`Please use ${channel} for longer conversations. \nI hate to do it, but I had to mute you for a little while. :sob: \nDon't worry, you'll be able to post your study resources again after 1 minute!`);
		})
		.catch(console.error);
}

module.exports = { resourcesObserver };
