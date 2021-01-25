const StudySession = require("mongoose").model("StudySession");
const { react, replySuccess, replyError, STUDY_SESSION } = require("../reply");

function getDateFrom(text) {
    // Regex Declaration
    const dateRgx = /(\d{4}[-|\/]\d{2}[-|\/]\d{2})/g; // YYYY-MM-DD | YYYY/MM/DD
    const timeRgx = /(?<hour>\d{2}:\d{2})\s?(?<ampm>am|pm)?/gi; // HH:mm | HH:mm am | HH:mm pm

    // Catching information from message
    const date = dateRgx.exec(text)?.[1];
    const {hour, ampm = ''} = timeRgx.exec(text)?.groups ?? {};

    return new Date(`${date} ${hour} ${ampm}`);
}

function getEstimatedLengthFrom(text) {
    // Regex Declaration
    const hoursRgx = /(\d)\s?hour/; // h hour(s)
    const minutesRgx = /(\d{1,2})\s?min/; // mm min(utes)

    // Catching information from message
    const estimatedLengthHours = hoursRgx.exec(text)?.[1];
    const estimatedLengthMinutes = minutesRgx.exec(text)?.[1];

    return estimatedLengthHours ? estimatedLengthHours * 60 : estimatedLengthMinutes;
}

function getStudySessionParameters(message, callback) {
    const text = message.content.toLowerCase();
    const id = message.id;
    const author = message.author;
    const startDate = getDateFrom(text);
    const estimatedLength = getEstimatedLengthFrom(text);

    // Return an error message if study session's start date valid
    if (isNaN(startDate.getDate())) return replyError(message, STUDY_SESSION.CREATE.MISSING_DATE);
    if (startDate < new Date()) return replyError(message, STUDY_SESSION.CREATE.DATE_PAST);

    return callback(message, { id, author, startDate, estimatedLength });
}

function createStudySession(message, studySession) {
    StudySession.create(studySession)
        .then(() => replySuccess(message, STUDY_SESSION.CREATE.SUCCESS(studySession), react(message, null, ["⭐", "❌"])))
        .catch((error) => replyError(message, STUDY_SESSION.CREATE.ERROR(error)));
}

function getUpcomingStudySessions(message) {
    StudySession.find({startDate: {$gt: new Date()}}, (error, studySessions) => {
        if (error) return replyError(message, STUDY_SESSION.UPCOMING.ERROR(error));
        if (studySessions.length === 0) return replyError(message, STUDY_SESSION.UPCOMING.NOT_FOUND);
        return replySuccess(message, STUDY_SESSION.UPCOMING.SUCCESS(studySessions));
    });
}

function subscribeStudySession(id, subscriberId) {

}

function unsubscribeStudySession(id, subscriberId) {

}

function cancelStudySession(id) {
    StudySession.findOneAndDelete({id});
}

module.exports = { getStudySessionParameters, createStudySession, getUpcomingStudySessions, subscribeStudySession, unsubscribeStudySession, cancelStudySession };
