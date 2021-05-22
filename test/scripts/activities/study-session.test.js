require('dotenv').config();
const { Client, Channel, User, Message, Reaction } = require('./../../utils/discord-dummy');
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const StudySessionSchema = require('./../../../src/models/index');
const StudySessionModel = mongoose.models.StudySession;
const {
    createStudySession,
    getUpcomingStudySessions,
    subscribeStudySession,
    unsubscribeStudySession,
    cancelConfirmationStudySession,
    notifySubscribers
} = require('./../../../src/scripts/activities/study-session');

describe('When working with study sessions', function () {
    before(function (done) {
        mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });

        const database = mongoose.connection;
        database.on('error', function () {
            console.error('Failed to connect to database');
        });
        database.once('open', function () {
            done();
        });
    });

    describe('When creating a session using the createStudySession function', function () {
        it('Should be able to create a study session', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            let message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);

            await createStudySession(message);
            const queryResult = await StudySessionModel.find();
            expect(queryResult).to.be.an('array').with.lengthOf(1);
        });

        it('Should be able to create a study session with correct author information', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            let message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);

            await createStudySession(message);
            const queryResult = await StudySessionModel.find();
            const foundStudySession = queryResult[0];
            expect(foundStudySession.get('author').username).to.eql(user.username);
            expect(foundStudySession.get('author').id).to.eql(user.id);
        });

        it('Should be able to create a study session with correct message information', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            let message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);

            await createStudySession(message);
            const queryResult = await StudySessionModel.find();
            const foundStudySession = queryResult[0];
            expect(foundStudySession.get('message').text).to.eql(message.content.replace('!study', ''));
            expect(foundStudySession.get('message').id).to.eql(message.id);
            expect(foundStudySession.get('message').link).to.eql(message.url);
        });

        it('Should be able to create a study session with correct start date', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            let message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);

            await createStudySession(message);
            const queryResult = await StudySessionModel.find();
            const foundStudySession = queryResult[0];
            expect(foundStudySession.get('startDate').getFullYear()).to.eql(validStudySessionDate.getFullYear());
            expect(foundStudySession.get('startDate').getMonth()).to.eql(validStudySessionDate.getMonth());
            expect(foundStudySession.get('startDate').getDate()).to.eql(validStudySessionDate.getDate());
            expect(foundStudySession.get('startDate').getHours()).to.eql(validStudySessionDate.getHours());
            expect(foundStudySession.get('startDate').getMinutes()).to.eql(validStudySessionDate.getMinutes());
        });
    });

    describe('When retrieving sessions using the getUpcomingStudySessions function', function () {
        it('Should send a message into the command message\'s channel', function (done) {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            let message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            // Unfortunately this has to be written in an awkward callback way instead of awaiting so that we can use a setTimeout, i'm sorry
            createStudySession(message).then(function () {
                message = new Message(channel, user, '!upcoming', 'messageUrl');
                channel.send(message);
                getUpcomingStudySessions(message).then(function () {
                    setTimeout(() => {
                        expect(channel.messages).to.be.an('array').with.lengthOf(4);
                        expect(channel.messages[3].content).to.include('Here are the upcoming study sessions');
                        expect(channel.messages[3].embed.fields).to.be.an('array').with.lengthOf(1);
                        done();
                    }, 0);
                });
            });

        });

        it('Should send a message into the command message\'s channel with correct embed information', function (done) {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            let message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            // Unfortunately this has to be written in an awkward callback way instead of awaiting so that we can use a setTimeout, i'm sorry
            createStudySession(message).then(function () {
                message = new Message(channel, user, '!upcoming', 'messageUrl');
                channel.send(message);
                getUpcomingStudySessions(message).then(function () {
                    setTimeout(() => {
                        expect(channel.messages[3].embed.fields[0].name).to.eql(`${user.username}'s study session`);
                        expect(channel.messages[3].embed.fields[0].value).to.include(studySessionContent);
                        done();
                    }, 0);
                });
            });

        });
    });

    describe('When subscribing to a session using the subscribeStudySession function', function () {
        it('Should send a direct message to a user who subscribes to a study session', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            await createStudySession(message);
            await subscribeStudySession(message, user);

            expect(user.directMessages).to.be.an('array').with.lengthOf(1);
        });

        it('Should send a direct message to a user who subscribes to a study session with correct content', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            await createStudySession(message);
            await subscribeStudySession(message, user);

            expect(user.directMessages[0].content).to.eql(`👋 Hey ${user.username}, you successfully registered to <@${user.id}> study session! See you soon!`);
        });
    });

    describe('When unsubscribing to a session using the unsubscribeStudySession function', function () {
        it('Should send a direct message to a user who unsubscribes to a study session', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            await createStudySession(message);
            await subscribeStudySession(message, user);
            await unsubscribeStudySession(message, user);

            expect(user.directMessages).to.be.an('array').with.lengthOf(2);
        });

        it('Should send a direct message to a user who unsubscribes to a study session with correct content', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            await createStudySession(message);
            await subscribeStudySession(message, user);
            await unsubscribeStudySession(message, user);

            expect(user.directMessages[1].content).to.eql(`😢 Oh dear ${user.username}, you unsubscribed to <@${user.id}> study session... Maybe next time!`);
        });
    });

    describe('When notifying subscribers using the notifySubscribers function', function () {
        it('Should send a direct message to a user who has subscribed to a session', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            await createStudySession(message);
            await subscribeStudySession(message, user);

            const client = new Client();
            client.addUser(user);
            const queryResult = await StudySessionModel.find();
            const foundStudySession = queryResult[0];
            await notifySubscribers(client, foundStudySession);

            expect(user.directMessages).to.be.an('array').with.lengthOf(2);
        });

        it('Should send a direct message to a user who has subscribed to a study session with correct content', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            await createStudySession(message);
            await subscribeStudySession(message, user);

            const client = new Client();
            client.addUser(user);
            const queryResult = await StudySessionModel.find();
            const foundStudySession = queryResult[0];
            await notifySubscribers(client, foundStudySession);

            expect(user.directMessages[1].content).to.include(`👋 How is your day going, ${user.username}? Thank you for waiting, <@${user.id}>'s study session is starting soon! See you on the Korean Study Group server`);
        });
    });

    describe('When cancelling a session using the cancelConfirmationStudySession function', function () {
        it('Should respond with a confirmation survey', async function () {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            await createStudySession(message);
            cancelConfirmationStudySession(message, user);

            expect(channel.messages).to.be.an('array').with.lengthOf(3);
        });

        it('Should send a reply when confirming cancellation by applying a ✅ reaction to the survey', function (done) {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            // Unfortunately this has to be written in an awkward callback way instead of awaiting so that we can use a setTimeout, i'm sorry
            createStudySession(message).then(function () {
                cancelConfirmationStudySession(message, user);
                channel.messages[2].react(new Reaction('✅', user));
                setTimeout(() => {
                    expect(channel.messages).to.be.an('array').with.lengthOf(4);
                    done();
                }, 300);
            });
        });

        it('Should have a message with correct contents when a cancellation is confirmed by applying a ✅ reaction to the survey', function (done) {
            const user = new User('username');
            const channel = new Channel();
            const currentDateTime = new Date();
            const validStudySessionDate = new Date(new Date().setFullYear(currentDateTime.getFullYear() + 1));
            const formattedStudySessionDateTime = validStudySessionDate.toISOString().substr(0, 16).replace("T", " ").split('-').join('/');
            const studySessionContent = 'This is a study session';
            const message = new Message(channel, user, `!study ${studySessionContent} ${formattedStudySessionDateTime} 1 hour`, 'messageUrl');
            channel.send(message);
            // Unfortunately this has to be written in an awkward callback way instead of awaiting so that we can use a setTimeout, i'm sorry
            createStudySession(message).then(function () {
                cancelConfirmationStudySession(message, user);
                channel.messages[2].react(new Reaction('✅', user));
                setTimeout(() => {
                    expect(channel.messages[3].content).to.eql(`😉 Roger! Study session has been cancelled. Looking forward to see you again, <@${user.id}>!`);
                    done();
                }, 300);
            });
        });
    });

    afterEach(async function () {
        await StudySessionModel.deleteMany();
    })

    after(async function () {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
    });
});
