import {client} from '../core';
import {loadMessageReaction} from '../utils';
import {unsubscribeStudySession} from '../modules/studySession/studySession';

async function messageReactionRemoveHandler(messageReaction, user) {
    // If the server has restarted, messages may not be cached
    if (messageReaction.partial) await loadMessageReaction(messageReaction);

    // Spread addMessageReaction object
    const {message, emoji} = messageReaction;
    const text = message.content.toLowerCase();

    // Don't intercept Bot's reactions
    if (user.id === client.user.id) return null;

    // StudySession events
    if (text.startsWith('!study') && emoji.name === '⭐') unsubscribeStudySession(message, user);
}

export default messageReactionRemoveHandler;
