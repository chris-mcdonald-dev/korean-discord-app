import mongoose from 'mongoose';
import { notifySubscribers } from '../../scripts/activities/study-session';
const StudySession = mongoose.model("StudySession");

// Notify study session's subscribers one hour before the beginning of the session
export default function notifySubscribersTask(client) {
    const now = new Date();
    const limit = new Date().setHours(now.getHours() + 1);
    StudySession.find({startDate: {$gt: now, $lt: limit}, notificationSent: false}, (error, studySessions) => {
        if (error) console.error(error);
        if (studySessions.length === 0) return null;
        studySessions.map((studySession) => {
            notifySubscribers(client, studySession);
            // Setup sent flag so we don't notify subscribers twice
            studySession.notificationSent = true;
            studySession.save();
        });
    });
}
