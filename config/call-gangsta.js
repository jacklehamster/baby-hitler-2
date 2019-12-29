game.addScene(
	{
		name: "call-gangsta",
		onScene: game => {
			game.playTheme(SOUNDS.TURTLE_SONG_THEME, {volume: .5});
			game.delayAction(game => {
				game.sceneData.waving = game.now;
				game.currentScene.startTalk(game, "bartender", [
					"Hey Dick",
					"Someone on the phone wants to talk to you!",
				], game => {
					game.delayAction(game => {
						game.currentScene.startTalk(game, "dick", [
							"Hey Brutus, go and check what they want.",
							"I'm busy here.",
						], game => {
							game.currentScene.startTalk(game, "brutus", [
								"Right away, boss."
							], game => {
								game.delayAction(game => {
									game.gotoScene("tavern-phone");
									game.currentScene.brutusOnPhone(game);
								}, 1000);
							});
						});
					}, 2500);
				});
			}, 1000);
		},
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y;
			if (talker === "human") {
				x = 5;
				y = 15;
				game.playSound(SOUNDS.HUM);
			} else if (talker === "yupa") {
				x = 2;
				y = 44;
				game.playSound(SOUNDS.YUPA);				
			} else if (talker === "bartender") {
				x = 4;
				y = 40;
				game.playSound(SOUNDS.HELLO_HUMAN, {volume: .2});
			} else if (talker === "dick") {
				x = 2;
				y = 60;
				game.playSound(SOUNDS.GRUMP);
			} else if (talker === "brutus") {
				x = 1;
				y = 20;
				game.playSound(SOUNDS.YES_BOSS);
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
		},
		sprites: [
			{	//	BG
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
			},
			{	//	BARTENDER
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				index: game => {
					if (game.sceneData.waving && game.now - game.sceneData.waving < 2000) {
						return Math.floor(game.now / 150) % 2 + 4;
					}
					return 2;
				},
			},
			{	//	BARTENDER MOUTH
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				index: 3,
				hidden: ({now, pendingTip}) => Math.floor(now / 150) % 2 === 0 || !pendingTip || pendingTip.progress >= 1 || pendingTip.talker !== "bartender",
			},
			{	//	BOY
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				index: 6,
			},
			{
				//	BODYGUARDS
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				side: LEFT,
				index: game => {
					if (game.pendingTip && game.pendingTip.talker === "brutus" && game.pendingTip.progress < 1) {
						return 7 + Math.floor(game.now / 100) % 2;
					}
					return 7;
				},
			},
			{
				//	BODYGUARDS
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				side: RIGHT,
				index: 7,
			},
			{
				//	TABLE
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				index: 10,
			},
			{	//	Dick Ruber
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				index: game => {
					if (game.sceneData.dickTurnHead) {
						return 12;
					}
					if (game.pendingTip && game.pendingTip.talker === "dick") {
						return game.pendingTip.progress < 1
							? Math.floor(game.now / 100) % 2 + 12
							: 12;
					}
					return game.sceneData.gangstaLookUp ? 14 : 11;
				},
			},
		],
	},
);