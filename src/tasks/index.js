import studySessionTasks from './studySession';

const notifySubscribers = studySessionTasks[0];
const sendChannelReminder = studySessionTasks[1];

const tasks = {
    "minute": [],
    "hour": [notifySubscribers],
    "five-hour": [sendChannelReminder]
};

export default tasks;
