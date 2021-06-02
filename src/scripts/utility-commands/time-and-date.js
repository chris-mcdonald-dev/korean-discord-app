const { DateTime } = require("luxon");

function convertBetweenTimezones(message) {
    let text = message.content ?? "";
    if (text.length < 10) {
        return;
    }
    text = text.substring(9).trim();

    const dateTime = getDateTimeFromMessage(text);
    if (dateTime === null) {
        message.reply("please provide a valid datetime in the format YYYY/MM/DD HH:mm");
        return;
    }

    const timezones = getTimeZonesFromMessage(text);
    if (timezones === null || timezones.length === 0) {
        message.reply("please provide at least one valid timezone to convert to. \n\nFor a list of valid timezones see the *'TZ database name'* column in this table here: <https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List>");
        return;
    }

    let convertedTimes = [];
    timezones.forEach(timezone => {
        const convertedTime = dateTime.setZone(timezone);
        if (convertedTime.invalid === null) {
            const timeZoneAbbreviation = convertedTime.offsetNameLong;
            const dateTimeString = `${convertedTime.weekdayShort}, ${convertedTime.day} ${convertedTime.monthShort} at ${convertedTime.toFormat('HH:mm')} *(${timeZoneAbbreviation})*`;
            convertedTimes.push(dateTimeString);
        }
    });

    message.channel.send(convertedTimes.join('\n'));
}

function getDateTimeFromMessage(text) {
    const dateRgx = /(\d{4}[-|\/]\d{2}[-|\/]\d{2})/g; // YYYY-MM-DD | YYYY/MM/DD
    const timeRgx = /(?<time>\d{1,2}:\d{2})\s?(?<meridian>(am|pm)\b)?/gi; // HH:mm | HH:mm am | HH:mm pm
    const date = dateRgx.exec(text)?.[1];
    const { time, meridian = "" } = timeRgx.exec(text)?.groups ?? {};
    const jsDate = new Date(`${date} ${time} ${meridian} +00:00`);
    if (isNaN(jsDate.getTime())) {
        return null;
    }
    return DateTime.fromISO(jsDate.toISOString());
}

function getTimeZonesFromMessage(text) {
    const timezoneRegex = /([A-Za-z]+[\/][A-Za-z0-9_\-+]*)/g;
    return text.match(timezoneRegex);
}

module.exports = { convertBetweenTimezones };
