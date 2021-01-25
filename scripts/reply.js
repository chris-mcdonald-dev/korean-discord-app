const DEFAULT_ERROR = ":x: Oops! An error as occurred while performing the command. Please try again!";

const STUDY_SESSION = {
    CREATE: {
        SUCCESS: (session) => `✅ Study session has been registered successfully!\n\n📆 Session planned on ${session.date.toUTCString()}\n🕑 Session should last ${session.estimatedLength} minutes.\n\nIf anybody want to join the session, subscribe using the ⭐ button\nIf you want to cancel the session, press the ❌ button`,
        ERROR: (error) => `❌ Oops! An error as occurred while creating the study session. Please try again!${error ? `\n\n${error}` : ''}`,
        DATE_PAST: "📆 Oops! Looks like the study session date is already past!",
        MISSING_DATE: "📆 Do you want to create a study session? Please, provide a valid date!"
    },
    UPCOMING: {
        SUCCESS: (sessions) => `📆 Here's the upcoming study sessions!\n${sessions.map(s => `${s.id} by ${s.author.username}\n`)}`,
        ERROR: (error) => `❌ Oops! An error as occurred while fetching the study sessions. Please try again!${error ? `\n\n${error}` : ''}`,
        NOT_FOUND: "❌ Oops! Looks like there's no upcoming session (yet). Do you wanna create one?"
    }
};

function react(message, reaction, reactions) {
    if(reaction) message.react(reaction);
    if(reactions) reactions.forEach(r => message.react(r));
}

function replySuccess(message, description, callback) {
    message.reply({embed:{
        description: description,
        color: 'BLUE'
    }})
    .then(() => callback());
}

function replyError(message, error = DEFAULT_ERROR) {
    message.reply({embed:{
        description: error,
        color: 'RED'
    }});
}

module.exports = {
    react,
    replySuccess,
    replyError,
    STUDY_SESSION
};
