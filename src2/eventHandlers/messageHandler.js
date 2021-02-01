import client from '../core/client';
import {createStudySession, getUpcomingStudySessions} from '../modules/studySession/studySession';
import {regularQualifyCheck} from '../modules/regularCheck/user-utilities';
import {typingGame, endTypingGame, gameExplanation, typingGameListener} from '../modules/activities/games';
import {getPinned, movePinned, ping} from '../utils/channels';
import {manualUnMute, unMuteAll} from '../modules/mute/permissions';
import {filterExplicitWords} from '../modules/listeners/expletives';
import {koreanObserver} from '../modules/korean-channel';
import {resourcesObserver} from '../modules/resource-channels';
import {isFromBot, isTaggingBot} from '../utils/bot';

const counter = {}; // Message counter object for users
global.tgFirstRoundStarted = false; // Flag for Typing Game below

function messageHandler(message) {
    if (!message.guild) return; // Ignores DMs
    const text = message.content.toLowerCase();

    // MessageObservers
    messageObservers(message);

    // Ping
    if (text.includes('wake up') && isTaggingBot(message)) ping(message);

    // Mute
    if (text.includes('unmute everyone') && isTaggingBot(message)) unMuteAll(message);
    if (text.includes('unmute <@!') || text.includes('unmute @')) {
        try {
            let userId = text.split(' ')[1];
            userId = userId.match(/\d/g).join('');
            manualUnMute(message, userId, client);
        } catch (e) {
            console.log(e);
        }
    }

    // Study session
    if (text.startsWith('!study')) createStudySession(message);
    if (text.startsWith('!upcoming study')) getUpcomingStudySessions(message);

    if (isFromBot() && message.type === 'PINS_ADD') message.delete();
    if (message.type === 'PINS_ADD') return; // Ignores PIN messages
    if (text.includes('http')) return; // Ignores all links
    if (text.includes('copy') && text.includes('pins') && isTaggingBot(message)) getPinned(message);
    if (text.includes('paste') && text.includes('pins') && isTaggingBot(message))
        movePinned(message, global.pinnedMessages);

    // --- EXERCISES ---
    let wroteStopFlag = false;

    switch (true) {
        // Start Typing Game
        case (isTaggingBot(message) && text.includes('typing')) || text === '!t':
            typingGame(message, client);
            break;
        // Stop Typing Game
        case isTaggingBot(message) && text.includes('stop'):
            wroteStopFlag = true;
            endTypingGame(message, wroteStopFlag);
            break;
        // Pass Message to Listener (while exercise is in progress)
        case global.typingFlag === true:
            typingGameListener(message, client);
            break;
    }
}

function messageListeners(message) {
    filterExplicitWords(message);

    // RegularQualifyCheck
    regularQualifyCheck(message);

    // Sends typing game explanation to exercise channel
    gameExplanation(message);

    const channel = message.channel;

    // Ensure long conversations in English aren't being had in Korean Channel
    if (channel.id === process.env.KOREAN_CHANNEL) koreanObserver(message, counter, client);

    // Ensure long conversations aren't being had in Resource Channel
    if (channel.id === process.env.LINKS_CHANNEL) resourcesObserver(message, counter, client);
}

export default messageHandler;
