function addBookmark(user, message) {
    return user.send({
        content: `${message.url}\n\n${message.author.username} said:\n${message.content}`,
        files: message.attachments ? [...message.attachments.values()] : null,
        embeds: message.embeds
    }).catch(function (error) {
        console.log(error)
    });
}

function removeBookmark(client, user, message) {
    return user.dmChannel.messages.fetch({
        after: message.id
    }).then(function (directMessages) {
        const messagesToDelete = directMessages.filter(function (directMessage) {
            return directMessage.author.id === client.user.id && directMessage.content.startsWith(message.url);
        })
        messagesToDelete.forEach(function (messageToDelete) {
            user.dmChannel.messages.delete(messageToDelete).catch(function (error) {
                console.log(error);
            });
        })
    }).catch(function (error) {
        console.log(error)
    });
}

module.exports = {
    addBookmark,
    removeBookmark
}
