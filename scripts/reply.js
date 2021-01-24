const DEFAULT_ERROR = ":x: Oops! An error as occurred while performing the command. Please try again!";

const STUDY_SESSION = {
    CREATE_SUCCESS: (date) => `✅ Study session has been registered successfully!\n\n📆 Session planned on ${date.toUTCString()}\n\nIf anybody want to join the session, subscribe using the ⭐ button\nIf you want to cancel the session, press the ❌ button`,
    CREATE_ERROR: "❌ Oops! An error as occurred while creating the study session. Please try again!",
    DATE_PAST: "📆 Oops! Looks like the study session date is already past!",
    MISSING_DATE: "📆 Do you want to create a study session? Please, provide a valid date!",
    NO_UPCOMING_SESSIONS: "❌ Oops! Looks like there's no upcoming session (yet). Do you wanna create one?",
    NEXT: (sessions) => `📆 Here's the upcoming study sessions!\n${sessions.map(s => `${s.id} by ${s.author.username}\n`)}`
};

function react(message, reaction) {
    message.react(reaction);
}

function replySuccess(message, description, reactions) {
    if (reactions.length > 0) reactions.forEach(r => react(message, r));
    message.reply({embed:{
            description: description,
            color: 'BLUE'
        }});
}

function replyError(message, error = DEFAULT_ERROR) {
    message.reply({embed:{
        description: error,
        color: 'RED'
    }});
}

module.exports = {
    replySuccess,
    replyError,
    STUDY_SESSION
};
