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
			if (game.situation.lostGame) {
				game.sceneData.zoomDick = game.now;
				game.currentScene.startTalk(game, "dick", [
					"You lost.",
					"Well, that figures.",
					"There's one thing you should know.",
					"I always win at this game."
				], game => {
					game.sceneData.zoomDick = 0;
					game.currentScene.bodyguardShoot(game);
				});
				return;
			}
			if (!game.situation.waitForPickup) {
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
														msg: "That's all.",
														onSelect: game => {
															game.currentScene.startTalk(game, "human", [
																"That'll be all. Thanks Ernest.",
															], game => {
																game.currentScene.startTalk(game, "ernest", [
																	"You are very\nwelcome, sir. Enjoy the game!",
																], game => {
																	game.playTheme(SOUNDS.JAIL_CELL_THEME);
																	game.situation.ernestLeave = game.now;
																	game.dialog = null;
																	game.currentScene.startTalk(game, "dick", [
																		"Are you ready to die?",
																		"Pick up your card and let's show our hands",
																	], game => {
																		game.situation.waitForPickup = game.now;
																	});
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
			} else {
				game.waitCursor = false;
				game.playTheme(SOUNDS.JAIL_CELL_THEME);				
			}
		},
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y;
			if (talker === "ernest") {
				x = 1;
				y = 50;
				game.playSound(SOUNDS.YES_SIR);
			} else if (talker === "dick") {
				x = 2;
				y = game.sceneData.zoomDick ? 22 : 54;
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
				game.currentScene.bodyguardShoot(game, true);
				game.dialog = null;
				if (!game.situation.ernestLeave) {
					game.situation.ernestLeave = game.now;
				}
				game.delayAction(game => {
					game.currentScene.startTalk(game, "bodyguard", [
						"I saw him take out his gun, boss.",
					], game => {
						game.currentScene.startTalk(game, "dick", [
							"You did well, Baxter.",
							"You did very well ...",
						], game => {
							game.gameOver("  “~I needed a\n      distraction.~”");
						});
					});
				}, 800);
			} else if (item === "ace of hearts") {
				if (game.situation.waitForPickup) {
					game.sceneData.switcharoo = game.now;
					game.useItem = null;
					game.delayAction(game => {
						game.situation.aceOfHearts = game.now;
						game.sceneData.switcharoo = 0;
						game.sceneData.lookAtCard = game.now;
						game.playSound(SOUNDS.PICKUP);
						game.showTip([
							"Hehe... they didn't notice that I switched the card.",
						], game => {
							game.sceneData.doneLookAtCard = game.now;
							game.currentScene.timeForShowdown(game);
						});
					}, 5000);
				}
			}
		},
		timeForShowdown: game => {
			game.currentScene.startTalk(game, "dick", "Show your hand!", game => {
				game.gotoScene("cards-showdown");
			});
		},
		onSceneRefresh: game => {
			if (game.sceneData.bodyguardShoot) {
				const progress = Math.min(1, (game.now - game.sceneData.bodyguardShoot) / 3000);
				game.fade = game.sceneData.bodyguardShoot ? .6 * progress : 0;
				game.fadeColor = "#990000";
				if (progress >= 1 && !game.data.gameOver && !game.sceneData.overrideGameOver) {
					game.gameOver("“~The odds were\n   stacked against\n   you.~”");
				}
			}
		},
		bodyguardShoot: (game, overrideGameOver) => {
			game.sceneData.overrideGameOver = overrideGameOver;
			game.sceneData.bodyguardShoot = game.now;
			game.playSound(SOUNDS.GUN_SHOT);
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
					if (game.sceneData.bodyguardShoot) {
						return pendingTip && pendingTip.talker === "bodyguard" && pendingTip.progress < 1 ? 25 + Math.floor(now/100)%3 : 25;
					}
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
				index: ({pendingTip, now, sceneTime, sceneData, situation}) => {
					if (situation.lostGame) {
						return 29;
					}
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
				index: 19,
				onClick: game => {
					game.situation.aceOfHearts = 0;
					game.sceneData.switcharoo = 0;
					game.sceneData.lookAtCard = game.now;
					game.playSound(SOUNDS.PICKUP);
					game.showTip([
						"Rats!!",
					], game => {
						game.sceneData.doneLookAtCard = game.now;
						game.currentScene.timeForShowdown(game);
					});
				},
				tip: "What is it going to be? Is it an Ace?",
				hidden: ({now, sceneData, situation}) => sceneData.lookAtCard || sceneData.dealingDick || sceneData.dealingHitman && Math.min(7, Math.floor(3 + (now - sceneData.dealingHitman) / 100)) < 7 || situation.lostGame,
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
					if (game.situation.ernestLeave) {
						return Math.max(-30, - ((game.now - game.situation.ernestLeave) / 300));
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
					} else if (item === "ace of hearts") {
						game.useItem = null;
						game.showTip("I better keep that card.");
						return true;
					}
				},
				hidden: game => game.situation.lostGame,
			},
			{
				src: ASSETS.TAVERN_GANGSTA_CARD_GAME, col: 5, row: 6,
				index: 28,
				hidden: game => !game.sceneData.bodyguardShoot || game.now - game.sceneData.bodyguardShoot > 100,
			},
			{
				src: ASSETS.SWITCHAROO,
				index: 2,
				hidden: game => !game.sceneData.switcharoo,
			},
			{
				src: ASSETS.SWITCHAROO,
				index: 1,
				hidden: game => !game.sceneData.switcharoo,
				offsetX: game => {
					const time = game.now - game.sceneData.switcharoo;
					if (time >= 2800) {
						return 4 + Math.min(64, (time - 2800) / 20);
					}				
					return 4;
				},
				offsetY: game => {
					const time = game.now - game.sceneData.switcharoo;
					if (time >= 2500) {
						return -2;
					}				
					return 0;
				},
			},
			{
				src: ASSETS.SWITCHAROO,
				index: 0,
				offsetX: game => {
					const time = game.now - game.sceneData.switcharoo;
					if (time < 2000) {
						return (2000 - time) / 100;
					}
					if (time >= 2500) {
						return Math.min(64, (time - 2500) / 20);
					}
					return 0;
				},
				offsetY: game => {
					const time = game.now - game.sceneData.switcharoo;
					if (time < 2000) {
						return 0;
					}		
					return Math.min(7, (time - 2000)/30);		
				},
				hidden: game => !game.sceneData.switcharoo,
			},
			{
				src: ASSETS.CARDS_SHOWDOWN, col: 2, row: 3,
				index: game => game.situation.aceOfHearts ? 0 : 1,
				offsetY: game => {
					if (game.sceneData.doneLookAtCard) {
						return Math.min(50, (game.now - game.sceneData.doneLookAtCard) / 5);
					}
					return Math.max(0, 20 - (game.now - game.situation.aceOfHearts) / 10);
				},
				hidden: game => !game.sceneData.lookAtCard && !game.sceneData.doneLookAtCard,
			},
			{
				src: ASSETS.ZOOM_DICK,
				index: game => {
					if (game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker === "dick") {
						return Math.floor(game.now / 100) % 4;
					}
					return 0;
				},
				flipH: true,
				hidden: game => !game.sceneData.zoomDick,
			},		
			...standardMenu(),
			...standardBag(),		
		],
	},
);