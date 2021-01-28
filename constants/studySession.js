// Study session's related messages
const STUDY_SESSION = {
    CREATE: {
        SUCCESS: (session) => ({
            title: "STUDY SESSION",
            content: "Study session has been registered successfully!",
            description: `📆 ${session.startDate?.toUTCString()}\n🕑 ${session.estimatedLength} minutes.\n\n${session.message?.text}\n\n*If anybody want to join the session, subscribe using the ⭐ button\nIf you want to cancel the session, press the ❌ button*`,
            withAuthor: true
        }),
        ERROR: (error) => ({
            title: "❌ Creation error",
            description: `Oops! An error as occurred while creating the study session. Please try again!${error ? `\n\n*${error}*` : ''}`
        }),
        DATE_PAST: {
            title: "📆 Date in the past",
            description: "Oops! Looks like the study session date is already past!"
        },
        MISSING_DATE: {
            title: "📆 Missing date",
            description: "Do you want to create a study session? Please, provide a valid date!"
        },
        MISSING_TIME: {
            title: "🕑 Missing time",
            description: "Do you want to create a study session? Please, provide a valid time!"
        }
    },
    UPCOMING: {
        SUCCESS: (sessions) => ({
            title: "UPCOMING STUDY SESSIONS",
            content: "Here's the upcoming study sessions:",
            fields: sessions.map(session => ({
                name: `${session.author.username}'s study session`,
                value: `*${session.startDate?.toUTCString()} (${session.estimatedLength} min)*\n${session.message?.text} - Subscribe [here](${session.message?.link})`
            }))
        }),
        ERROR: (error) => ({
            title: "❌ Fetching error",
            description: `Oops! An error as occurred while fetching the study sessions. Please try again!${error ? `\n\n*${error}*` : ''}`
        }),
        NOT_FOUND: {
            title: "🙈 No sessions found",
            description: "Oops! Looks like there's no upcoming session (yet). Do you wanna create one?"
        }
    },
    SUBSCRIBE: {
        SUCCESS: (author, subscriber) => ({content: `👋 Hey ${subscriber.username}, you successfully registered to <@${author.id}> study session! See you soon!`}),
        ERROR: (author, error) => ({
            content: `${author.username}, you just tried to subscribe to a study session. Thanks for your participation! However, an error as occurred during the process. Please try again! (and don't hesitate to notify <@202787014502776832> about this error)`,
            title: "❌ Subscription error",
            description: error
        })
    },
    UNSUBSCRIBE: {
        SUCCESS: (author, subscriber) => ({content: `😢 Oh dear ${subscriber.username}, you unsubscribed to <@${author.id}> study session... Maybe next time!`}),
        ERROR: (error) => ({
            content: `${author.username}, you just tried to unsubscribe to a study session... I'm sorry, but an error as occurred during the process. Please try again! (and don't hesitate to notify <@202787014502776832> about this error)`,
            title: "❌ Unsubscription error",
            description: error
        })
    },
    CANCEL: {
        CONFIRMATION: (author) => ({content: `😮 <@${author.id}> Do you really want to cancel this study session? This action is irreversible`}),
        SUCCESS: (author) => ({content: `😉 Roger! Study session has been cancelled. Looking forward to see you again, <@${author.id}>!`}),
        SUCCESS_WITH_SUBSCRIBERS: (author) => ({content: `😉 Roger! Every participants will be notified in DM. Looking forward to see you again, <@${author.id}>!`}),
        NOTIFICATION: (author, subscriber) => ({content: `Hey ${subscriber.username}! I'm sorry to tell you that <@${author.id}> just cancelled a study session to which you were subscribed. It happens! See you soon!`}),
        TIME_ELAPSED: {content: "🕑 Tic, tac... One minute lapsed, let's say you didn't intend to cancel the session!"},
        CANCEL: {content: "😁 Oh, you didn't mean it! Alright, happy to hear that we can maintain the study session!"},
        ERROR: (error) => ({
            title: "❌ Cancellation error",
            description: `Oops! An error as occurred while cancelling the study session. Please try again!${error ? `\n\n*${error}*` : ''}`
        }),
        UNAUTHORIZED: {content: "❌ Hep! Only study session's owner can cancel it"}
    }
};

module.exports = { STUDY_SESSION };
