// Study session's related messages
const STUDY_SESSION = {
    CREATE: {
        SUCCESS: (session) => `✅ Study session has been registered successfully!\n\n📆 Session planned on ${session.startDate.toUTCString()}\n🕑 Session should last ${session.estimatedLength} minutes.\n\nIf anybody want to join the session, subscribe using the ⭐ button\nIf you want to cancel the session, press the ❌ button`,
        ERROR: (error) => `❌ Oops! An error as occurred while creating the study session. Please try again!${error ? `\n\n${error}` : ''}`,
        DATE_PAST: "📆 Oops! Looks like the study session date is already past!",
        MISSING_DATE: "📆 Do you want to create a study session? Please, provide a valid date!"
    },
    UPCOMING: {
        SUCCESS: (sessions) => `📆 Here's the upcoming study sessions!\n${sessions.map(s => `${s.id} by ${s.author.username}\n`)}`,
        ERROR: (error) => `❌ Oops! An error as occurred while fetching the study sessions. Please try again!${error ? `\n\n${error}` : ''}`,
        NOT_FOUND: "❌ Oops! Looks like there's no upcoming session (yet). Do you wanna create one?"
    },
    SUBSCRIBE: {
        SUCCESS: (author, subscriber) => `💛 Hey <@${subscriber.id}>, you successfully registered to <@${author.id}> study session! See you soon!`,
        ERROR: (error) => `❌ Oops! An error as occurred while subscribing the study sessions. Please try again!${error ? `\n\n${error}` : ''}`
    },
    UNSUBSCRIBE: {
        SUCCESS: (author, subscriber) => `😢 Oh dear <@${subscriber.id}>, you unsubscribed to <@${author.id}> study session... Maybe next time!`,
        ERROR: (error) => `❌ Oops! An error as occurred while unsubscribing the study sessions. Please try again!${error ? `\n\n${error}` : ''}`
    },
    CANCEL: {
        CONFIRMATION: (user) => `😮 <@${user.id}> Do you really want to cancel this study session? This action is irreversible`,
        SUCCESS: (user) => `😉 Roger! Every participants will be notified in DM. Looking forward to see you again, <@${user.id}>!`,
        TIME_ELAPSED: "🕑 Tic, tac... One minute lapsed, let's say you didn't intend to cancel the session!",
        CANCEL: "😁 Oh, you didn't mean it! Alright, happy to hear that we can maintain the study session!",
        ERROR: (error) => `❌ Oops! An error as occurred while cancelling the study sessions. Please try again!${error ? `\n\n${error}` : ''}`,
        UNAUTHORIZED: "❌ Hep! Only study session's owner can cancel it"
    }
};

module.exports = { STUDY_SESSION };
