# Messages

Every message sent by the bot *should* be declared in `/src/messages` as an object. *
The message object *must* respect the following structure. 

## Message structure

The bot supports the following fields: 
```json5
{
    content: string,        // the content of the reply
    title: string,          // the title of the embed message
    url: string,            // the url of the embed message title
    description: string,    // the description of the embed message
    fields: string,         // he fields of the embed message
    color: string,          // the color of the embed message
    withAuthor: bool,       // display author on the embed message
    url: string             // the url of the embed message title
}
```
For more information, please refer to the [official documentation](https://discord.js.org/#/docs/main/stable/class/MessageEmbed)

## Usage

**Declaration**
```js
const STUDY_SESSION = {
	CREATE: {
		SUCCESS: (session) => ({
			title: "STUDY SESSION",
			content: "Study session has been registered successfully!",
			description: `📆 ${getUTCFullDate(session.startDate, "date")} at ${getUTCFullDate(session.startDate, "time")} *(UTC)*\n🕑 Estimated length: ${session.estimatedLength} minutes.\n\n${session.message?.text}\n\n*If anybody wants to join the session, subscribe using the ⭐ button\nIf you want to cancel the session, press the ❌ button*`,
			withAuthor: true,
		})
    }
};
```

**Usage**
```js
import STUDY_SESSION from '../../messages/studySession';

replySuccess(message, STUDY_SESSION.CREATE.SUCCESS(studySession));
```
