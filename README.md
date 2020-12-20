# korean-discord-app
 This is the Discord Bot created to manage a Korean Educational Community with a member-base of 2,500 at the time of development.

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
  
- **Keep Pinned Messages Under 50**
  - Automatically unpins oldest message when a channel reaches its 50 pin limit.  
<br>

### ***Commands*** :
 - **Move all pinned messages to another channel**
   - Available to: Moderators
   - Commands : 
     - @(Bot's name) copy the pins here
     - @(Bot's name) paste the pins here

- **Manually Unmute users** *(used for emergencies if user is stuck on mute)*
   - Available to: Moderators
   - Commands : 
     - Unmute @(User's name)
     - Unmute everyone @(Bot's name)
   
- **Check if bot is running**
  - Available to: Everyone
  - Command :
    - Wake up! @(Bot's name)
