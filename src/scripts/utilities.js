const { HELP_EMBED, TIMEZONE_EMBED, CANCEL_STUDY_EMBED, STUDY_EMBED, ROLE_MESSAGE_EMBED } = require('./help-constants');
// Ping Test
function ping(message) {
	setTimeout(() => {
		message.channel.startTyping();
	}, 1500);
	setTimeout(() => {
		message.channel.send(" :rolling_eyes: omg");
		message.channel.stopTyping();
	}, 4000);

	setTimeout(() => {
		message.channel.startTyping();
	}, 4500);
	setTimeout(() => {
		message
			.reply(" what do you want?")
			.catch(console.error);
		message.channel.stopTyping();
	}, 7000);
}

function getPinned(message) {
	if (!message.member.hasPermission("MANAGE_ROLES")) return;
	message.channel.messages
		.fetchPinned()
		.then((messages) => {
			console.log(`FOUND ${messages.size} PINNED MESSAGES`);
			global.pinnedMessages = [...messages];
			message.channel.send("By hand? :rolling_eyes:\nFine.");
		})
		.catch(console.error);
}

function movePinned(message, pinnedMessages) {
	if (!message.member.hasPermission("MANAGE_ROLES")) return;
	if (typeof pinnedMessages === "undefined") {
		message.channel.send("You didn't give me anything to copy. :sweat_smile:");
		return;
	}
	console.log("Pasted pins:", pinnedMessages);
	pinnedMessages.forEach((msg, index) => {
		content = msg[1].content;
		author = msg[1].author.username;
		message.channel
			.send(`**Resource submitted by:** ${author},\n${content}`)
			.then((sentMsg) => {
				sentMsg.pin();
			})
			.catch(console.error);
	});
}

function unPin50thMsg(channel) {
	channel.messages.fetchPinned().then((messages) => {
		console.log(`${channel.name}: ${messages.size}`);
		if (messages.size === 50) {
			// Puts map keys into array and gets key at index 49
			const key = [...messages.keys()][49];
			const msg = messages.get(key);
			console.log("\nUNPINNING MESSAGE:", msg.content);
			msg.unpin().then(() => {
				if (msg.pinned === false) console.log("Successfully unpinned!");
				channel.messages.fetchPinned().then((newMessages) => {
					console.log("New Pinned Messages Amount:", newMessages.size);
				});
			});
		}
	}).catch(function (error) {
		console.log(error);
	});
}

function getAllChannels(client) {
	[...client.channels.cache].forEach((chnl) => {
		chnl = chnl[1];
		client.channels
			.fetch(chnl.id)
			.then((fullChannel) => {
				if (!fullChannel.members.get(client.user.id)) {
					return;
				}
				if (fullChannel.type === "text") {
					unPin50thMsg(fullChannel);
				}
			})
			.catch(console.error);
	});
}

function logMessageDate() {
	console.log(`\n\n${Date()}`);
}

function handleHelpCommand(message) {
	if (message.content.startsWith('!help role message')) {
		handleHelpRoleMessageCommand(message);
		return;
	}
	if (message.content.startsWith('!help timezone')) {
		handleHelpTimezoneCommand(message);
		return;
	}
	if (message.content.startsWith('!help cancel study')) {
		handleHelpCancelStudyCommand(message);
		return;
	}
	if (message.content.startsWith('!help study')) {
		handleHelpStudyCommand(message);
		return;
	}
	message.channel.send(null, {
		embed: HELP_EMBED
	});
}

function handleHelpTimezoneCommand(message) {
	message.channel.send(null, {
		embed: TIMEZONE_EMBED
	});
}

function handleHelpCancelStudyCommand(message) {
	message.channel.send(null, {
		embed: CANCEL_STUDY_EMBED
	});
}

function handleHelpStudyCommand(message) {
	message.channel.send(null, {
		embed: STUDY_EMBED
	});
}

function handleHelpRoleMessageCommand(message) {
	message.channel.send(null, {
		embed: ROLE_MESSAGE_EMBED
	});
}

module.exports = { ping, getPinned, movePinned, unPin50thMsg, getAllChannels, logMessageDate, handleHelpCommand };
