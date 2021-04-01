function isDm(message) {
    return message.channel.type === 'dm';
}

function handleDmReactionAdd(emoji, message) {
    if (emoji.name === '❌' && message.author.bot) {
        message.delete().catch(function (error) {
            console.log(error);
        });
        return;
    }
}

module.exports = {
    isDm,
    handleDmReactionAdd
};
