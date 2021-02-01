// User's related messages
const USER = {
    ROLE: {
        UPDATE: (seniorChannel, resources) => ({
            content: `Hey! \nChris just added you to the 선배 (Senior Classmates) role. Thanks for helping people out in the study group! :smiley: \n\nYou'll notice that you now have access to the ${seniorChannel}. It's a way for us to communicate with each other and make sure the group is running smoothly.\nYou now have the ability to pin messages in the ${resources} channel. :pushpin: \n\nThere are also a few other things you can do now as well. You can head over to the ${seniorChannel} and check out the pinned messages!`
        })
    }
};

export {USER};
