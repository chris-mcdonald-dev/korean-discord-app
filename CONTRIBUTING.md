# How to contribute to korean discord app

## Requirements

* Git
* A text editor
* Node.js
* Knowledge of JavaScript and [Discord.js](https://discord.js.org/#/docs/main/stable/general/welcome)

## Install Git

Git is a source code management program to keep track of the different changes in the project. It's the tool we use to work together!

[Download Git](https://git-scm.com/downloads)

## Install a Text Editor

If you don't have a text editor we recommed installing [Visual Studio Code](https://code.visualstudio.com/download)

## Install Node.js

[Download Node.js LTS](https://nodejs.org/en/)

## Install forever

[Download forever](https://www.npmjs.com/package/forever)

## (Optional) Create a DB on MongoDB Atlas or Install MoongoDB Community Server Locally

[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)  
[MongoDB Community Server](https://www.mongodb.com/try/download/community)

[Documentation](https://docs.mongodb.com/manual/administration/install-community/)

## Fork The Project

* Create you own copy of the project

## Set Up the Discord Bot

* Create your own Discord server where you have admin access.
* Create a new [Discord app](https://discord.com/developers/applications/) in the Discord Developer Portal. On the top right, click `New Application` and give it a name.
* On the left side of the page, select `Bot` in the navigation bar and click `Add Bot` to create a new bot. Confirm.
* In your forked repository, create a copy of the `.env-sample` file and rename the copy to `.env`.
  * Back in the `Bot` settings on the [Discord Developer Portal](https://discord.com/developers/applications/) website, copy your bot's `Token` and paste it after `ACCESS_TOKEN=` in your `.env` file.
  * Replace `CLIENT_ID` with the `Client ID` from your [app](https://discord.com/developers/applications/) found in the `General Information` settings.
  * Replace `MOD_CHANNEL`, `CHAT_CHANNEL`, `LINKS_CHANNEL`, `KOREAN_CHANNEL`,`EXERCISES_CHANNEL` with the ID of text channels in your new Discord server. To get them, right click on the text channel and click `Copy ID`
  * Replace `SERVER_ID` with your `SERVER ID`. To find it, right click on the server then go to `Server Settings -> Widget` and copy the `SERVER ID`
  * (If applicable) Replace `Moderator` with your server's moderator role. To find it, right click on the server then go to `Server Settings -> Roles`. Hover over the corresponding role and click the three dots that appear. Then click `Copy ID`.
  * (If applicable) Replace `ACTIVE_ROLE` with your server's active-members role. To find it, right click on the server then go to `Server Settings -> Roles`. Hover over the corresponding role and click the three dots that appear. Then `Copy ID`.
  * (If applicable) Replace `DATABASE_URI` with the URI of your MongoDB database.

## Start the App

From the project folder

`npm start`

<!---
NOT YET IMPLEMENTED
## Run Tests

`npm test`
--->
## Add Changes

* Create a branch
* Write your changes
* Commit
* Push
* Create a Pull Request (PR)/Merge Request (MR) from your forked project into the `development` branch. https://github.com/crobin93/korean-discord-app/tree/development
