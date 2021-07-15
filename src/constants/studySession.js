const { getDynamicDateTime } = require("../utils/date");

// Study session's related messages
const STUDY_SESSION = {
	CREATE: {
		SUCCESS: (session) => ({
			title: "STUDY SESSION",
			content: "Study session has been registered successfully!",
			description: `📆 ${getDynamicDateTime(session.startDate, 'long date time')}\n🕑 Estimated length: ${session.estimatedLength} minutes.\n\n${getStudySessionText(session.message)}\n\n*If anybody wants to join the session, subscribe using the ⭐ button\nIf you want to cancel the session, delete the message used to create it*`,
			withAuthor: true,
		}),
		ERROR: (error) => ({
			title: "❌ Creation error",
			description: `Oops! An error as occurred while creating the study session. Please try again!${error ? `\n\n*${error}*` : ""}`,
		}),
		DATE_PAST: {
			title: "📆 Date in the past",
			description: "Oops! Looks like the study session date is already past!",
		},
		MISSING_DATE: {
			title: "📆 Missing date",
			description: "Do you want to create a study session? Please, provide a valid date!\n\n*Just a reminder, the accepted format is `YYYY/MM/DD` for the date and `HH:mm` for the time.*",
		},
		MISSING_TIME: {
			title: "🕑 Missing session length",
			description: "Do you want to create a study session? Please, provide a valid session length!\n\n*Just a reminder, the accepted format is `0 hour(s) and 00 minutes` for the session length.*",
		},
	},
	UPDATE: {
		SUCCESS: { content: `😉 Roger! Study session has been updated.` },
		SUCCESS_WITH_SUBSCRIBERS: { content: `😉 Roger! All the participants will be notified in their DMs.` },
		NOTIFICATION: (author, subscriber, sessionText) => ({
			content: `Hey ${subscriber.username}! <@${author.id}> just updated a study session which you were subscribed to.`,
			title: 'Updated study session',
			description: sessionText
		}),
		ERROR: (error) => ({
			title: "❌ Updating error",
			description: `Oops! An error as occurred while updating the study session. Please try again!${error ? `\n\n*${error}*` : ""}`,
		})
	},
	UPCOMING: {
		SUCCESS: (sessions) => ({
			title: "UPCOMING STUDY SESSIONS",
			content: "Here are the upcoming study sessions:\n*Make sure to check the time zones!*",
			fields: sessions.map((session) => ({
				name: `${session.author.username}'s study session`,
				value: `*${getDynamicDateTime(session.startDate, 'short date time')} (${session.estimatedLength} min)*\n${getUpcomingStudySessionSummary(session.message)} - Subscribe [here](${session.message?.link})`,
			})),
		}),
		ERROR: (error) => ({
			title: "❌ Fetching error",
			description: `Oops! An error as occurred while fetching the study sessions. Please try again!${error ? `\n\n*${error}*` : ""}`,
		}),
		NOT_FOUND: {
			title: "🙈 No sessions found",
			description: "Oops! Looks like there's no upcoming session (yet). Do you wanna create one?",
		},
	},
	SUBSCRIBE: {
		SUCCESS: (author, subscriber, messageContent) => ({
			content: `👋 Hey ${subscriber.username}, you successfully registered to <@${author.id}> study session! See you soon!`,
			description: messageContent.substr(6).trim(),
		}),
		REMINDER: (studySession, subscriber) => ({ content: `👋 How is your day going, ${subscriber.username}? Thank you for waiting, <@${studySession.author.id}>'s study session is starting ${getDynamicDateTime(studySession.startDate, 'relative')}! See you on the Korean Study Group server at **${getDynamicDateTime(studySession.startDate, 'short time')}**!\n` }),
		ERROR: (author, error) => ({
			content: `${author.username}, you just tried to subscribe to a study session. Thanks for your participation! However, an error as occurred during the process. Please try again! (and don't hesitate to notify <@202787014502776832> about this error)`,
			title: "❌ Subscription error",
			description: error,
		}),
	},
	UNSUBSCRIBE: {
		SUCCESS: (author, subscriber) => ({ content: `😢 Oh dear ${subscriber.username}, you unsubscribed to <@${author.id}> study session... Maybe next time!` }),
		ERROR: (error) => ({
			content: `${author.username}, you just tried to unsubscribe to a study session... I'm sorry, but an error as occurred during the process. Please try again! (and don't hesitate to notify <@202787014502776832> about this error)`,
			title: "❌ Unsubscription error",
			description: error,
		}),
	},
	CANCEL: {
		CONFIRMATION: (author) => ({ content: `😮 <@${author.id}> Do you really want to cancel this study session? This action is irreversible` }),
		SUCCESS: (author, studySession) => ({ content: `😉 Roger! ${getStudySessionCancellationInformation(studySession)}. Looking forward to see you again, <@${author.id}>!` }),
		SUCCESS_WITH_SUBSCRIBERS: (author, studySession) => ({ content: `😉 Roger! ${getStudySessionCancellationInformation(studySession)}. All the participants will be notified in their DMs. Looking forward to see you again, <@${author.id}>!` }),
		NOTIFICATION: (author, subscriber, studySession) => ({ content: `Hey ${subscriber.username}! I'm sorry to tell you that <@${author.id}> just cancelled ${getStudySessionCancellationSubscriberNotification(studySession)} to which you were subscribed. It happens! See you soon!` }),
		TIME_ELAPSED: { content: "🕑 Tic, tac... One minute lapsed, let's say you didn't intend to cancel the session!" },
		CANCEL: { content: "😁 Oh, you didn't mean it! Alright, happy to hear that we can maintain the study session!" },
		ERROR: (error) => ({
			title: "❌ Cancellation error",
			description: `Oops! An error as occurred while cancelling the study session. Please try again!${error ? `\n\n*${error}*` : ""}`,
		}),
		UNAUTHORIZED: { content: "❌ Hep! Only the study session's owner can cancel the session." },
		NOT_FOUND: {
			title: "🙈 No sessions found",
			description: "Oops! Looks like you haven't created any sessions at that time.",
		},
		MISSING_DATE: {
			title: "📆 Missing date",
			description: "Please provide a valid date!\n\n*The accepted format is `YYYY/MM/DD` for the date and `HH:mm` for the time.*",
		},
	},
};

function getStudySessionText(message) {
	if (!message || !message.text) {
		return "";
	}
	const lines = message.text.split("\n");
	if (lines.length < 2) {
		return lines[0];
	}
	return lines.splice(1, lines.length - 1).join("\n");
}

function getUpcomingStudySessionSummary(message) {
	if (!message || !message.text) {
		return "";
	}

	const text = message.text;
	const firstLine = text.split("\n", 1)[0].trim();
	if (firstLine.length > 0) {
		return firstLine;
	}

	const contentOnSingleLine = text.split("\n").join(" ").trim();
	const truncatedString = contentOnSingleLine.split(" ").splice(0, 8).join(" ");
	if (contentOnSingleLine.length > truncatedString.length + 3) {
		return truncatedString + "...";
	}
	return truncatedString;
}

function getStudySessionCancellationInformation(studySession) {
	const startDate = studySession.startDate;
	const title = getTitle(studySession.message);
	let cancellationMessage = "Your study session";
	if (title) {
		cancellationMessage = title;
	}

	return `${cancellationMessage} on ${getDynamicDateTime(startDate, 'long date time')} has been cancelled`;
}

function getTitle(message) {
	if (!message || !message.text) {
		return "";
	}

	const text = message.text;
	const firstLine = text.split("\n", 1)[0].trim();
	if (firstLine.length > 0) {
		return firstLine;
	}
}

function getStudySessionCancellationSubscriberNotification(studySession) {
	const startDate = studySession.startDate;
	const title = getTitle(studySession.message);
	let cancellationMessage = "their study session";
	if (title) {
		cancellationMessage = title;
	}

	return `${cancellationMessage} on ${getDynamicDateTime(startDate, 'long date time')}`;
}

module.exports = { STUDY_SESSION };
