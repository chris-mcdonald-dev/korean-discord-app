const { react } = require('./react');

// Callback that allow to delete Bot's own message after a defined delay
function deleteReply(reply, delay) {
    if (delay) setTimeout(() => reply.delete(), delay);
}

// Generate MessageEmbed object
function generateEmbed(description, color) {
    return {embed:{description, color: color}};
}

// Private reply template function
function reply(message, description, options = {}) {
    const { color = undefined, mentionUser = false, embed = false } = options;
    const content = embed ? generateEmbed(description, color) : description;

    // Reply by mentioning User
    if (mentionUser) return message.reply(content);
    return message.channel.send(content);
}

// Public reply functions
function replyInfo(message, description, options) {
    return reply(message, description, {...options, color: 'BLUE'});
}

function replySuccess(message, description, options) {
    return reply(message, description, {...options, color: 'GREEN'});
}

function replyError(message, description, options) {
    return reply(message, description, {...options, color: 'RED'});
}

function replySurvey(message, author, survey, surveyOptions, delay) {
    return reply(message, survey).then(async (survey) => {
        react(survey, null, surveyOptions);
        return survey.awaitReactions((reaction, user) => user.id === author.id && surveyOptions.includes(reaction.emoji.name), { max: 1, time: delay })
            .then((collected) => collected?.first()?.emoji?.name);
    });
}

module.exports = { replyInfo, replySuccess, replyError, replySurvey };
