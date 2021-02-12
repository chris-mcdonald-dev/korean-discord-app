const { google } = require("googleapis");
// Declare scopes that determine the authorization level
const googleScopes = ["https://www.googleapis.com/auth/spreadsheets"];
// Create client
const gClient = new google.auth.JWT(process.env.GOOGLE_EMAIL, null, process.env.GOOGLE_PRIVATE_KEY, googleScopes);

// Connect to Google Sheets
gClient.authorize((err, tokens) => {
	if (err) {
		console.log(`There was a problem connecting to Google Sheets: ${err}`);
	} else {
		console.log("Successfully connected to Google Sheets.");
	}
});

async function getWeeklyVocab() {
	const gSheetsAPI = google.sheets({ version: "v4", auth: gClient });
	const request = {
		spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
		range: "Weekly Vocab!A2:B",
	};

	const weeklyVocabWords = await gSheetsAPI.spreadsheets.values.get(request);
	const result = parseVocab(weeklyVocabWords.data.values);
	return result;
}

async function getOldVocab() {
	const gSheetsAPI = google.sheets({ version: "v4", auth: gClient });
	const request = {
		spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
		range: "Old Vocab!A2:B",
	};

	const oldVocabWords = await gSheetsAPI.spreadsheets.values.get(request);
	const result = parseVocab(oldVocabWords.data.values);
	return result;
}

// Convert fetched vocab arrays into an object
function parseVocab(result) {
	const vocabObject = {};
	result.forEach((elem) => {
		vocabObject[elem[0]] = elem[1];
	});
	return vocabObject;
}

module.exports = { getWeeklyVocab, getOldVocab, gClient };
