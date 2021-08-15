import studySessionTasks from './studySession';

const notifySubscribers = studySessionTasks[0];
const sendChannelReminder = studySessionTasks[1];

const tasks = {
    "minute": [],
    "hour": [notifySubscribers],
    "day": [sendChannelReminder]
};

export default tasks;
