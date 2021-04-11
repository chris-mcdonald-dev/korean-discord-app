const { google } = require("googleapis");
const keys = require("../../google-sheets.json");
// Declare scopes that determine the authorization level
const googleScopes = ["https://www.googleapis.com/auth/spreadsheets"];
// Create client
const gClient = new google.auth.JWT(keys.client_email, null, keys.private_key, googleScopes);

// Connect to Google Sheets
gClient.authorize((err, tokens) => {
	if (err) {
		console.log(`There was a problem connecting to Google Sheets: ${err}`);
	} else {
		console.log("Successfully connected to Google Sheets.");
	}
});

async function fetchVocab(range) {
	const gSheetsAPI = google.sheets({ version: "v4", auth: gClient });
	const request = {
		spreadsheetId: keys.spreadsheet_id,
		range: range,
	};

	const weeklyVocabWords = await gSheetsAPI.spreadsheets.values.get(request);
	const result = parseVocab(weeklyVocabWords.data.values);
	return result;
}

// Convert fetched vocab arrays into an object
function parseVocab(result) {
	return result.map((row) => ({
		word: row[0],
		definition: row[1],
	}));
}

module.exports = { fetchVocab };
