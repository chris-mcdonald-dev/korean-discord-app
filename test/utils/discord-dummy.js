class Users {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
    }

    fetch(userId) {
        const user = this.users.find(function (user) {
            return user.id === userId;
        });
        return new Promise(function (callback) {
            callback(user);
        });
    }
}

class Client {
    constructor() {
        this.id = generateId();
        this.users = new Users();
    }

    addUser(user) {
        this.users.addUser(user);
    }
}

class User {
    constructor(username) {
        this.username = username;
        this.avatarUrl = 'avatarUrl';

        this.id = generateId();
        this.directMessages = [];
    }

    displayAvatarURL() {
        return this.avatarUrl;
    }

    send(message) {
        this.directMessages.push(message);
        return new Promise(function (callback) {
            return callback(message);
        });
    }
}

class Channel {
    constructor() {
        this.id = generateId();
        this.messages = [];
    }

    getLastMessage() {
        return this.messages[this.messages.length - 1];
    }

    send(message) {
        if (Object.keys(message).length === 1 && typeof message.content === 'string') {
            message = new Message(this, '', message.content, '');
        }
        this.messages.push(message);
        return new Promise(function (callback) {
            return callback(message);
        });
    }
}

class Message {
    constructor(channel, author, content, url) {
        this.channel = channel;
        this.author = author;
        this.content = content;
        this.url = url;

        this.id = generateId();
        this.reactions = [];
    }

    edit(content) {
        this.content = content;
        return new Promise(function (callback) {
            return callback(this);
        });
    }

    react(reaction) {
        if (typeof reactions === 'string') {
            reaction = new Reaction(reaction);
        }
        this.reactions.push(reaction);
    }

    awaitReactions(filterCallback) {
        let reactions = this.reactions.filter(function (reaction) {
            if (typeof reaction === 'string') {
                return false;
            }
            return filterCallback(reaction, reaction.user);
        });
        return new Promise(function (callback) {
            return callback(new MinimalCollectionWrapper(reactions));
        });
    }
}

class Reaction {
    constructor(reaction, user) {
        this.emoji = {};
        this.emoji.name = reaction;
        this.user = user;
    }
}

class MinimalCollectionWrapper {
    constructor(items) {
        this.items = items;
    }

    first() {
        return this.items[0];
    }
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

module.exports = { Client, Channel, User, Message, Reaction };
