const EXERCISES_FIELD = {
    name: 'Exercises',
    value: `From within <#${process.env.EXERCISES_CHANNEL}> use \`!t\` or \`!ㅌ\` to start an exercise to help improve your typing abilities`
};

const STUDY_SESSION_FIELD = {
    name: 'Study Sessions',
    value: `
Use \`!upcoming study\` to list all of the upcoming study sessions that have been scheduled

Create a study session with the \`!study\` command. Use \`!help study\` for more information

You can cancel a study session either by deleting the message used to create the session or by using the \`!cancel study\` command. Use \`!help cancel study\` for more information
    `
};

const TIMEZONE_FIELD = {
    name: 'Timezones',
    value: `
Use \`!timezone\` to convert a date-time to equivalent date-times in different regions

Use \`!help timezone\` for more information
    `
};

const BOOKMARKS_FIELD = {
    name: 'Bookmarks',
    value: `
A copy of any message can be sent to you via direct message by the bot if you apply a 'bookmark' (🔖) reaction to the message you want to copy

If you remove your bookmark, the DM you received is removed

Any message the bot sends via DM can be deleted by applying an 'x' (❌) reaction to it
    `
};

const ROLES_FIELD = {
    name: 'Roles',
    value: `
Moderators can create a self-assigned role message using the \`!role message\` command

Use \`!help role message\` for more information
    `
};

const HELP_FIELD = {
    name: 'Help',
    value: `Use the \`!help\` command to bring up a list of Little LyonHeart ♡'s available features`
};

const HELP_EMBED_FIELDS = [
    EXERCISES_FIELD,
    STUDY_SESSION_FIELD,
    TIMEZONE_FIELD,
    BOOKMARKS_FIELD,
    ROLES_FIELD,
    HELP_FIELD
];

const HELP_EMBED = {
    title: "Little LyonHeart ♡ features",
    fields: HELP_EMBED_FIELDS
};

function createSpecificCommandHelpEmbed(command, description, format, examples, imageUrl) {
    const fields = [];
    fields.push({
        name: 'Description',
        value: description
    });
    if (format) {
        fields.push({
            name: 'Format',
            value: format
        });
    }
    if (examples) {
        fields.push({
            name: 'Examples',
            value: examples
        });
    }
    return {
        title: `The ${command} command`,
        fields: fields,
        image: {
            url: imageUrl
        }
    }
};

const TIMEZONE_DESCRIPTION = 'The `!timezone` command can be used to convert a date-time into date-times around the world';
const TIMEZONE_FORMAT = `
This requires a date in the format YYYY/MM/DD and a UTC time in HH:mm followed by any number of [TZ database names](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List)
`;
const TIMEZONE_EXAMPLES = `
If you've created a study session with these details
\`\`\`
!study 2022/03/05 at 13:30 ...
\`\`\`
You can get the equivalent date-times in Toronto, London and Seoul using
\`\`\`
!timezone 2022/03/05 13:30 America/Toronto Europe/London Asia/Seoul
\`\`\`
Which creates this response:
\`\`\`
Sat, 5 Mar at 08:30 (Eastern Standard Time)
Sat, 5 Mar at 13:30 (Greenwich Mean Time)
Sat, 5 Mar at 22:30 (Korean Standard Time)
\`\`\`
`;

const TIMEZONE_EMBED = createSpecificCommandHelpEmbed(
    '!timezone',
    TIMEZONE_DESCRIPTION,
    TIMEZONE_FORMAT,
    TIMEZONE_EXAMPLES
);

const CANCEL_STUDY_DESCRIPTION = 'The `!cancel study` command can be used to remove an upcoming study session that you\'ve scheduled';
const CANCEL_STUDY_FORMAT = 'This requires a date in the format YYYY/MM/DD and a UTC time in HH:mm';
const CANCEL_STUDY_EXAMPLES = `
If you've created a study session with these details
\`\`\`
!study 2022/03/05 at 13:30 for 1 hour
We'll be studying some fundamental Korean grammar!
\`\`\`
You can cancel the session with
\`\`\`
!cancel study 2022/03/05 13:30
\`\`\`
`;

const CANCEL_STUDY_EMBED = createSpecificCommandHelpEmbed(
    '!cancel study',
    CANCEL_STUDY_DESCRIPTION,
    CANCEL_STUDY_FORMAT,
    CANCEL_STUDY_EXAMPLES
);

const STUDY_DESCRIPTION = 'The `!study` command can be used to schedule study sessions that other members of the server can subscribe to and be notified of';
const STUDY_FORMAT = `
The study command requires
- a title placed on the first line (beside the \`!study\` command)
- a date in the format YYYY/MM/DD
- a UTC time in HH:mm
- a session length in H hours, mm minutes or a combination of both

This message should also contain a description of the session
`;
const STUDY_EXAMPLES = `
Sending a message like this:
\`\`\`
!study Grammar lesson
2022/03/05 at 13:30 for 1 hour
We'll be studying some fundamental Korean grammar!
\`\`\`
Results in the bot creating a study session and responding with a message that looks like this:
`;

const STUDY_EMBED = createSpecificCommandHelpEmbed(
    '!study',
    STUDY_DESCRIPTION,
    STUDY_FORMAT,
    STUDY_EXAMPLES,
    'https://i.imgur.com/SczgdyX.png'
);

const ROLE_MESSAGE_DESCRIPTION = 'The `!role message` command can be used to create self-assigned role selection menus';
const ROLE_MESSAGE_FORMAT = `
The role message command requires
- a title placed on the first line (beside the \`!role message\` command)
- at least one role option in the format: \`emoji: roleId - description\`

Each role goes on its own line
The emojis should be from the standard set (no custom emojis)
The description has a 50 character limit

Besides these rules, the message can have any additional information or formatting added
`;
const ROLE_MESSAGE_EXAMPLES = `
Sending a message like this:
\`\`\`
!role message Alphabet roles

Here's some information

:boom:: 819317488923049987 - For people who want to have role A
This role gives you access to #test-a
:knife:: 819317563841314816 - For people who want to have role B
This role gives you access to #test-b

Here's some more information. Here's \_some\_ \*\*formatting\*\*
\`\`\`
Results in the bot responding with a message that looks like this:
`;

const ROLE_MESSAGE_EMBED = createSpecificCommandHelpEmbed(
    '!role message',
    ROLE_MESSAGE_DESCRIPTION,
    ROLE_MESSAGE_FORMAT,
    ROLE_MESSAGE_EXAMPLES,
    'https://i.imgur.com/Mjp3pVU.png'
);

module.exports = {
    HELP_EMBED,
    TIMEZONE_EMBED,
    CANCEL_STUDY_EMBED,
    STUDY_EMBED,
    ROLE_MESSAGE_EMBED
};
