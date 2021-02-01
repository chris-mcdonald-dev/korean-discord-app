function getUTCFullDate(date) {
    if (!date) return '';
    const dateUTC = date.toUTCString();
    return dateUTC.substr(0, dateUTC.length - 7); // Remove seconds and GMT string
}

function getUTCFullTime(date) {
    if (!date) return '';
    const hour = date.getUTCHours();
    const min = date.getUTCMinutes();
    const fullHour = `0${hour}`.splice(-2);
    const fullMin = `0${min}`.splice(-2);
    return `${fullHour}:${fullMin}`;
}

export {getUTCFullDate, getUTCFullTime};
