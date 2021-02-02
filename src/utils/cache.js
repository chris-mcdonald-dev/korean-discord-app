const StudySession = require("mongoose").model("StudySession");

async function loadMessageReaction(messageReaction) {
    try {
        await messageReaction.fetch();
    } catch (error) {
        return console.error("Something went wrong when fetching the message: ", error);
    }
}

export { loadMessageReaction }
