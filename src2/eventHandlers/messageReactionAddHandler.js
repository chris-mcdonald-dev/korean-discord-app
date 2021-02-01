import {client} from '../core';
import {loadMessageReaction} from '../utils';
import {subscribeStudySession, cancelConfirmationStudySession} from '../modules/studySession/studySession';

async function messageReactionAddHandler(messageReaction, user) {
    // If the server has restarted, messages may not be cached
    if (messageReaction.partial) await loadMessageReaction(messageReaction);

    // Spread addMessageReaction object
    const {message, emoji} = messageReaction;
    const text = message.content.toLowerCase();

    // Don't intercept Bot's reactions
    if (user.id === client.user.id) return null;

    // StudySession events
    if (text.startsWith('!study') && emoji.name === '⭐') subscribeStudySession(message, user);
    if (text.startsWith('!study') && emoji.name === '❌') cancelConfirmationStudySession(message, user);
}

export default messageReactionAddHandler;
