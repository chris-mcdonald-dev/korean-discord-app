# korean-discord-app
 This is the Discord Bot created to manage a Korean Educational Community with a user-base of 2,500 at the time of development.

## [Link to Server with Discord Application](https://discord.gg/my25Bkqjz2)
<br>

### ***Application Features*** :
- **User Authorization**
  - Allows moderators to post multiple non-link messages in link channels without being warned/muted.
  - Prevents regular users from using moderator commands.

- **Expletive Filter**
  - Immediately filters messages that include expletives and replaces them with clean version of original messages.

- **Unique User Activity Tracking**
  - Tracks each user's unique activity and rewards active users by promoting them to a role with higher seniority.

- **Korean Usage Enforcement**
  - Warns and ultimately temporarily mutes users when 8 or more messages that don't include Korean characters are sent consecutively in the specified Korean practice channel.

- **Enforced Link Sharing**
  - Uniquely tracks, warns, and ultimately temporarily mutes users when they post 3 or more messages that don't include links.

- **Facilitates Korean Typing Exercises**
  - Provides weekly vocabulary words to users to type in Korean and times how quickly they are able to type them out in Korean.

- **Keep Pinned Messages Under 50**
  - Automatically unpins oldest message when a channel reaches its 50 pin limit.

- **Manage Study Session**
  - Create study sessions that other users can subscribe to.
  - Possibility to list upcoming study sessions.
  - Possibility to subscribe/unsubscribe to a study session.
  - Possibility to cancel a study session
<br>

### ***Commands*** :

| Explanation|  Accessible to  | Command |
| :---:         |     :---:      |          :---: |
| **Check if bot is running** |  Everyone  | <br>**Wake up! @`Bot's name`** <br><br> |
| **Start Korean Typing Exercise** |  Everyone  | <br>**@`Bot's name` typing<br><br>***- OR -***<br><br>!t**<br><br> |
| **Create Study Session** |  Everyone  | <br>**!study `A message that includes: YYYY/MM/DD and HH:mm am/pm (ex. 2021/01/25 02:00 am)`**<br><br> |
| **Cancel Study Session** |  Everyone  | <br>**!cancel study `A message that includes: YYYY/MM/DD and HH:mm am/pm (ex. 2021/01/25 02:00 am)`**<br><br> |
| **List Upcoming Study Sessions** |  Everyone  | <br>**!upcoming study**<br><br> |
| **Move all pinned messages to another channel**|  Moderators   | <br> **@`Bot's name` copy the pins here<br>@`Bot's name` paste the pins here** <br><br>  |
| **Manually Unmute users** *(used for emergencies if user is stuck on mute)* |  Moderators  | <br>**Unmute @`User's name`<br>***(This unmutes a single user)***<br><br>***- OR -***<br><br>Unmute everyone @`Bot's name`<br>** *(This unmutes everyone)*<br><br>|
