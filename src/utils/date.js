function getUTCFullDate(date, separateIntoGroups = "") {
	if (!date) return "";
	const dateUTC = date.toUTCString();

	// Optionally separate date, year, time, and timezone into groups
	const separateRegEx = /(?<onlyDate>\w{3},\s\d+\s\w{3})\s(?<year>\d{4})\s(?<time>\d+:\d+).+(?<zone>\w{3})/;
	const { onlyDate, year, time, zone } = dateUTC.match(separateRegEx).groups;
	switch (separateIntoGroups) {
		case "date":
			return onlyDate;
		case "year":
			return year;
		case "time":
			return time;
		case "zone":
			return zone;
	}

	return dateUTC.substr(0, dateUTC.length - 7); // Remove seconds and GMT string
}

function getUTCFullTime(date) {
	if (!date) return "";
	const hour = date.getUTCHours();
	const min = date.getUTCMinutes();
	const fullHour = hour >= 10 ? hour : `0${hour}`;
	const fullMin = min > 10 ? min : `0${min}`;
	return `${fullHour}:${fullMin}`;
}

module.exports = { getUTCFullDate, getUTCFullTime };
