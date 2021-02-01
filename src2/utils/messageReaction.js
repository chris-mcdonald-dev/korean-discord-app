const addMessageReaction = (message, reaction = null, reactions = null) => {
    if (reaction) return message.react(reaction);
    if (reactions) return reactions.forEach((r) => message.react(r));
};

export {addMessageReaction};
