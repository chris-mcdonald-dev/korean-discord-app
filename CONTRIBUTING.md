# How to contribute to korean discord app

## Requirements

* git
* Text editor
* nodejs
* Knowledge on javascript and [discord.js](https://discord.js.org/#/docs/main/stable/general/welcome)

## Install git

git is a source code management program to keep track of the different changes in the project

[Download git](https://git-scm.com/downloads)

## Install text Editor

If you don't have any text editor we recommed to install [Visual studio code](https://code.visualstudio.com/download)

## Install nodeJs

[Download nodeJs LTS](https://nodejs.org/en/)

## Install forever

[Download forever](https://www.npmjs.com/package/forever)

## Install Moongo Db Community Server

[mongoDB](https://www.mongodb.com/try/download/community)

[doc](https://docs.mongodb.com/manual/administration/install-community/)

## Fork The project

* Create you own copy of the project

## Set up the discord bot

* Create a [discord](https://discord.com/developers/applications/) app `/Applications` click new Application and give it a name
* Create a discord server where you have admin access
* Create a copy of `.env-sample` rename the copy to `.env`
* Replace `ACCESS_TOKEN` by `Client Secret` from your app [app](https://discord.com/developers/applications/)
  * Replace `CLIENT_ID` by `Client Id`  from your [app](https://discord.com/developers/applications/)
  * Replace `MOD_CHANNEL`, `CHAT_CHANNEL`, `LINKS_CHANNEL`, `KOREAN_CHANNEL`,`EXERCISES_CHANNEL` by the Id of a text channel. To get it right click on the text channel and click `Copy ID`
  * Replace `SERVER_ID` by your `SERVER ID` to find it  right click on the server then go to `/Server Settings/ Widget` and copy `SERVER ID`
  * Replace `Moderator` by your used Id to find it  right click on the server then `/Server Settings / Members` hover your user and click the three dots then `Copy ID`
  * Replace `ACTIVE_ROLE` by your roles to find it  right click on the server then go to `/Server Settings/ Roles` and hover your role and click the three dots then `Copy ID`
  * Replace `DATABASE_URI`

## Start the app

From the project folder

`npm start`

## Run tests

`npm test`

## Add changes

* Create a branch
* Write your changes
* Commit
* Push
* Create a Merge Request (MR)/Pull Request (PR) from your Fork Project https://github.com/crobin93/korean-discord-app