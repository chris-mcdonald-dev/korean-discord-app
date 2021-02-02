import cron from 'node-cron';
import tasks from './tasks';

function runScheduler(client) {
    // Run every minutes
    cron.schedule('* * * * *', () => {
        tasks.map((task) => task(client))
    });
}

export default runScheduler;
