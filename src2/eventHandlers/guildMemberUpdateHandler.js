import {client} from '../core';
import {USER} from '../constants/user';
import {sendDirectMessage} from '../utils';

function guildMemberUpdateHandler(oldMember, newMember) {
    const oldRole = oldMember.roles.cache[0][1];
    const newRole = newMember.roles.cache[0][1];
    if (oldRole.id === newRole.id) return;
    console.info(`${newMember.user.username}\n  Old Role:\n     ${oldRole.name} \n  New Role:\n     ${newRole.name}`);
    if (newRole.id === process.env.MODERATORS) {
        client.channels.fetch(process.env.LINKS_CHANNEL).then((resources) => {
            client.channels.fetch(process.env.MOD_CHANNEL).then((seniorChannel) => {
                sendDirectMessage(newMember.user, USER.ROLE.UPDATE(seniorChannel, resources));
            });
        });
    }
}

export default guildMemberUpdateHandler;
