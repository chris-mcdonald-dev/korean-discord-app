import {client} from './core';
import {
    readyHandler,
    channelPinsUpdateHandler,
    guildMemberUpdateHandler,
    messageHandler,
    messageReactionAddHandler,
    messageReactionRemoveHandler
} from './eventHandlers';

/* WebSocket Event ready handler
______________________________________________________________________________________________________________________*/
client.on('ready', readyHandler);

/* WebSocket Event handlers for user actions
______________________________________________________________________________________________________________________*/
client.on('message', messageHandler);
client.on('channelPinsUpdateHandler', channelPinsUpdateHandler);
client.on('guildMemberUpdateHandler', guildMemberUpdateHandler);
client.on('messageReactionAdd', messageReactionAddHandler);
client.on('messageReactionRemove', messageReactionRemoveHandler);
