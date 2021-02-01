import cron from 'node-cron';
import client from './client';
import studySessionTasks from '../modules/studySession/tasks';

const tasks = [...studySessionTasks];

const scheduler = cron.schedule('* * * * *', () => {
    tasks.map((task) => task(client));
});

export default scheduler;
