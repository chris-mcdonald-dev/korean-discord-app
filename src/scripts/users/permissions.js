function mute(message) {
	message.channel.permissionOverwrites.create(message.author, { SEND_MESSAGES: false });
	setTimeout(() => {
		message.channel.permissionOverwrites.create(message.author, { SEND_MESSAGES: true });
		console.log("UNMUTING!");
	}, 60000);
	if (typeof global.mutedUsers === "undefined") {
		global.mutedUsers = [];
	}
	global.mutedUsers.push(message.author);
	console.log("MUTING!");
}

function manualUnMute(message, target, client) {
	if (!message.member.permissions.has("MANAGE_ROLES")) return;
	client.users
		.fetch(target)
		.then((user) => {
			message.channel.permissionOverwrites.create(user, { SEND_MESSAGES: true });
			message.channel.send(`Unmuting ${user} in ${message.channel}.`);
		})
		.catch(console.error);
}

function unMuteAll(message) {
	if (!message.member.permissions.has("MANAGE_ROLES")) return;
	if (typeof global.mutedUsers != "undefined") {
		global.mutedUsers.forEach((user) => {
			message.channel.permissionOverwrites.create(user, { SEND_MESSAGES: true });
		});
		message.channel.send(`Unmuting ${global.mutedUsers} in this channel.`);
	} else {
		message.channel.send("I don't think anyone's muted. :smiley:");
	}
}

module.exports = { mute, manualUnMute, unMuteAll };
