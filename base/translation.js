function processTranslation() {
	const request = new XMLHttpRequest();
		request.open("GET", 'translation.json');
		request.addEventListener("load", e => {
			if (request.status === 200) {
			const obj = JSON.parse(request.responseText);
			const now = new Date();
			for (let o in obj) {
				const { md5, text, timestamp } = obj[o];
				if (timestamp) {
					const age = now - new Date(timestamp);
					// if (age / 1000 / 60 / 60 / 24 < 1) {	//	less than a day old
						game.processText(obj[o].text, true);
					// }
				}
			}
			if (game)
				game.allowTranslation = true;
			}
		});

	if (request.overrideMimeType) {
	  request.overrideMimeType("application/json");
	}
	request.send();
}