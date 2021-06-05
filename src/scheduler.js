import cron from 'node-cron';
import tasks from './tasks';

function runScheduler(client) {
    // Run every minutes
    if (tasks["minute"].length > 0) {
        cron.schedule('* * * * *', () => {
            tasks["minute"].map((task) => task(client))
        });
    }

    if (tasks["hour"].length > 0) {
        cron.schedule('0 */1 * * *', () => {
            tasks["hour"].map((task) => task(client))
        });
    }

    if (tasks["day"].length > 0) {
        cron.schedule('0 12 * * *', () => {
            tasks["day"].map((task) => task(client))
        });
    }
}

export default runScheduler;
