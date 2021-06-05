const StudySession = require("mongoose").model("StudySession");
const { getUTCFullDate } = require("../../utils/date");

const upcomingStudySessionMessageContent = "Here are the upcoming study sessions:\n*Make sure to check the time zones!*";

export default function sendChannelReminder(client) {
    const studySessionChannel = client.channels.cache.get(process.env.STUDY_SESSION_CHANNEL);
    studySessionChannel.messages.fetch({
        limit: 10
    }).then(function (messages) {
        const messagesByTheBot = getMessagesMadeByTheBot(messages) ?? [];
        const studySessionMessages = messagesByTheBot.filter((message) => {
            return isStudySessionMessage(message);
        });

        if (studySessionMessages.size === 0) {
            makeStudySessionMessage().then((studyMessage) => {
                studySessionChannel.send(studyMessage).catch((error) => {
                    console.log(error);
                });
            }).catch((error) => {
                console.log(error);
            });
            return;
        }

        const mostRecentStudySessionMessage = studySessionMessages.first();

        makeStudySessionMessage().then((studyMessage) => {
            if (upcomingSessionsAreDifferent(mostRecentStudySessionMessage, studyMessage)) {
                mostRecentStudySessionMessage.delete().then(() => {
                    studySessionChannel.send(studyMessage).catch((error) => {
                        console.log(error);
                    });
                }).catch((error) => {
                    console.log(error);
                });
            }
        }).catch((error) => {
            console.log(error);
        });
    }).catch(function (error) {
        console.log(error)
    });
}

function getMessagesMadeByTheBot(messages) {
    return messages.filter((message) => {
        return message.author.id === process.env.CLIENT_ID;
    });
}

function isStudySessionMessage(message) {
    return message.content === upcomingStudySessionMessageContent;
}

function makeStudySessionMessage() {
    return getUpcomingStudySessionsForScheduler().then((upcomingStudySessions) => {
        if (upcomingStudySessions.length === 0) {
            return createNotFoundMessage();
        }
        return {
            content: upcomingStudySessionMessageContent,
            embed: {
                title: "UPCOMING STUDY SESSIONS",
                fields: upcomingStudySessions.map((session) => ({
                    name: `${session.author.username}'s study session`,
                    value: `*${getUTCFullDate(session.startDate)} UTC (${session.estimatedLength} min)*\n${getUpcomingStudySessionSummary(session.message)} - Subscribe [here](${session.message?.link})`,
                })),
                color: "GREEN"
            }
        };
    }).catch((error) => {
        console.log(error);
    });
}

function getUpcomingStudySessionsForScheduler() {
    return StudySession.find({ startDate: { $gt: new Date() } }, null, { sort: "startDate" }).limit(5).catch((error) => {
        console.log(error);
    });
}

function getUpcomingStudySessionSummary(message) {
    if (!message || !message.text) {
        return "";
    }

    const text = message.text;
    const firstLine = text.split("\n", 1)[0].trim();
    if (firstLine.length > 0) {
        return firstLine;
    }

    const contentOnSingleLine = text.split("\n").join(" ").trim();
    const truncatedString = contentOnSingleLine.split(" ").splice(0, 8).join(" ");
    if (contentOnSingleLine.length > truncatedString.length + 3) {
        return truncatedString + "...";
    }
    return truncatedString;
}

function upcomingSessionsAreDifferent(oldMessage, newMessage) {
    const oldMessageEmbed = oldMessage.embeds[0];
    const newMessageEmbed = newMessage.embed;
    if (oldMessageEmbed.title !== newMessageEmbed.title) {
        return true;
    }
    if (oldMessageEmbed.fields.length !== newMessageEmbed.fields.length) {
        return true;
    }
    return oldMessageEmbed.fields.some((oldMessageEmbedField, index) => {
        return newMessageEmbed.fields[index].name !== oldMessageEmbedField.name ||
            newMessageEmbed.fields[index].value !== oldMessageEmbedField.value
    });
}

function createNotFoundMessage() {
    return {
        content: upcomingStudySessionMessageContent,
        embed: {
            title: "🙈 No sessions found",
            description: "Oops! Looks like there are no sessions scheduled right now",
            color: 'RED'
        }
    };
}
