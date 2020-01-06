game.addScene(
	{
		name: "gangsta-table",
		onScene: game => {
			game.playTheme(SOUNDS.TURTLE_SONG_THEME, {volume: .5});
			game.sceneData.approachGangsta = game.now;
			game.delayAction(game => {
				game.sceneData.gangstaLookUp = game.now;
				if (game.situation.challenged) {
					game.currentScene.startTalk(game, "dick", [
						"So, have you made up your mind?",
						"Baby Hitler vs your life",
					], game => {
						game.currentScene.challenge(game);
					});
				} else {
					game.currentScene.startTalk(game, "dick", [
						"You're blocking my light.",
					], game => {
						game.startDialog({
							conversation: [
								{
									options: [
										{
											msg: "Are you game?",
											onSelect: game => {
												game.currentScene.startTalk(game, "human", [
													"I challenge you to a card game.",
													"Are you man enough to face me?",
												], game => {
													game.currentScene.startTalk(game, "dick", [
														"I don't waste my time with\nmicrobes like you.",
														"But if the stakes are high.",
														"Perhaps I could be interested.",
													], game => {
														game.dialog.index ++;
													});

												});
											},
										},
										{
											msg: "We need to talk",
											onSelect: game => {
												game.currentScene.startTalk(game, "human", [
													"I'd like to talk to you",
												], game => {
													game.currentScene.startTalk(game, "dick", [
														"Can't you see I'm busy?",
														"Get lost.",
													]);
												});
											},
										},
										{
											msg: "Sorry",
											onSelect: game => {
												game.gotoScene("explore-tavern");
											},
										},
									],
								},
								{
									options: [
										{},
										{
											msg: "Baby Hitler",
											onSelect: game => {
												game.waitCursor = true;
												game.dialog.paused = true;
												game.sceneData.hitmanCloseup = game.now;
												game.currentScene.startTalk(game, "human", [
													"I know you are holding Baby Hitler.",
													"If I win the game, you let the kid go.",
												], game => {
													game.sceneData.hitmanCloseup = 0;
													game.currentScene.startTalk(game, "dick", [
														"You're doing all this...",
														"for Baby Hitler?!",
													], game => {
														game.sceneData.hitmanCloseup = game.now;
														game.delayAction(game => {
															game.sceneData.hitmanLookUp = game.now;
														}, 400);
														game.delayAction(game => {
															game.sceneData.hitmanCloseup = 0;
															game.sceneData.hitmanLookUp = 0;
															game.sceneData.showBabyHitlerWaiter = game.now;
															game.delayAction(game => {
																game.sceneData.showBabyHitlerWaiter = 0;
																game.sceneData.hitmanLookUp = game.now;
																game.sceneData.hitmanCloseup = game.now;
																game.waitCursor = false;

																game.startDialog({
																	conversation: [
																		{
																			options: [
																				{},
																				{
																					msg: "Yes",
																					onSelect: game => {
																						game.dialog = null;
																						game.currentScene.thatsRight(game, true);
																					},
																				},
																				{
																					msg: "No",
																					onSelect: game => {
																						game.dialog = null;
																						game.currentScene.thatsRight(game, false);
																					},
																				},
																			],
																		},
																	],
																});


															}, 3000);
														}, 1500);
													});
												});
											},
										},
										{
											msg: "Nevermind",
											onSelect: game => {
												game.gotoScene("explore-tavern");
											},
										},
									],
								},
							],
						});
					});
				}
			}, 5000);
		},
		thatsRight: (game, response) => {
			if (!response) {
				game.sceneData.hitmanLookUp = 0;
			}
			game.currentScene.startTalk(game, "human", response ? [
				"That's right!",
				"I'm doing this for Baby Hitler!",
			] : [
				"No, I just need Baby Hitler's help.",
				"He's the only one who can save me.",
			], game => {
				game.sceneData.hitmanCloseup = 0;
				game.sceneData.hitmanLookUp = 0;
				game.delayAction(game => {
					game.sceneData.dickToWaiter = game.now;
				}, 2000);
				game.delayAction(game => {
					game.sceneData.dickToWaiter = game.now;
					game.currentScene.startTalk(game, "dick", [
						"What are you waiting for kid!",
						"Go grab me a beer, right now!",
						"And if you spill a drop like last time, I'll kick you in the nutz!",
					], game => {
						game.sceneData.kidBow = game.now;
						game.currentScene.startTalk(game, "boy", [
							"Yes, boss!",
						], game => {
							game.sceneData.showBabyHitlerWaiter = game.now;
							game.currentScene.startTalk(game, "boy", [
								"Right away boss!",
							], game => {
								game.sceneData.boyGone = game.now;
								game.sceneData.showBabyHitlerWaiter = 0;
								game.sceneData.dickToWaiter = 0;
								game.currentScene.startTalk(game, "dick", [
									"I like to have a drink when I play someone.",
								], game => {
									game.sceneData.hitmanCloseup = game.now;
									game.currentScene.startTalk(game, "human", [
										"It means you accept my\nchallenge.",
										"You're going to play cards with me!",
									], game => {
										game.sceneData.hitmanCloseup = 0;
										game.currentScene.startTalk(game, "dick", [
											"Well that depends...",
											"If you win, you can take your boy, or whoever you want...",
											"Now if I win,",
											"I get to take your life!",
											"Do we have a deal?",
										], game => {
											game.currentScene.challenge(game);
										});
									});
								});
							});
						});
					});
				}, 2300);
			});
		},
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y;
			if (talker === "human") {
				if (game.sceneData.hitmanCloseup) {
					x = 5;
					y = 64;
				} else {
					x = 5;
					y = 15;
				}
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
			} else if (talker === "dick2") {
				x = 2;
				y = 24;
				game.playSound(SOUNDS.GRUMP);
			} else if (talker === "brutus") {
				x = 1;
				y = 20;
				game.playSound(SOUNDS.YES_BOSS);
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
		},
		challenge: game => {
			game.situation.challenged = game.now;
			game.startDialog({
				conversation: [
					{
						options: [
							{
								msg: "Deal!",
								onSelect: game => {
									game.currentScene.startTalk(game, "human", [
										"Deal!",
									], game => {
										game.currentScene.startTalk(game, "dick", [
											"Alright let's begin...",
											"We're going to play one of my favorite card game",
											"I call it ...",
											"WAR",
											"This is how the game plays out.",
											"You get a card, and I get a card.",
											"The highest card wins!",
										], game => {
											game.dialog.index ++;
										});
									});
								},
							},
							{
								msg: "No deal!",
								onSelect: game => {
									game.currentScene.startTalk(game, "human", [
										"No deal!",
										"I'm not gonna risk my life on a stupid game!",
									], game => {
										game.currentScene.startTalk(game, "dick", [
											"Well, let me know when you change your mind,",
											"chicken ....",
										], game => {
											game.gotoScene("explore-tavern");
										});
									});
								},
							},
							{
								msg: "I gotta pee",
								onSelect: game => {
									game.currentScene.startTalk(game, "human", [
										"Hum... I really need to pee.",
										"Let me go to the restroom.",
									], game => {
										game.sceneData.slippingAway = game.now;
										game.currentScene.startTalk(game, "human", [
											"Be right back!",
										], game => {
											game.currentScene.startTalk(game, "dick", [
												"Alright, you go ahead,",
												"chicken ....",
											], game => {
												game.gotoScene("explore-tavern");
											});
										});
									});
								},
							},
						],
					},
					{
						options: [
							{
								msg: "That's it?",
								onSelect: game => {
									game.currentScene.startTalk(game, "human", [
										"That's it? We're playing War?",
										"That's just a game of luck.",
									], game => {
										game.currentScene.startTalk(game, "dick", [
											"Are you having second thoughts now?",
											"chicken ....",
										]);
									});
								},
							},
							{
								msg: "And equal cards?",
								onSelect: game => {
									game.currentScene.startTalk(game, "human", [
										"What happens if the cards are equal?",
									], game => {
										game.currentScene.startTalk(game, "dick", [
											"We shoot it out.",
										], game => {
											game.currentScene.startTalk(game, "human", [
												"Wait... what?",
											], game => {
												game.currentScene.startTalk(game, "dick", [
													"I'm sure it won't happen anyway.",
												]);
											})
										});
									});
								},
							},
							{
								msg: "Why War?",
								hidden: game => game.sceneData.brotherStory,
								onSelect: game => {
									game.currentScene.startTalk(game, "human", [
										"Don't you have a better card game in mind?",
										"What's the big deal with War?",
									], game => {
										game.currentScene.startTalk(game, "dick", [
											"This was my younger brother's favorite game.",
											"He always used to win with the ace of heart.",
											"He was so lucky with that card, he even wrote his name on it.",
											"Not sure how he did it ... but I will never know ...",
											"Since my brother got murdered!",
											"We never found the killer. But I swear I will someday."
										], game => {
											game.currentScene.startTalk(game, "human", [
												"I hope you do.",
											]);
											game.sceneData.brotherStory = game.now;
										});
									});
								},
							},
							{
								msg: "Let's play",
								onSelect: game => {
									game.currentScene.startTalk(game, "human", [
										"Let's go, I'm ready to play!",
									], game => {
										game.dialog = null;
										game.currentScene.startTalk(game, "dick", [
											"Ok, then. For fairness,",
										], game => {
											game.sceneData.zoomDick = game.now;
											game.currentScene.startTalk(game, "dick2", [
												"we are going to ask Ernest to deal the cards.",
											], game => {
												game.gotoScene("ernest");
											});
										});
									});
								},
							},
						],
					},
				],
			});
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
					return 1;
				},
			},
			{	//	BARTENDER MOUTH
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				index: 3,
				hidden: ({now, pendingTip}) => Math.floor(now / 150) % 2 === 0 || !pendingTip || pendingTip.progress >= 1 || pendingTip.talker !== "bartender",
			},
			{	//	BOY
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				index: ({sceneData, now, pendingTip}) => {
					if (sceneData.kidBow && now - sceneData.kidBow < 300) {
						return 21
					}
					if (pendingTip && pendingTip.progress < 1 && pendingTip.talker === "boy" && Math.floor(now/150) % 2 === 0) {
						return 22;
					}
					return 6;
				},
				offsetX: game => {
					if (game.sceneData.boyGone) {
						return Math.min(30, (game.now - game.sceneData.boyGone) / 100);
					}
					return 0;
				},
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
				hidden: game => game.getSituation("tavern-phone").yupaAndBrutus,
			},
			{
				//	TABLE
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				index: 17,
				hidden: game => !game.getSituation("tavern-phone").yupaAndBrutus,
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
					if (game.sceneData.dickToWaiter) {
						if (game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker === "dick") {
							return 18 + Math.floor(game.now / 100) % 3;
						}
						return 18;
					}
					if (game.pendingTip && game.pendingTip.talker === "dick") {
						if (!game.sceneData.gangstaLookUp) {
							return game.pendingTip.progress < 1 ? Math.floor(game.now / 100) % 2 + 12 : 12;
						} else {
							return game.pendingTip.progress < 1 ? Math.floor(game.now / 100) % 2 + 14 : 14;
						}
					}
					return game.sceneData.gangstaLookUp ? 14 : 11;
				},
			},
			{	//	hitman
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				hidden: game => !game.sceneData.approachGangsta,
				offsetX: ({sceneData, now}) => {
					if (sceneData.slippingAway) {
						return (Math.max(-1000, - (now - sceneData.slippingAway) / 250));						
					}
					return (Math.min(0, -(4000 - (now - sceneData.approachGangsta)) / 250));
				},
				offsetY: ({sceneData, now}, sprite) => {
					if (sceneData.slippingAway) {
						return 1 - Math.abs(Math.sin((game.now -  sceneData.slippingAway) / 200)); 
					}
					return +1 + (now - sceneData.approachGangsta >= 4000 ? 0 : 64 - (64 + Math.abs(Math.sin((4000 + sceneData.approachGangsta - now)/200)) * 1));
				},
				side: LEFT,
				index: 16,
			},
			{	//	yupa
				src: ASSETS.TAVERN_GANGSTA, col: 5, row: 5,
				hidden: game => !game.sceneData.approachGangsta || game.getSituation("tavern-phone").yupaAndBrutus,
				offsetX: ({sceneData, now}) => {
					return (Math.max(0, (4000 - (now - sceneData.approachGangsta)) / 250));
				},
				offsetY: ({sceneData, now}, sprite) => +1 + (now - sceneData.approachGangsta >= 4000 ? 0 : 64 - (64 + Math.abs(Math.sin((4000 + sceneData.approachGangsta - now)/200)) * 1)),
				side: RIGHT,
				index: 16,
			},
			{
				src: ASSETS.TAVERN_HITMAN_CLOSEUP, col: 2, row: 3,
				index: ({pendingTip, now}) => {
					if (pendingTip && pendingTip.progress < 1 && pendingTip.talker === "human") {
						return Math.floor(now / 100) % 4;
					}
					return 0;
				},
				hidden: game => !game.sceneData.hitmanCloseup,
			},
			{

				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				scale: 1.5,
				offsetX: -33,
				offsetY: -20,
				hidden: game => !game.sceneData.hitmanCloseup,
				index: (game, sprite) => {
					const { pendingTip, now } = game;
					return pendingTip && pendingTip.talker === "human" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0;
				},
			},
			{
				src: ASSETS.TAVERN_HITMAN_CLOSEUP, col: 2, row: 3,
				index: 4,
				hidden: game => !game.sceneData.hitmanCloseup || !game.sceneData.hitmanLookUp,
			},
			{
				src: ASSETS.BABY_HITLER_WAITER, col: 2, row: 2,
				hidden: game => !game.sceneData.showBabyHitlerWaiter,
				index: ({pendingTip, now}) => {
					if (pendingTip && pendingTip.progress < 1 && pendingTip.talker === "boy") {
						return Math.floor(now / 100) % 4;
					}
					return 0;
				},
			},
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#453737";
					ctx.fillRect(0, 0, 64, 64);
				},
				hidden: game => !game.sceneData.zoomDick,
			},
			{
				src: ASSETS.ZOOM_DICK,
				index: game => {
					if (game.pendingTip && game.pendingTip.progress < 1 && game.pendingTip.talker === "dick2") {
						return Math.floor(game.now / 100) % 4;
					}
					return 0;
				},
				hidden: game => !game.sceneData.zoomDick,
			},
		],
	},
);