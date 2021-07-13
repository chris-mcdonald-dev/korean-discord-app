const { getUpcomingStudySessionsForScheduler } = require('../../scripts/activities/study-session');
const { getDynamicDateTime } = require("../../utils/date");

const upcomingStudySessionMessageContent = "Here are the upcoming study sessions:\n*Make sure to check the time zones!*";
const oneHour = 60 * 60 * 1000;
const interval = oneHour * 5;

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

        if (isMessageOlderThan5HoursAgo(mostRecentStudySessionMessage)) {
            mostRecentStudySessionMessage.delete().then(() => {
                makeStudySessionMessage().then((studyMessage) => {
                    studySessionChannel.send(studyMessage).catch((error) => {
                        console.log(error);
                    });
                });
            }).catch((error) => {
                console.log(error);
            });
        }
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

function isMessageOlderThan5HoursAgo(message) {
    return (new Date() - message.createdAt) > interval;
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
                    value: `*${getDynamicDateTime(session.startDate, 'short date time')} (${session.estimatedLength} min)*\n${getUpcomingStudySessionSummary(session.message)} - Subscribe [here](${session.message?.link})`,
                })),
                color: "GREEN"
            }
        };
    }).catch((error) => {
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
