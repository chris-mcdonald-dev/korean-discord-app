function ping(message) {
    setTimeout(() => {
        message.channel.startTyping();
    }, 1500);
    setTimeout(() => {
        message.channel.send(' :rolling_eyes: omg');
        message.channel.stopTyping();
    }, 4000);

    setTimeout(() => {
        message.channel.startTyping();
    }, 4500);
    setTimeout(() => {
        message
            .reply(' what do you want?')
            .then(() => {})
            .catch(console.error);
        message.channel.stopTyping();
    }, 7000);
}

function getPinned(message) {
    if (!message.member.hasPermission('MANAGE_ROLES')) return;
    message.channel.messages
        .fetchPinned()
        .then((messages) => {
            console.log(`FOUND ${messages.size} PINNED MESSAGES`);
            global.pinnedMessages = [...messages];
            message.channel.send('By hand? :rolling_eyes:\nFine.');
        })
        .catch((error) => console.error(error));
}

function movePinned(message, pinnedMessages) {
    if (!message.member.hasPermission('MANAGE_ROLES')) return;
    if (typeof pinnedMessages === 'undefined') {
        return message.channel.send("You didn't give me anything to copy. :sweat_smile:");
    }
    console.info('Pasted pins:', pinnedMessages);
    pinnedMessages.forEach((msg) => {
        const content = msg[1].content;
        const author = msg[1].author.username;
        message.channel
            .send(`**Resource submitted by:** ${author},\n${content}`)
            .then((sentMsg) => sentMsg.pin())
            .catch((error) => console.error(error));
    });
}

function unPin50thMsg(channel) {
    channel.messages.fetchPinned().then((messages) => {
        console.info(`${channel.name}: ${messages.size}`);
        if (messages.size === 50) {
            // Puts map keys into array and gets key at index 49
            const key = [...messages.keys()][49];
            const msg = messages.get(key);
            console.info('UNPINNING MESSAGE:', msg.content);
            msg.unpin().then(() => {
                if (!msg.pinned) console.info('Successfully unpinned!');
                channel.messages.fetchPinned().then((newMessages) => {
                    console.info('New Pinned Messages Amount:', newMessages.size);
                });
            });
        }
    });
}

function getAllChannels(client) {
    client.channels.cache.forEach((chnl) => {
        chnl = chnl[1];
        client.channels
            .fetch(chnl.id)
            .then((fullChannel) => {
                if (fullChannel.type === 'text') unPin50thMsg(fullChannel);
            })
            .catch(console.error);
    });
}

function logMessageDate() {
    console.info(`\n\n${new Date()}`);
}

export {ping, getPinned, movePinned, unPin50thMsg, getAllChannels, logMessageDate};
