const RoleMessage = require("mongoose").model("RoleMessage");

const COMMAND = "!role message";

function handleRoleMessage(message) {
    if (!isRoleMessage(message)) {
        return;
    }
    if (!messageAuthorIsMod(message)) {
        return;
    }
    const roleReactionStrings = getLinesWhichContainRoleReactionPairs(message);
    if (!roleReactionStrings) {
        return;
    }
    const roleReactions = createRoleReactionForDatabase(roleReactionStrings);
    if (!roleReactions || roleReactions.length === 0) {
        return;
    }

    createRoleReactionsForMessage(message, roleReactions);
}

function isRoleMessage(message) {
    return message.content.toLowerCase().startsWith(COMMAND);
}

function messageAuthorIsMod(message) {
    return Boolean(message.member.roles.cache.get(process.env.MODERATORS));
}

function getLinesWhichContainRoleReactionPairs(message) {
    return message.content.split('\n').filter(function (line) {
        const validRoleReactionRegex = /[\p{Emoji}]{1}.*:.*<@&\d+>/u;
        return validRoleReactionRegex.test(line);
    });
}

function createRoleReactionForDatabase(roleReactionStrings) {
    return roleReactionStrings.map(function (roleReactionString) {
        const reaction = roleReactionString.match(/[\p{Emoji}]{1}/u)[0];
        const role = roleReactionString.split(':')[1].match(/\d+/g)[0];
        return {
            reactionName: reaction,
            roleId: role
        }
    });
}

function createRoleReactionsForMessage(message, roleReactions) {
    RoleMessage.create({
        messageId: message.id,
        channelId: message.channel.id,
        roleReactions: roleReactions
    }).then(function () {
        addReactionsToMessage(message, roleReactions);
    }).catch(function (error) {
        console.log(error);
    });
}

function addReactionsToMessage(message, roleReactions) {
    roleReactions.forEach(function (roleReaction) {
        message.react(roleReaction.reactionName).catch(function (error) {
            console.log(error);
        });
    });
}

function handleRolesOnReactionAdd(user, message, emoji) {
    RoleMessage.findOne({
        messageId: message.id,
        channelId: message.channel.id,
        "roleReactions.reactionName": emoji.name
    }, null, {}, function (error, roleMessageModel) {
        if (error) {
            console.log(error);
            return;
        }
        if (!roleMessageModel) {
            return;
        }
        const roleReaction = getRoleReactionFromModel(emoji, roleMessageModel);
        addUserToRole(user, roleReaction);
    }).lean();
}

function getRoleReactionFromModel(emoji, roleMessageModel) {
    return roleMessageModel.roleReactions.find(function (roleReaction) {
        return roleReaction.reactionName === emoji.name;
    });
}

function addUserToRole(user, roleReaction) {
    user.client.guilds.cache
        .get(process.env.SERVER_ID).members.cache
        .get(user.id).roles
        .add(roleReaction.roleId)
        .catch(function (error) {
            console.log(error);
        });
}

function handleRolesOnReactionRemove(user, message, emoji) {
    RoleMessage.findOne({
        messageId: message.id,
        channelId: message.channel.id,
        "roleReactions.reactionName": emoji.name
    }, null, {}, function (error, roleMessageModel) {
        if (error) {
            console.log(error);
            return;
        }
        if (!roleMessageModel) {
            return;
        }
        const roleReaction = getRoleReactionFromModel(emoji, roleMessageModel);
        removeUserFromRole(user, roleReaction);
    }).lean();
}

function removeUserFromRole(user, roleReaction) {
    user.client.guilds.cache
        .get(process.env.SERVER_ID).members.cache
        .get(user.id).roles
        .remove(roleReaction.roleId)
        .catch(function (error) {
            console.log(error);
        });
}

function handleRoleMessageDelete(message) {
    RoleMessage.deleteOne({
        messageId: message.id,
        channelId: message.channel.id
    }).catch(function (error) {
        console.log(error);
    });
}

export {
    handleRolesOnReactionAdd,
    handleRolesOnReactionRemove,
    handleRoleMessage,
    handleRoleMessageDelete
}
