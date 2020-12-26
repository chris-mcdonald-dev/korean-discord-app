const { mute } = require("./users/permissions");
const { logMessageDate } = require("./utilities");

const koreanRegEx = /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g;

function koreanObserver(message, counter, client) {
	if (message.member.hasPermission("MANAGE_ROLES")) return;
	client.channels
		.fetch(process.env.KOREAN_CHANNEL)
		.then((channel) => {
			counter[channel.name] = counter[channel.name] || {};
			counter[channel.name].count = counter[channel.name].count || 0;

			// Checks if message has Korean
			if (koreanRegEx.test(message.content)) {
				counter[channel.name].count = 0;
				return;
			}

			// Logs time
			logMessageDate();

			counter[channel.name].count++;
			console.log(`There have been: ${counter[channel.name].count} English messages sent in the practice-korean channel.`);
			if (counter[channel.name].count === 8) koreanChannelWarning(message, client);
			if (counter[channel.name].count > 9) {
				mute(message);
				koreanChannelMute(message, client);
			}
		})
		.catch(console.error);
}

function koreanChannelWarning(message, client) {
	client.channels
		.fetch(process.env.CHAT_CHANNEL)
		.then((channel) => {
			message.reply(`Promise you won't hate me, but let's try to keep this room for practicing Korean!\nPlease use ${channel} for longer conversations in English. :smiley:`);
		})
		.catch(console.error);
}

function koreanChannelMute(message, client) {
	client.channels
		.fetch(process.env.CHAT_CHANNEL)
		.then((channel) => {
			message.reply(`You're going to hate me now, :sob: but I had to temporarily mute you.\nBut don't worry! you'll be able to practice Korean again here after 1 minute.\nYou can still use ${channel} for longer conversations in English.`);
		})
		.catch(console.error);
}

module.exports = { koreanObserver };
