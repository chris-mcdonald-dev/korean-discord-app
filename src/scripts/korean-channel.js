const { mute } = require("./users/permissions");
const { logMessageDate } = require("./utilities");

const koreanRegEx = /[\uac00-\ud7af]|[\u1100-\u11ff]|[\u3130-\u318f]|[\ua960-\ua97f]|[\ud7b0-\ud7ff]/g;

const warnOn = 8;
const muteAfter = 10;

function koreanObserver(message, chnlMsgs, client) {
	if (message.member.hasPermission("MANAGE_ROLES")) return;
	client.channels
		.fetch(process.env.KOREAN_CHANNEL)
		.then((channel) => {
			chnlMsgs[channel.name] = chnlMsgs[channel.name] || {
				count: 0,
			};

			koreanMsgCheck(message, chnlMsgs, channel);

			// Logs time
			logMessageDate();

			chnlMsgs[channel.name].count++;

			if (chnlMsgs[channel.name].count === warnOn) koreanChannelWarning(message, client);
			if (chnlMsgs[channel.name].count >= muteAfter) {
				mute(message);
				koreanChannelMute(message, client);
			}
		})
		.catch(console.error);
}

// Checks if message has Korean and resets channel count
function koreanMsgCheck(message, chnlMsgs, channel) {
	if (koreanRegEx.test(message.content)) {
		chnlMsgs[channel.name].count = 0;
	}
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
