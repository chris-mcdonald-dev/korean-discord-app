// Checks if users qualify for The Regulars role.
function regularQualifyCheck(message) {
	if (message.member.hasPermission("MANAGE_ROLES")) return;
	global.guild.roles.fetch(process.env.ACTIVE_ROLE).then((regularRole) => {
		if (message.member.roles.cache.find((r) => r.name === regularRole.name)) return;
		let i = 0;
		const username = message.author.username;
		global[username] = global[username] || {};
		global[username].allMsgs = global[username].allMsgs || [];
		global.guild.channels.cache.forEach((ch) => {
			if (ch.type === "text") {
				ch.messages
					.fetch({
						limit: 100,
					})
					.then((messages) => {
						const msgs = messages.filter((m) => m.author.id === message.author.id);
						msgs.forEach((m) => {
							if (!global[username].allMsgs.includes(m)) {
								global[username].allMsgs.push(m);
							}
						});
						i++;
						if (global.guild.channels.cache.size === i) {
							console.log(`${username}: ${global[username].allMsgs.length}`);
							if (global[username].allMsgs.length >= 12) {
								message.member.roles.add(regularRole);
								console.log(message.author.username, "SENT:", global[username].allMsgs.length, "MESSAGES");
								message.reply("Hmmmmmmmmmmmmmmmmmmm.\nYes. You look very familiar... :thinking: \n\nThere's no question about it. You must be a regular.");
							}
						}
					});
			} else {
				i++;
				return;
			}
		});
	});
}

module.exports = { regularQualifyCheck };
