game.addScene(
	{
		name: "ernest-card-dealing",
		arrowGrid: [
			[null, null,  MENU,  null, null ],
			[],
			[ null, null, null,  null, null ],
			[ null, null, null,  null, null ],
			[ null, null, BAG,  null, null ],
		],
		onScene: game => {
			game.waitCursor = true;
			game.playSound(SOUNDS.HIT, {volume: .5});
			game.sceneData.dealingDick = game.now;
			game.delayAction(game => {
				game.sceneData.dealingDick = 0;
				game.playSound(SOUNDS.HIT, {volume: .5});
				game.sceneData.dealingHitman = game.now;
			}, 600);
			game.delayAction(game => {
				game.sceneData.dealingHitman = 0;
				game.delayAction(game => {
					game.sceneData.turnToDick = game.now;
				}, 3000);
				game.currentScene.startTalk(game, "ernest", [
					"Very well\ngentlemen. Is there anything else I can do for you?",
				], game => {
					game.sceneData.dickToErnest = game.now;
					game.currentScene.startTalk(game, "dick", [
						"Thank you Ernest, that'll be it for now.",
					], game => {
						game.currentScene.startTalk(game, "ernest", [
							"You are very\nwelcome.",
						], game => {
							game.sceneData.turnToDick = 0;
							game.delayAction(game => {
								game.sceneData.dickToErnest = 0;
							}, 200);
							game.currentScene.startTalk(game, "ernest", [
								"How about you sir?",
							], game => {
								game.waitCursor = false;
								game.startDialog({
									conversation: [
										{
											options: [
												{
													msg: "Gimme an Ace",
													onSelect: game => {
														game.currentScene.startTalk(game, "human", [
															"I wanna win this hand.",
															"Can you give me an ace?",
														], game => {
															game.currentScene.startTalk(game, "ernest", [
																"Perhaps I already did, sir.",
															]);
														});
													},
												},
												{
													msg: "Nothing, thanks.",
													onSelect: game => {
														game.currentScene.startTalk(game, "human", [
															"That'll be all. Thanks Ernest.",
														], game => {
															game.currentScene.startTalk(game, "ernest", [
																"You are very\nwelcome, sir. Enjoy the game!",
															], game => {
																game.sceneData.ernestLeave = game.now;
																game.dialog = null;
																game.currentScene.startTalk(game, "dick", [
																	"Are you ready to die?",
																	"Pick up your card and let's show our hands",
																]);
															});
														});
													},
												},
											],
										},
									],
								});
							});							
						});						
					});
				});
			}, 1500);
		},
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y;
			if (talker === "ernest") {
				x = 1;
				y = 50;
				game.playSound(SOUNDS.YES_SIR);
			} else if (talker === "dick") {
				x = 2;
				y = 54;
				game.playSound(SOUNDS.GRUMP);				
			} else if (talker === "bodyguard") {
				x = 5;
				y = 44;
				game.playSound(SOUNDS.YES_BOSS);
			} else if (talker === "human") {
				x = 4;
				y = 62;
				game.playSound(SOUNDS.HUM);
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
		},
		onSceneHoldItem: (game, item) => {
			if (item === "gun") {
				game.useItem = null;
				game.waitCursor = true;
			}
		},		
		sprites: [
			{
				src: ASSETS.TAVERN_GANGSTA_CARD_GAME, col: 5, row: 6,
				index: 24,
			},
			{
				src: ASSETS.TAVERN_GANGSTA_CARD_GAME, col: 5, row: 6,
				side: RIGHT,
				index: ({pendingTip, now}) => {
					return pendingTip && pendingTip.talker === "bodyguard" && pendingTip.progress < 1 ? 20 + Math.floor(now/100)%3 : 20;
				},
				tip: "Let's be careful, that bodyguard has an eye on me.",
			},
			{
				src: ASSETS.TAVERN_GANGSTA_CARD_GAME, col: 5, row: 6,
				side: LEFT,
				index: 20,
				tip: "Let's be careful, that bodyguard has an eye on me.",
				hidden: game => game.getSituation("tavern-phone").yupaAndBrutus,
			},
			{
				src: ASSETS.TAVERN_GANGSTA_CARD_GAME, col: 5, row: 6,
				index: 19,
				onClick: game => {

				},
				combine: game => {
					if (item === "ace of hearts") {
						console.log("Switching cards");
					}
				},
				tip: "What is it going to be? Is it an Ace?",
			},
			{
				src: ASSETS.TAVERN_GANGSTA_CARD_GAME, col: 5, row: 6,
				index: ({pendingTip, now, sceneTime, sceneData}) => {
					if (sceneData.dealingHitman) {
						return Math.min(7, Math.floor(3 + (now - sceneData.dealingHitman) / 100));
					}
					if (sceneData.dealingDick) {
						return Math.min(3, Math.floor((now - sceneData.dealingDick) / 100));
					}
					if (sceneData.dickToErnest) {
						return pendingTip && pendingTip.talker === "dick" && pendingTip.progress < 1 ? 9 + Math.floor(now/100)%2 : 9;
					}
					return pendingTip && pendingTip.talker === "dick" && pendingTip.progress < 1 ? 7 + Math.floor(now/100)%2 : 7;
				},
			},
			{
				src: ASSETS.TAVERN_GANGSTA_CARD_GAME, col: 5, row: 6,
				index: ({pendingTip, now, sceneTime, sceneData}) => {
					if (sceneData.coinForErnest) {
						return pendingTip && pendingTip.talker === "ernest" && pendingTip.progress < 1 ? 17 + Math.floor(now/100)%2 : 17;
					}
					if (sceneData.dealingHitman) {
						return 12;
					}
					if (sceneData.dealingDick) {
						return 11;
					}
					if (sceneData.turnToDick) {
						return pendingTip && pendingTip.talker === "ernest" && pendingTip.progress < 1 ? 13 + Math.floor(now/100)%2 : 13;
					}
					return pendingTip && pendingTip.talker === "ernest" && pendingTip.progress < 1 ? 15 + Math.floor(now/100)%2 : 15;
				},
				side: LEFT,
				offsetX: game => {
					if (game.sceneData.ernestLeave) {
						return Math.max(-30, - ((game.now - game.sceneData.ernestLeave) / 300));
					}
					return 0;
				},
				combine: (item, game) => {
					if (item === "coin") {
						game.removeFromInventory(item);
						game.useItem = null;
						game.sceneData.coinForErnest = game.now;
						game.playSound(SOUNDS.PICKUP);
						game.currentScene.startTalk(game, "ernest", [
							"Thank you sir!",
							"Your generosity is appreciated.",
						], game => {
							game.sceneData.coinForErnest = 0;
						});
						return true;
					}
				},
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);