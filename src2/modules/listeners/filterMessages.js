import {logMessageDate} from '../utils';
import {expletives, strictExpletives} from './blacklist';

// Expletive Filter
function filterExplicitWords(message) {
    const words = message.content.split(' ');
    const expletiveWords = expletives.filter((expletive) => words.includes(expletive));
    const strictExpletiveWords = strictExpletives.filter((expletive) => words.includes(expletive));

    if (expletiveWords.length > 0 || strictExpletiveWords.length > 0) {
        logMessageDate();
        message.delete();
        message.channel.send(`${message.author} wrote: "${global.newMessage}"`);
        console.log(`Edited ${message.content} to ${global.newMessage}`);
        message.reply(
            "\nHey! \nI said no bad words! If you don't want to play nice, I'm taking my ball and going home!"
        );
    }
}

/* ----------------- TO DO ----------------- */
/* Make Korean Filter */
// function checkKorean() {
// 	global.contentArray = message.content.split(/([^\w])/);
// 	// Filters out null indexes of array.
// 	noNulls = global.contentArray.filter(Boolean);

// 	console.log(`CONTENT ARRAY: ${noNulls}`);
// 	foundExpletive = false;
// 	noNulls.forEach((word, index) => {
// 		Object.keys(expletives).forEach((key, v) => {
// 			if (word.includes(key)) {
// 				foundExpletive = true;
// 				noNulls[index] = expletives[key];
// 			}
// 		});
// 		Object.keys(strictExpletives).forEach((key, v) => {
// 			if (word === key) {
// 				foundExpletive = true;
// 				noNulls[index] = strictExpletives[key];
// 			}
// 		});
// 	});
// 	global.newMessage = noNulls.join("");
// 	return foundExpletive;
// }
/* ------------------------------------------------ */

export {filterExplicitWords};
