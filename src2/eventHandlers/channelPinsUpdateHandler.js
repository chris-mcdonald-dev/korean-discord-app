import {unPin50thMsg} from '../utils';

function channelPinsUpdateHandler(channel) {
    channel.messages
        .fetchPinned()
        .then((messages) => {
            // Discord only allows 50 pinned messages at once
            if (messages.size === 50) unPin50thMsg(channel);
        })
        .catch((error) => console.error(error));
}

export default channelPinsUpdateHandler;
