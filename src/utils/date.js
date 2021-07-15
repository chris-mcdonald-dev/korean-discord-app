const DATE_FORMAT = Object.freeze({
	SHORT_DATE_TIME: 'f',
	LONG_DATE_TIME: 'F',
	SHORT_DATE: 'd',
	LONG_DATE: 'D',
	SHORT_TIME: 't',
	LONG_TIME: 'T',
	RELATIVE: 'R'
});

function getDynamicDateTime(date, outputFormat) {
	const format = outputFormat ? DATE_FORMAT[outputFormat.toUpperCase().replaceAll(' ', '_')] : 'f'
	return `<t:${removeMilliseconds(date)}:${format}>`
}

/**
 * @description JavaScript includes milliseconds but Discord's dynamic datetime feature only supports up to second precision
 */
function removeMilliseconds(date) {
	return Math.round(date.getTime() / 1000);
}

module.exports = { getDynamicDateTime, DATE_FORMAT };
