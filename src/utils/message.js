const { react } = require('./react');

/**
 * Private message reply template
 */
function messageTemplate(author = undefined, { title = "", content = " ", description = "", color = "GREY", url = "", fields = undefined }) {
    const embed = (description || fields) && {
        author: author && {
            name: `${author?.username}'s`,
            iconURL: author?.displayAvatarURL(),
            url: `https://discord.com/channels/@me/${author?.id}`
        },
        color,
        description,
        fields,
        title,
        thumbnail: author && {
            url: author?.displayAvatarURL()
        },
        url
    };
    return {
        content,
        embeds: embed ? [embed] : undefined
    }
}

/**
 * Reply to a message
 * @param message       the original message
 * @param content?      the content of the reply
 * @param title?        the title of the embed message
 * @param url?          the url of the embed message title
 * @param description?  the description of the embed message
 * @param fields[]?     the fields of the embed message
 * @param color?        the color of the embed message
 * @param withAuthor?   display author on the embed message
 * @return message      the reply message
 */
function replyInfo(message, { title = "", color = "BLUE", withAuthor = false, ...rest }) {
    return message.channel.send(messageTemplate(withAuthor && message.author, { title, color, ...rest }));
}

function replySuccess(message, { title = "Success ✅", color = "GREEN", withAuthor = false, ...rest }) {
    return message.channel.send(messageTemplate(withAuthor && message.author, { title, color, ...rest }));
}

function replyError(message, { title = "Error ❌", color = "RED", withAuthor = false, ...rest }) {
    return message.channel.send(messageTemplate(withAuthor && message.author, { title, color, ...rest }));
}

/**
 * Reply with a survey - Survey can only be replied by their original author
 * @param message       the original message
 * @param survey        the survey topic
 * @param surveyOptions the reaction options
 * @param delay         delay before the survey is cancelled
 * @return reaction     the selected reaction
 */
function replySurvey(message, survey, surveyOptions, delay) {
    return message.channel.send(survey).then(async (survey) => {
        react(survey, null, surveyOptions);
        return survey.awaitReactions({ max: 1, time: delay, filter: (reaction, user) => user.id === message.author.id && surveyOptions.includes(reaction.emoji.name) })
            .then((collected) => collected?.first()?.emoji?.name);
    });
}

function sendDirectMessage(user, { title = "", color = "GREY", ...rest }) {
    return user.send(messageTemplate(null, { title, color, ...rest }));
}

module.exports = { replyInfo, replySuccess, replyError, replySurvey, sendDirectMessage };
