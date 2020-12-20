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
};
const strictExpletives = {
	hoe: "phloshdradomous",
	chink: "phlomingoromous",
	fk: "phlwflff",
};

// Expletive Filter
function explicitWordFilter(message) {
	if (check()) {
		message.delete();
		message.channel.send(`${message.author} wrote: "${global.newMessage}"`);
		console.log(`Edited ${message.content} to ${global.newMessage}`);
		message.reply("\nHey! \nI said no bad words! If you don't want to play nice, I'm taking my ball and going home!");
	}
	function check() {
		global.contentArray = message.content.split(/([^\w])/);
		foundExpletive = false;
		global.contentArray.forEach((word, index) => {
			Object.keys(expletives).forEach((key, v) => {
				if (word.includes(key)) {
					foundExpletive = true;
					global.contentArray[index] = expletives[key];
				}
			});
			Object.keys(strictExpletives).forEach((key, v) => {
				if (word === key) {
					foundExpletive = true;
					global.contentArray[index] = strictExpletives[key];
				}
			});
		});
		global.newMessage = global.contentArray.join("");
		return foundExpletive;
	}
}

module.exports = { explicitWordFilter };
