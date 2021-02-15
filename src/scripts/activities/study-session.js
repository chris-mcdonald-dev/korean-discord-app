const StudySession = require("mongoose").model("StudySession");
const { react } = require("../../utils/react");
const { STUDY_SESSION } = require("../../constants/studySession");
const { replyInfo, replySuccess, replyError, replySurvey, sendDirectMessage } = require("../../utils/message");

function getStudySessionDate(text) {
	// Regex Declaration
	const dateRgx = /(\d{4}[-|\/]\d{2}[-|\/]\d{2})/g; // YYYY-MM-DD | YYYY/MM/DD
	const timeRgx = /(?<hour>\d{1,2}:\d{2})\s?(?<ampm>am|pm)?/gi; // HH:mm | HH:mm am | HH:mm pm

	// Catching information from message
	const date = dateRgx.exec(text)?.[1];
	const { hour, ampm = "" } = timeRgx.exec(text)?.groups ?? {};

	return new Date(`${date} ${hour} ${ampm}`);
}

function getStudySessionEstimatedLength(text) {
	// Regex Declaration
	const hoursRgx = /(\d)\s?hour/; // h hour(s)
	const minutesRgx = /(\d{1,2})\s?min/; // mm min(utes)

	// Catching information from message
	const estimatedLengthHours = hoursRgx.exec(text)?.[1];
	const estimatedLengthMinutes = minutesRgx.exec(text)?.[1];

	return estimatedLengthHours ? estimatedLengthHours * 60 : estimatedLengthMinutes;
}

// Retrieve Study Session information from message
function getStudySession(message) {
	const text = message.content;
	const m = {
		id: message.id,
		link: message.url,
		text: text.replace("!study", ""),
	};
	const author = {
		id: message.author.id,
		username: message.author.username,
	};
	const startDate = getStudySessionDate(text);
	const estimatedLength = getStudySessionEstimatedLength(text);

	// Return an error message (promise) if study session's start date valid
	if (isNaN(startDate.getDate())) return replyError(message, STUDY_SESSION.CREATE.MISSING_DATE);
	if (startDate < new Date()) return replyError(message, STUDY_SESSION.CREATE.DATE_PAST);
	if (!estimatedLength) return replyError(message, STUDY_SESSION.CREATE.MISSING_TIME);

	return { message: m, author, startDate, estimatedLength };
}

function createStudySession(message) {
	const studySession = getStudySession(message);
	// Check if studySession is a promise
	if (typeof studySession.then === "function") return null;
	return StudySession.create(studySession)
		.then(() => {
			replySuccess(message, STUDY_SESSION.CREATE.SUCCESS(studySession));
			react(message, null, ["⭐", "❌"]);
		})
		.catch((error) => replyError(message, STUDY_SESSION.CREATE.ERROR(error)));
}

function getUpcomingStudySessions(message) {
	return StudySession.find({ startDate: { $gt: new Date() } }, null, { sort: "startDate" }, (error, studySessions) => {
		if (error) return replyError(message, STUDY_SESSION.UPCOMING.ERROR(error));
		if (studySessions.length === 0) return replyError(message, STUDY_SESSION.UPCOMING.NOT_FOUND);
		return replySuccess(message, STUDY_SESSION.UPCOMING.SUCCESS(studySessions));
	}).limit(5);
}

function subscribeStudySession(message, user) {
	return StudySession.findOneAndUpdate({ "message.id": message.id }, { $push: { subscribersId: user.id } })
		.then(() => sendDirectMessage(user, STUDY_SESSION.SUBSCRIBE.SUCCESS(message.author, user)))
		.catch((error) => sendDirectMessage(user, STUDY_SESSION.SUBSCRIBE.ERROR(user, error)));
}

function unsubscribeStudySession(message, user) {
	return StudySession.findOneAndUpdate({ "message.id": message.id }, { $pull: { subscribersId: user.id } })
		.then(() => sendDirectMessage(user, STUDY_SESSION.UNSUBSCRIBE.SUCCESS(message.author, user)))
		.catch((error) => sendDirectMessage(user, STUDY_SESSION.UNSUBSCRIBE.ERROR(user, error)));
}

function notifySubscribers(client, studySession) {
	return studySession.subscribersId.map((subscriberId) => {
		return client.users
			.fetch(subscriberId)
			.then((subscriber) => {
				sendDirectMessage(subscriber, STUDY_SESSION.SUBSCRIBE.REMINDER(studySession, subscriber));
			})
			.catch((error) => console.error(error));
	});
}

function cancelConfirmationStudySession(message, user) {
	if (message.author.id !== user.id) return replyError(message, STUDY_SESSION.CANCEL.UNAUTHORIZED);
	return replySurvey(message, STUDY_SESSION.CANCEL.CONFIRMATION(user), ["✅", "❌"], 60000)
		.then((result) => {
			switch (result) {
				case "✅":
					return cancelStudySession(message);
				case "❌":
					return replyInfo(message, STUDY_SESSION.CANCEL.CANCEL);
				default:
					return replyInfo(message, STUDY_SESSION.CANCEL.TIME_ELAPSED);
			}
		})
		.catch((error) => replyError(message, STUDY_SESSION.CANCEL.ERROR(error)));
}

function cancelNotifySubscribers(message, studySession) {
	if (studySession.subscribersId?.length > 0)
		return studySession.subscribersId.map((subscriberId) => {
			message.client.users
				.fetch(subscriberId)
				.then((subscriber) => sendDirectMessage(subscriber, STUDY_SESSION.CANCEL.NOTIFICATION(message.author, subscriber)))
				.catch((error) => replyError(message, STUDY_SESSION.CANCEL.ERROR(error)));
		});
}

function cancelStudySession(message) {
	StudySession.findOne({ "message.id": message.id }, (error, studySession) => {
		if (error) return replyError(message, STUDY_SESSION.CANCEL.ERROR(error));
		cancelNotifySubscribers(message, studySession);
		studySession
			.remove()
			.then(() => replySuccess(message, studySession.subscribersId.length > 0 ? STUDY_SESSION.CANCEL.SUCCESS_WITH_SUBSCRIBERS(message.author) : STUDY_SESSION.CANCEL.SUCCESS(message.author)))
			.catch((error) => replyError(message, STUDY_SESSION.CANCEL.ERROR(error)));
	});
}

module.exports = { createStudySession, getUpcomingStudySessions, subscribeStudySession, unsubscribeStudySession, notifySubscribers, cancelConfirmationStudySession };
