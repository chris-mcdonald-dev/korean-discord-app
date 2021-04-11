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
			.then(() => {})
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
	});
}

function getAllChannels(client) {
	[...client.channels.cache].forEach((chnl) => {
		chnl = chnl[1];
		client.channels
			.fetch(chnl.id)
			.then((fullChannel) => {
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

function isExercisesChannel(channel) {
	return channel.id === process.env.EXERCISES_CHANNEL;
}

function isKoreanChannel(channel) {
	return channel.id === process.env.KOREAN_CHANNEL;
}

function isLinksChannel(channel) {
	return channel.id === process.env.LINKS_CHANNEL;
}

module.exports = { ping, getPinned, movePinned, unPin50thMsg, getAllChannels, logMessageDate, isExercisesChannel, isKoreanChannel, isLinksChannel };
