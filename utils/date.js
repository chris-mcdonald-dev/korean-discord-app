function getUTCFullDate(date) {
    if (!date) return '';
    const dateUTC = date.toUTCString();
    return dateUTC.substr(0, dateUTC.length - 7); // Remove seconds and GMT string
}

function getUTCFullTime(date) {
    if (!date) return '';
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();
    const fullHour = hour > 10 ? hour : `0${hour}`;
    const fullMin = min > 10 ? min : `0${min}`;
    return `${fullHour}:${fullMin}`;
}

module.exports = { getUTCFullDate, getUTCFullTime };
