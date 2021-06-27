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
	const hoursRgx = /(\d+)\s?hour/; // h hour(s)
	const minutesRgx = /(\d+)\s?min/; // mm min(utes)

	// Catching information from message
	const estimatedLengthHours = hoursRgx.exec(text)?.[1] ?? 0;
	const estimatedLengthMinutes = minutesRgx.exec(text)?.[1] ?? 0;

	return (Number(estimatedLengthHours) * 60) + Number(estimatedLengthMinutes);
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
	StudySession.create(studySession)
		.then(() => {
			replySuccess(message, STUDY_SESSION.CREATE.SUCCESS(studySession));
			react(message, null, ["⭐"]);
		})
		.catch((error) => replyError(message, STUDY_SESSION.CREATE.ERROR(error)));
}

function getUpcomingStudySessions(message) {
	StudySession.find({ startDate: { $gt: new Date() } }, null, { sort: "startDate" }, (error, studySessions) => {
		if (error) return replyError(message, STUDY_SESSION.UPCOMING.ERROR(error));
		if (studySessions.length === 0) return replyError(message, STUDY_SESSION.UPCOMING.NOT_FOUND);
		return replySuccess(message, STUDY_SESSION.UPCOMING.SUCCESS(studySessions));
	}).limit(5);
}

function getUpcomingStudySessionsForScheduler() {
	return StudySession.find({ startDate: { $gt: new Date() } }, null, { sort: "startDate" }).limit(5).catch((error) => {
		console.log(error);
	});
}

function subscribeStudySession(message, user) {
	StudySession.findOneAndUpdate({ "message.id": message.id }, { $push: { subscribersId: user.id } })
		.then(() => sendDirectMessage(user, STUDY_SESSION.SUBSCRIBE.SUCCESS(message.author, user, message.content)))
		.catch((error) => sendDirectMessage(user, STUDY_SESSION.SUBSCRIBE.ERROR(user, error)));
}

function unsubscribeStudySession(message, user) {
	StudySession.findOneAndUpdate({ "message.id": message.id }, { $pull: { subscribersId: user.id } })
		.then(() => sendDirectMessage(user, STUDY_SESSION.UNSUBSCRIBE.SUCCESS(message.author, user)))
		.catch((error) => sendDirectMessage(user, STUDY_SESSION.UNSUBSCRIBE.ERROR(user, error)));
}

function notifySubscribers(client, studySession) {
	studySession.subscribersId.map((subscriberId) => {
		return client.users
			.fetch(subscriberId)
			.then((subscriber) => {
				sendDirectMessage(subscriber, STUDY_SESSION.SUBSCRIBE.REMINDER(studySession, subscriber));
			})
			.catch((error) => console.error(error));
	});
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

function cancelStudySessionFromCommand(message) {
	const authorId = message.author.id;
	const startDate = getStudySessionDate(message.content);
	if (isNaN(startDate.getDate())) return replyError(message, STUDY_SESSION.CANCEL.MISSING_DATE);

	return StudySession.findOne({
		"author.id": authorId,
		startDate: startDate
	}, (error, studySession) => {
		if (error) return replyError(message, STUDY_SESSION.CANCEL.ERROR(error));
		if (!studySession) return replyError(message, STUDY_SESSION.CANCEL.NOT_FOUND);

		cancelNotifySubscribers(message, studySession);
		studySession
			.remove()
			.then(() => replySuccess(message, studySession.subscribersId.length > 0 ? STUDY_SESSION.CANCEL.SUCCESS_WITH_SUBSCRIBERS(message.author) : STUDY_SESSION.CANCEL.SUCCESS(message.author)))
			.catch((error) => replyError(message, STUDY_SESSION.CANCEL.ERROR(error)));
	}).catch((error) => {
		console.log(error);
	});
}

function cancelStudySessionFromDeletion(message) {
	return StudySession.findOne({ "message.id": message.id }, (error, studySession) => {
		if (error) return replyError(message, STUDY_SESSION.CANCEL.ERROR(error));
		if (!studySession) return;
		cancelNotifySubscribers(message, studySession);
		studySession
			.remove()
			.then(() => replySuccess(message, studySession.subscribersId.length > 0 ? STUDY_SESSION.CANCEL.SUCCESS_WITH_SUBSCRIBERS(message.author) : STUDY_SESSION.CANCEL.SUCCESS(message.author)))
			.catch((error) => replyError(message, STUDY_SESSION.CANCEL.ERROR(error)));
	});
}

function updateStudySessionDetails(oldMessage, newMessage) {
	const newText = newMessage.content;
	const newStartDate = getStudySessionDate(newText);
	const oldText = oldMessage.content;
	const oldStartDate = getStudySessionDate(oldText);
	if (newStartDate === oldStartDate) {
		return;
	}
	return updateStudySessionStartDate(newMessage, newStartDate);
}

function updateStudySessionStartDate(message, startDate) {
	const filter = {
		"message.link": message.url
	};
	const update = {
		startDate: startDate,
		"message.text": message.content.replace("!study", "").trim()
	};
	const options = {
		new: true,
		lean: true
	};
	return StudySession.findOneAndUpdate(filter, update, options, (error, studySession) => {
		if (error) return replyError(message, STUDY_SESSION.UPDATE.ERROR(error));
		if (studySession.subscribersId?.length > 0) {
			studySession.subscribersId.map((subscriberId) => {
				message.client.users
					.fetch(subscriberId)
					.then((subscriber) => sendDirectMessage(subscriber, STUDY_SESSION.UPDATE.NOTIFICATION(message.author, subscriber, studySession.message.text)))
					.catch((error) => replyError(message, STUDY_SESSION.UPDATE.ERROR(error)));
			});
		}
		const successMessage = studySession.subscribersId.length > 0 ? STUDY_SESSION.UPDATE.SUCCESS_WITH_SUBSCRIBERS : STUDY_SESSION.UPDATE.SUCCESS;
		return replySuccess(message, successMessage);
	});
}

module.exports = { createStudySession, getUpcomingStudySessions, cancelStudySessionFromCommand, cancelStudySessionFromDeletion, subscribeStudySession, unsubscribeStudySession, notifySubscribers, getUpcomingStudySessionsForScheduler, updateStudySessionDetails };
