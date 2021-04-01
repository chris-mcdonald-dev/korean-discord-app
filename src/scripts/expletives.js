const { logMessageDate } = require("./utilities");

// List of Expletives
const expletives = {
	fuck: "phlewflaff",
	pussy: "phloomance",
	pussie: "phloomancers",
	dick: "phloopdie",
	bitch: "phliminal",
	nigger: "phloshious",
	titties: "phlophinums",
	titty: "phlophinum",
	shit: "phloopy",
	fuk: "phlewflaff",
	cunt: "phlomingous",
	choad: "phlomoninom",
	twat: "phlololonum",
	wanker: "phlonominium",
	bich: "plinimal",
	cock: "phloopdie",
	slut: "phliminustrim",
	whore: "phlungus",
	썅놈: "포비",
	썅년: "패티",
	ㅄ: "크롱",
	ㅈㄴ: "친구들모이게~",
	ㅅㅂ: "힝나삐짐",
	미친놈: "꼬마펭귄",
	ㅁㅊ놈: "꼬마펭귄",
	미친년: "내친구루피",
	ㅁㅊ년: "내친구루피",
	개새끼: "뽀로로",
};
const strictExpletives = {
	hoe: "phloshdradomous",
	chink: "phlomingoromous",
	fk: "phlwflff",
	시발: "힝나삐짐",
	씨발: "힝나삐짐",
	애미: "우리엄마사랑행",
	존나: "친구들모이게~",
	졸라: "친구들모이게~",
	병신: "크롱",
};

let newMessage;

// Expletive Filter
function explicitWordFilter(message) {
	if (check(message)) {
		logMessageDate();
		message.delete();
		message.channel.send(`${message.author} wrote: "${newMessage}"`);
		console.log(`Edited ${message.content} to ${newMessage}`);
		message.reply("\nHey! \nI said no bad words! If you don't want to play nice, I'm taking my ball and going home!");
		return true;
	}
	return false;
}

/* Regex to capture both English and Korean words */
const englishKoreanRegex = /([\w]+|[\x00-\x7F\x80-\xFF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF])/

/* Checks if message has expletives */
function check(message) {
	if (!message.content) return
	let contentArray = message.content.split(englishKoreanRegex);

	let foundExpletive = false;
	contentArray.forEach((word, index) => {
		if (word.length < 2) {
			return;
		}
		word = replaceSymbols(word);
		/* Filters out any string that includes expletive */
		Object.keys(expletives).forEach((key) => {
			if (word.toLowerCase().includes(key.toLowerCase())) {
				foundExpletive = true;
				contentArray[index] = expletives[key];
			}
		});
		/* Only filters out exact matches for strictExpletives */
		Object.keys(strictExpletives).forEach((key) => {
			if (word.toLowerCase() === key.toLowerCase()) {
				foundExpletive = true;
				contentArray[index] = strictExpletives[key];
			}
		});
	});
	newMessage = contentArray.join("");
	return foundExpletive;
}


/* Replaces characters used to get around expletive filters */
function replaceSymbols(word) {
	return word
		.replace(/\$/g, "s")
		.replace(/5/g, "s")
		.replace(/8/g, "b")
		.replace(/\#/g, "h")
		.replace(/vv/g, "w")
		.replace(/\@/g, "a")
		.replace(/4/g, "a")
		.replace(/3/g, "e")
		.replace(/7/g, "t")
		.replace(/\!/g, "i")
		.replace(/1/g, "i")
		.replace(/0/g, "o");
}

module.exports = { explicitWordFilter };
