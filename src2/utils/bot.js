function isFromBot(message) {
    return message.author.bot;
}

// Return true if the message is tagging Bot
function isTaggingBot(message) {
    return message.content.includes(process.env.CLIENT_ID);
}

export {isFromBot, isTaggingBot};
