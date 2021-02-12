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

async function getVocab(range) {
	const gSheetsAPI = google.sheets({ version: "v4", auth: gClient });
	const request = {
		spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
		range
	};

	const weeklyVocabWords = await gSheetsAPI.spreadsheets.values.get(request);
	const result = parseVocab(weeklyVocabWords.data.values);
	return result;
}

// Convert fetched vocab arrays into an object
function parseVocab(result) {
	return result.map((elem) => ({
		key: elem[0],
		value: elem[1]
	}));
}

module.exports = { getVocab, gClient };
