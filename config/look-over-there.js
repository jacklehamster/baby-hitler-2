game.addScene(
	{
		name: "look-over-there",
		onScene: game => {
			game.playTheme(SOUNDS.JAIL_CELL_THEME);
			game.currentScene.startTalk(game, "yupa", [
				"Look ova dere!",
			], game => {
				game.delayAction(game => {
					game.sceneData.showGangsta = game.now;
					game.delayAction(game => {
						game.sceneData.showGangsta = 0;
						game.sceneData.surprised = game.now;
						game.currentScene.startTalk(game, "human", [
							"That young boy over there, is that? ...",
						], game => {
							game.currentScene.startTalk(game, "yupa", [
								"Yeah, dat's Baby Hitla!",
							], game => {
								game.delayAction(game => {
									game.sceneData.showBabyHitlerWaiter = game.now;
									game.delayAction(game => {
										game.sceneData.showBabyHitlerWaiter = 0;										
										game.currentScene.startTalk(game, "human", [
											"Are you sure?",
											"He doesn't look at all like a future dictator...",
										], game => {
											game.currentScene.startTalk(game, "yupa", [
												"Yeah, I raconize dat hairstyle",
												"Definatly dats him.",
											], game => {
												game.currentScene.startTalk(game, "human", [
													"Ok... then that man sitting there.",
													"I bet you that's Dick Ruber.",
												], game => {
													game.sceneData.showGangsta = game.now;
													game.currentScene.startTalk(game, "human", [
														"Looks like he's surrrounded by two\nbodyguards,",
														"which might cause a bit of trouble.",
														"Let's first check out the room,",
														"then we can talk with him.",
													], game => {
														game.gotoScene("explore-tavern");
													});
												});
											});
										});
									}, 3000);
								}, 3000);
							});
						});
					}, 4000);
				}, 1000);
			});
			game.delayAction(game => {
				game.sceneData.turnHead = game.now;
			}, 1500);
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
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
		},
		sprites: [
			{
				src: ASSETS.LOOK_RIGHT_LEFT, col: 4, row: 5,
				index: 0,
			},
			{	//	HITMAN
				src: ASSETS.LOOK_RIGHT_LEFT, col: 4, row: 5,
				index: game => {
					if (game.sceneData.turnHead) {
						const frames = [ 5, 4, 1, 2, 3, ];
						const frameIndex = Math.min(4, Math.floor((game.now - game.sceneData.turnHead) / 200));
						return frames[frameIndex];
					} else {
						return 5;
					}
				},
			},
			{	//	HITMAN MOUTH
				src: ASSETS.LOOK_RIGHT_LEFT, col: 4, row: 5,
				index: game => {
					if (game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker === "human") {
						return Math.floor(game.now / 200) % 4 + 13;
					}
					return 13;
				},
				hidden: game => !game.sceneData.surprised,
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				scale: (game, sprite) => 1.2,
				offsetX: (game, sprite) => {
					if (game.sceneData.turnHead) {
						const frameIndex = Math.min(4, Math.floor((game.now - game.sceneData.turnHead) / 200));
						return 2.5 + (2 - frameIndex) / 2;
					} else {
						return 3.5;
					}
				},
				offsetY: (game, sprite) => -10,
				index: (game, sprite) => {
					const { pendingTip, now } = game;
					return pendingTip && pendingTip.talker === "human" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0;
				},
			},
			{	//	YUPA
				src: ASSETS.LOOK_RIGHT_LEFT, col: 4, row: 5,
				index: 8,
			},
			{	//	YUPA
				src: ASSETS.LOOK_RIGHT_LEFT, col: 4, row: 5,
				index: game => {
					const frame = Math.floor(game.now / 50) % 3;
					return frame !== 0 ? frame % 2 + 11 : 8;
				},
				hidden: game => !game.pendingTip || game.pendingTip.progress >= 1 || game.pendingTip.talker !== "yupa",
			},
			{	//	BG
				src: ASSETS.TAVERN_GANGSTA, col: 2, row: 2,
				hidden: game => !game.sceneData.showGangsta,
			},
			{	//	Dick Ruber
				src: ASSETS.TAVERN_GANGSTA, col: 2, row: 2,
				hidden: game => !game.sceneData.showGangsta,
				index: game => {
					return game.sceneData.gangstaLookUp ? 2 : 1;
				},
			},
			{	//	yupa
				src: ASSETS.TAVERN_GANGSTA, col: 2, row: 2,
				hidden: game => !game.sceneData.showGangsta || !game.sceneData.approachGangsta,
				side: LEFT,
				index: 3,
			},
			{	//	hitman
				src: ASSETS.TAVERN_GANGSTA,
				hidden: game => !game.sceneData.showGangsta || !game.sceneData.approachGangsta,
				side: RIGHT,
				index: 3,
			},
			{
				src: ASSETS.BABY_HITLER_WAITER,
				hidden: game => !game.sceneData.showBabyHitlerWaiter,
			},
		],
	},
);