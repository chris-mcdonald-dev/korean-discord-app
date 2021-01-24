const StudySession = require("mongoose").model("StudySession");
const { replySuccess, replyError, STUDY_SESSION } = require("../reply");

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
    if (isNaN(startDate.getDate())) return replyError(message, STUDY_SESSION.MISSING_DATE);
    if (startDate < new Date()) return replyError(message, STUDY_SESSION.DATE_PAST);

    return callback(message, { id, author, startDate, estimatedLength });
}

function createStudySession(message, studySession) {
    StudySession.create(studySession)
        .then(() => replySuccess(message, STUDY_SESSION.CREATE_SUCCESS(studySession.startDate), ["⭐", "❌"]))
        .catch(() => replyError(message, STUDY_SESSION.CREATE_ERROR));
}

function getUpcomingStudySessions(message) {
    StudySession.find({startDate: {$gt: new Date()}}, (err, studySessions) => {
        if (err) return replyError(message);
        if (studySessions.length === 0) return replyError(message, STUDY_SESSION.NO_UPCOMING_SESSIONS);
        return replySuccess(message, STUDY_SESSION.NEXT(studySessions));
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
