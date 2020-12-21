const { mute } = require("./users/permissions");

const timeLimit = 120000;
const warnOn = 3;
const muteOn = 4;

// Spam Observer
function resourcesObserver(message, counter, client) {
	if (message.member.hasPermission("MANAGE_ROLES")) return;
	// Initializes user-specific variables if undefined.
	counter[message.author.username + " " + message.author.id] = counter[message.author.username + " " + message.author.id] || {};

	counter[message.author.username + " " + message.author.id][message.channel.name] = counter[message.author.username + " " + message.author.id][message.channel.name] || {};

	counter[message.author.username + " " + message.author.id][message.channel.name].timeoutFlag = counter[message.author.username + " " + message.author.id][message.channel.name].timeoutFlag || false;

	counter[message.author.username + " " + message.author.id][message.channel.name].count = counter[message.author.username + " " + message.author.id][message.channel.name].count || 0;

	function startTimeout() {
		timeout = setTimeout(() => {
			counter[message.author.username + " " + message.author.id][message.channel.name].count = 0;
			counter[message.author.username + " " + message.author.id][message.channel.name].timeoutFlag = false;
		}, timeLimit);
	}
	// Resets user-specific counter variable after timeout
	if (counter[message.author.username + " " + message.author.id][message.channel.name].timeoutFlag === false) {
		counter[message.author.username + " " + message.author.id][message.channel.name].timeoutFlag = true;
		startTimeout();
	} else {
		clearTimeout(timeout);
		startTimeout();
	}

	counter[message.author.username + " " + message.author.id][message.channel.name].count++;
	console.log(`${message.author.username}'s Message number: ${counter[message.author.username + " " + message.author.id][message.channel.name].count}`);
	console.log("HERE'S THE COUNTER OBJECT:", JSON.stringify(counter, null, 2));
	if (counter[message.author.username + " " + message.author.id][message.channel.name].count === warnOn) resourceChannelWarning(message, client);
	if (counter[message.author.username + " " + message.author.id][message.channel.name].count === muteOn) {
		mute(message);
		resourcesMuteMessage(message, client);
	}
}

function resourceChannelWarning(message, client) {
	client.channels
		.fetch(process.env.CHAT_CHANNEL)
		.then((channel) => {
			message.reply(`Let's try to use ${channel} for longer conversations!\nThat way it's easier for people to find study resources when they need it. :smiley:`);
		})
		.catch(console.error);
}

function resourcesMuteMessage(message, client) {
	client.channels
		.fetch(process.env.CHAT_CHANNEL)
		.then((channel) => {
			message.reply(`Please use ${channel} for longer conversations. \nI hate to do it, but I had to mute you for a little while. :sob: \nDon't worry, you'll be able to post your study resources again after 1 minute!`);
		})
		.catch(console.error);
}

module.exports = { resourcesObserver };
