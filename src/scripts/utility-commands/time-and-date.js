const { getDynamicDateTime, DATE_FORMAT } = require("../../utils/date");

const COMMAND = "!time";

function createDynamicTime(message) {
    let text = message.content ?? "";
    if (text.length < COMMAND.length) {
        return;
    }

    text = text.substring(5).trim();
    const dateTime = getDateTimeFromMessage(text) ?? new Date();

    const dynamicDateTimeString = getDynamicDateTime(dateTime, getFormat(text));
    message.channel.send(`${dynamicDateTimeString}\n\nAdd this dynamic time to your messages using \`${dynamicDateTimeString}\`\nUse \`!help time\` for more information.`);
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
    return jsDate;
}

function getFormat(text) {
    const keys = Object.keys(DATE_FORMAT);
    const formatPattern = new RegExp(`(${keys.join('|').replaceAll('_', ' ')})`);
    const maybeFormat = text.toUpperCase().match(formatPattern);
    return maybeFormat ? maybeFormat[0] : null;
}

module.exports = { createDynamicTime };
