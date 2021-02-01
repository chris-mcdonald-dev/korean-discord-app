import {client} from '../core';
import {getAllChannels} from '../utils';

function readyHandler() {
    console.info('\nLittle LyonHeart ♡ is online.\n');
    client.guilds
        .fetch(process.env.SERVER_ID) //server ID
        .then((guild) => {
            global.guild = guild;
        })
        .catch(console.error);
    getAllChannels(client);
}

export default readyHandler;
