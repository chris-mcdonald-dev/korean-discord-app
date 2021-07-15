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
			.then(() => { })
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

function handleHelpCommand(message) {
	if (message.content.startsWith('!help time')) {
		handleHelpTimeCommand(message);
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
		embed: {
			title: "Little LyonHeart ♡ features",
			fields: [
				{
					name: 'Exercises',
					value: `From within <#${process.env.EXERCISES_CHANNEL}> use \`!t\` or \`!ㅌ\` to start an exercise to help improve your typing abilities`
				},
				{
					name: 'Study Sessions',
					value: `
Use \`!upcoming study\` to list all of the upcoming study sessions that have been scheduled

Create a study session with the \`!study\` command. Use \`!help study\` for more information

You can cancel a study session either by deleting the message used to create the session or by using the \`!cancel study\` command. Use \`!help cancel study\` for more information
					`
				},
				{
					name: 'Time',
					value: `
Use \`!time\` to generate a dynamic date-time which shows the correct time to each user based on their local timezone

Use \`!help time\` for more information
					`
				}, {
					name: 'Bookmarks',
					value: `
A copy of any message can be sent to you via direct message by the bot if you apply a 'bookmark' (🔖) reaction to the message you want to copy

If you remove your bookmark, the DM you received is removed

Any message the bot sends via DM can be deleted by applying an 'x' (❌) reaction to it
					`
				}, {
					name: 'Help',
					value: `Use the \`!help\` command to bring up a list of Little LyonHeart ♡'s available features`
				}
			]
		}
	});
}

function handleHelpTimeCommand(message) {
	const currentTime = Math.round(new Date().getTime() / 1000);
	message.channel.send(null, {
		embed: {
			title: "The !time command",
			fields: [
				{
					name: 'Description',
					value: 'The `!time` command can be used to generate a dynamic date-time'
				}, {
					name: 'Format',
					value: `
This command optionally takes a UTC date-time in the format YYYY/MM/DD HH:mm and an output type

If a date is not supplied it will use the current date and time
If an output type is not supplied it will use the default output type ("short date time")
					`
				}, {
					name: 'Examples',
					value: `
\`!time\` on its own will generate <t:${currentTime}:f>
\`!time short time\` will generate <t:${currentTime}:t>
\`!time 2021/07/29 22:00 relative\` will generate <t:1627592400:R>
					`
				}, {
					name: 'Output types',
					value: `
short date: <t:${currentTime}:d>
long date: <t:${currentTime}:D>
short time: <t:${currentTime}:t>
long time: <t:${currentTime}:T>
short date time: <t:${currentTime}:f>
long date time: <t:${currentTime}:F>
relative: <t:${currentTime}:R>
					`
				}
			]
		}
	});
}

function handleHelpCancelStudyCommand(message) {
	message.channel.send(null, {
		embed: {
			title: "The !cancel study command",
			fields: [
				{
					name: 'Description',
					value: 'The `!cancel study` command can be used to remove an upcoming study session that you\'ve scheduled'
				}, {
					name: 'Format',
					value: `
This requires a date in the format YYYY/MM/DD and a UTC time in HH:mm
					`
				}, {
					name: 'Example',
					value: `
If you've created a study session with these details
\`\`\`
!study 2022/03/05 at 13:30 for 1 hour
We'll be studying some fundamental Korean grammar!
\`\`\`
You can cancel the session with
\`\`\`
!cancel study 2022/03/05 13:30
\`\`\`
					`
				}
			]
		}
	});
}

function handleHelpStudyCommand(message) {
	message.channel.send(null, {
		embed: {
			title: "The !study command",
			fields: [
				{
					name: 'Description',
					value: 'The `!study` command can be used to schedule study sessions that other members of the server can subscribe to and be notified of'
				}, {
					name: 'Format',
					value: `
The study command requires
- a title placed on the first line (beside the \`!study\` command)
- a date in the format YYYY/MM/DD
- a UTC time in HH:mm
- a session length in H hours, mm minutes or a combination of both

This message should also contain a description of the session
					`
				}, {
					name: 'Example',
					value: `
Sending a message like this:
\`\`\`
!study Grammar lesson
2022/03/05 at 13:30 for 1 hour
We'll be studying some fundamental Korean grammar!
\`\`\`
Results in the bot creating a study session and responding with a message that looks like this:
					`
				}
			],
			image: {
				url: 'https://i.imgur.com/SczgdyX.png'
			}
		}
	});
}

module.exports = { ping, getPinned, movePinned, unPin50thMsg, getAllChannels, logMessageDate, handleHelpCommand };
