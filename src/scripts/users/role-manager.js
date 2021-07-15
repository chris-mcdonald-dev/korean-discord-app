const { MessageMenuOption, MessageMenu, MessageActionRow } = require('discord-buttons');

const COMMAND = "!role message";
const EMOJI_ROLE_ID_DELIMITER = ':';
const ROLE_ID_DESCRIPTION_DELIMITER = '-';
const ROLE_SELECTION_MESSAGE = "Select your roles here!";

function handleRoleMessage(message) {
    if (!isRoleSelectCreationMessage(message)) {
        return;
    }
    if (!messageAuthorIsMod(message)) {
        return;
    }
    const roleOptionStrings = getLinesWhichContainRoleOptionData(message);
    if (!roleOptionStrings) {
        return;
    }
    const roleOptions = createRoleOptionsArray(message, roleOptionStrings);
    if (!roleOptions || roleOptions.length === 0) {
        return;
    }

    createRoleOptionsForMessage(message, roleOptions);
}

function isRoleSelectCreationMessage(message) {
    return message.content.toLowerCase().startsWith(COMMAND);
}

function messageAuthorIsMod(message) {
    return Boolean(message.member.roles.cache.get(process.env.MODERATORS));
}

function getLinesWhichContainRoleOptionData(message) {
    const validRoleOptionRegex = /[\p{Emoji}]{1}.*:.*\d+/u;
    return message.content.split('\n').filter((line) => validRoleOptionRegex.test(line));
}

function createRoleOptionsArray(message, roleOptionStrings) {
    return roleOptionStrings.map((roleOptionString) => {
        const reaction = roleOptionString.match(/[\p{Emoji}]{1}/u)[0];
        const roleId = roleOptionString.split(EMOJI_ROLE_ID_DELIMITER)[1].match(/\d+/g)[0];
        const role = message.guild.roles.cache.get(roleId);
        const roleDescription = getRoleDescription(roleOptionString);
        return {
            emojiName: reaction,
            roleId: role ? role.id : undefined,
            roleName: role ? role.name : undefined,
            roleDescription: roleDescription
        }
    }).filter((roleOption) => {
        return roleOption.roleId !== undefined && roleOption.roleName !== undefined;
    });
}

function getRoleDescription(roleOptionString) {
    // pulls a "description" from a line of the format {emoji}:{roleId} - {description}
    const maybeDescriptionArray = roleOptionString.split(ROLE_ID_DESCRIPTION_DELIMITER);
    // remove the first item of the array (everything preceding the delimiter)
    maybeDescriptionArray.shift();
    // rejoin on the delimiter in case there were occurences in the description itself
    return maybeDescriptionArray.join(ROLE_ID_DESCRIPTION_DELIMITER).trim();
}

function createRoleOptionsForMessage(userMessage, roleOptions) {
    createRoleOptionsMessage(userMessage, roleOptions)
        .then(() => {
            userMessage.delete().catch(console.log);
        }).catch(console.log);
}

function createRoleOptionsMessage(message, roleOptions) {
    const menuOptions = createOptions(roleOptions);
    const menu = createMenu(message.id, menuOptions);
    const reactionActionRow = new MessageActionRow().addComponent(menu);

    return message.channel.send(null, {
        embed: createEmbed(message, roleOptions),
        components: [reactionActionRow]
    }).catch(console.log);
}

function createOptions(roleOptions) {
    return roleOptions.map((roleOption) => {
        return createMenuOption(
            roleOption.roleName,
            roleOption.roleId,
            roleOption.emojiName,
            roleOption.roleDescription
        );
    })
}

function createMenuOption(title, value, emoji, description) {
    return new MessageMenuOption()
        .setLabel(title)
        .setValue(value)
        .setEmoji(emoji)
        .setDescription(description);
}

function createMenu(id, options) {
    return new MessageMenu()
        .setID(id)
        .setPlaceholder(ROLE_SELECTION_MESSAGE)
        .addOptions(options)
        .setMaxValues(options.length)
        .setMinValues('0'); // bug in discord-buttons where setting the minimum to 0 with a number doesn't work
}

function createEmbed(message, roleOptions) {
    const content = createEmbedContent(message, roleOptions);
    const contentLinesArray = content.split('\n');
    const title = contentLinesArray.shift();
    const description = contentLinesArray.join('\n').trim();

    return {
        title: title,
        description: description,
        footer: {
            text: "Select the roles you want from the drop-down list below. Leaving any roles in the list deselected will remove you from those roles."
        }
    }
}

function createEmbedContent(userMessage, roleOptions) {
    let messageContent = userMessage.content.replace(COMMAND, "");
    roleOptions.forEach((roleOption) => {
        messageContent = messageContent.replace(roleOption.roleId, roleOption.roleName);
    })
    return messageContent.trim() || 'Member role selection';
}

function handleRoleSelect(menu) {
    if (!isRoleSelectMessage(menu)) {
        return;
    }
    menu.reply.defer();
    const user = menu.clicker.user;
    const options = menu.message.components[0].components[0].options
    // Iterate over every roleId in the menu
    options.forEach((option) => {
        if (menu.values.includes(option.value)) {
            // Any roleId that has been selected is assigned to the user
            addUserToRole(user, option.value);
            return;
        }
        // Any roleId that hasn't been selected is unassigned from the user
        removeUserFromRole(user, option.value);
    });
}

function addUserToRole(user, roleId) {
    user.client.guilds.cache
        .get(process.env.SERVER_ID).members.cache
        .get(user.id).roles
        .add(roleId)
        .catch(function (error) {
            console.log(error);
        });
}

function removeUserFromRole(user, roleId) {
    user.client.guilds.cache
        .get(process.env.SERVER_ID).members.cache
        .get(user.id).roles
        .remove(roleId)
        .catch(function (error) {
            console.log(error);
        });
}

function isRoleSelectMessage(menu) {
    if (menu.message.author.id !== process.env.CLIENT_ID) {
        return false;
    }
    return menu.message.components[0].components[0].placeholder === ROLE_SELECTION_MESSAGE;
}

export {
    handleRoleMessage,
    handleRoleSelect
}
