const GANSTER_NAME = "Dick Ruber";
const PASSWORD = "707 - 8008";
game.addScene(
	{
		name: "tavern-stranger-zoom",
		arrowGrid: [
			[null, null,  MENU,  null, null ],
			[],
			[ null, null, null,  null, null ],
			[ null, null, null,  null, null ],
			[ null, null, BAG ,  null, null ],
		],
		startTalk: (game, talker, msg, onDone, removeLock) => {
			let x, y;
			if (talker === "human") {
				x = 2;
				y = 62;
				game.playSound(SOUNDS.HUM);
			} else if (talker === "stranger") {
				x = 3;
				y = 45;
//				game.playSound(SOUNDS.YUPA);
			}
			game.showTip(msg, onDone, null, { x, y, talker, removeLock });
		},
		onSceneHoldItem: (game, item) => {
			if (item === "gun") {
				game.useItem = null;
				game.showTip("I don't want to scare anyone.");
			}
		},
		onScene: game => {
			const { currentScene, situation, now, sceneData } = game;
			if (!situation.cigLit) {
				game.delayAction(({sceneData, now}) => {
					sceneData.takeOutCig = now;
				}, 1000);
				currentScene.startTalk(game, "stranger", "Hey there, you got light?", game => {
				});
			} else if (game.inventory["ace of hearts"]) {
				currentScene.startTalk(game, "stranger", [
					"You already know what to do.",
					`Go find ${GANSTER_NAME} and beat him at the game.`,
					"To get into the tavern, the password is:",
					`${PASSWORD}             `,
				], game => {
					game.gotoScene("tavern-entrance");
				});
			} else {
				currentScene.startTalk(game, "stranger", "Hey, it's you again.", game => {
					currentScene.startDiscussion(game);
				});
			}
		},
		startDiscussion: game => {
			const { currentScene } = game;
			game.startDialog({
				time: game.now,
				index: 0,
				conversation: [
					{
						options: [
							{
								msg: "Who are you?",
								onSelect: game => {
									if (game.situation.introduced) {
										currentScene.startTalk(game, "stranger", "I'm just a regular at the tavern.");
									} else {
										game.situation.introduced = game.now;
										currentScene.startTalk(game, "human", "Who are you? Are you a member of the tavern?", game => {
											currentScene.startTalk(game, "stranger", [
												"Yeah... you can say I'm a regular at the tavern.",
											], game => {
												currentScene.startTalk(game, "human", "How often do you come here?", game => {
													currentScene.startTalk(game, "stranger", "I pratically live here.");
												});
											});
										});
									}
								},
							},
							{
								msg: "How to get in?",
								onSelect: game => {
									currentScene.startTalk(game, "human", "How can I get into the tavern?", game => {
										currentScene.startTalk(game, "stranger", [
											"The tavern is reserved for members.",
											"We all know the\npassword to get in.",
											"But it's a secret. Most members never share it.",
										], game => {
											game.dialog.index++;
										});
									});
								},
							},
							{
								msg: "LEAVE", onSelect: game => {
									game.dialog = null;
									game.gotoScene("tavern-entrance");
								}
							},
						],
					},
					{
						options: [
							{
								msg: "How about you?",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"How about you?",
										"Are you most members?",
									], game => {
										currentScene.startTalk(game, "stranger", [
											"Well it depends...",
											"What business do you have in this tavern?",
										], game => {
											game.dialog.index ++;
										});
									});
								},
							},
							{
								msg: "Give me the pass!",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"Give me the pass, or else!",
									], game => {
										currentScene.startTalk(game, "stranger", [
											"Are you\nthreatening me?",
											"Why don't you just tell me...",
											"What are you looking for in this tavern?",
										], game => {
											game.dialog.index ++;
										});
									});
								},
							},
							{
								msg: "Please, help me!",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"Please, help me out dude!",
										"I need to get in. It's a matter of life or death.",
									], game => {
										currentScene.startTalk(game, "stranger", [
											"Hum... really?",
											"What's so\nimportant in that tavern?",
										], game => {
											game.dialog.index ++;
										});
									});
								},
							},
						],
					},
					{
						options: [
							{
								msg: "Baby Hitler.",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"I'm looking for someone...",
										"A kid, his name is...",
										"Baby Hitler!"
									], game => {
										currentScene.startTalk(game, "stranger", [
											"Baby...",
											"Hitler...",
											"I might know that name, or might not...",
											"That depends...",
											"What do you want from him?",
										], game => {
											game.dialog.index ++;
										});
									});
								},
							},
							{
								msg: "I can't tell you.",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"It's secret! I can't tell you.",
										"I'm on a secret mission.",
									], game => {
										currentScene.startTalk(game, "stranger", [
											"Well it's ok.",
											"You're not\nsharing, and I'm not sharing."
										], game => {
											game.dialog.index = 0;
										});
									});
								},
							},
							{
								msg: "I need to pee",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"I really need to use the\nrestroom.",
										"My blatter is about to explode!",
									], game => {
										currentScene.startTalk(game, "stranger", [
											"Hum... the tavern isn't open to strangers who need to pee.",
										], game => {
											game.dialog.index = 0;
										});
									});
								},
							},
						],
					},
					{
						options: [
							{
								msg: "He can save me.",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"I need his help.",
										"It's a matter of life and death."
									], game => {
										currentScene.startTalk(game, "stranger", [
											"Who are you to him?",
											"I'm not sure I can trust you.",
										]);
									});
								},
							},
							{
								msg: "Just talk.",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"I mean no harm to him.",
										"Just want to talk.",
									], game => {
										currentScene.startTalk(game, "stranger", [
											"How can I be sure I can trust you?",
										]);
									});
								},
							},
						],
					},
					{
						options: [
							{
								msg: "A playing card?",
								onSelect: game => {
									currentScene.startTalk(game, "human", "A playing card?", game => {
										currentScene.startTalk(game, "stranger", [
											"This is not just any playing card.",
											`It's the one that will help you beat ${GANSTER_NAME}.`,
										])
									});
								},
							},
							{
								msg: "What's that mark?",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"The card is signed with a marker.",
										"Does that mean anything?",
									], game => {
										currentScene.startTalk(game, "stranger", [
											`It means\nsomething to ${GANSTER_NAME.split(" ")[0]}.`,
										]);
									});
								},
							},
							{
								msg: "LEAVE",
								onSelect: game => {
									currentScene.startTalk(game, "human", [
										"Thank you. I'll be on my way.",
									], game => {
										currentScene.startTalk(game, "stranger", [
											"Good luck! You'll need it.",
										], game => {
											currentScene.startTalk(game, "human", [
												"I thought that game didn't involve any luck.",
											], game => {
												currentScene.startTalk(game, "stranger", [
													"I wasn't talking about the game,",
													"but what happens afterwards...",
												], game => {
													game.dialog = null;
													game.gotoScene("tavern-entrance");
												});
											});
										});
									});
								},
							}
						],
					},
				],
			});
		},
		rightHandState: ({ sceneData, now }, state) => {
			sceneData.retractHand = 0;
			sceneData.grabCard = 0;
			sceneData.lookAtPhoto = 0;
			sceneData.returnPhoto = 0;
			if (state) {
				sceneData[state] = now;
			}
		},
		sprites: [
			{
				src: ASSETS.DARK_CLOTH_STRANGER, col: 5, row: 5,
				noHighlight: true,
				index: 20,
				onClick: game => {
					if (!game.dialog) {
						game.gotoScene("tavern-entrance");
					}
				}
			},
			{
				src: ASSETS.DARK_CLOTH_STRANGER, col: 5, row: 5,
				index: ({pendingTip, now}) => pendingTip && pendingTip.progress < 1 && pendingTip.talker === "stranger" ? Math.floor(now / 100) % 4 : Math.floor(now / 300) % 30 === 0 ? 4 : 0,
				onRefresh: game => {
					const { sceneData, now, pendingTip } = game;
					if (sceneData.nextPuff && now > sceneData.nextPuff) {
						if (pendingTip && pendingTip.talker === "stranger" && pendingTip.progress < 1) {
							sceneData.nextPuff = now + 5000;
						} else {
							sceneData.nextPuff = now + 15000;
							sceneData.puffing = now + 500;
						}
					}
				},
				noHighlight: game => game.situation.cigLit,
				onClick: game => {
					if (!game.situation.cigLit) {
						game.showTip("I think he wants me to light up his cig.");
					}
				},
				combine: (item, game, sprite) => {
					const { situation, now, sceneData, currentScene } = game;
					switch(item) {
						case "photo":
							if (situation.cigLit) {
								game.dialog.paused = true;
								currentScene.rightHandState(game, "grabCard");
								game.delayAction(game => {
									game.useItem = null;
								}, 200);
								game.delayAction(game => {
									currentScene.rightHandState(game, "lookAtPhoto");
								}, 1000);
								game.delayAction(game => {
									currentScene.startTalk(game, "stranger", "That photo... is it...", game => {
										currentScene.startTalk(game, "human", [
											"That's right. It's the only photo I have of Baby Hitler.",
											"It was taken fifteen years ago... I've lost my memory every since...",
											"So I don't know how we got\nseparated...",
											"But I want to bring us all back together.",
											"Like a family. Me, Yupa, and Baby Hitler.",
										], game => {
											currentScene.startTalk(game, "stranger", [
												"Family huh?",
											], game => {
												currentScene.rightHandState(game, "returnPhoto");
												game.delayAction(game => {
													currentScene.rightHandState(game, "retractHand");
													currentScene.startTalk(game, "stranger", [
														"Alright, not sure if I can trust you this time,",
														"but I'll take my chances.",
														"To get in, the password is",
														`${PASSWORD}                `,
														"It's the same as the tavern's phone number.",
													], game => {
														currentScene.startTalk(game, "human", [
															"Thanks for your help...",
														],game => {
															currentScene.startTalk(game, "stranger", [
																`You'll have to deal with a man named ${GANSTER_NAME}.`,
																"He's the gang boss. He owns Baby Hitler.",
																"He won't let you take him with you, unless you beat him",
																"at a card game.",
															], game => {
																currentScene.startTalk(game, "human", [
																	"Well then, I'll just have to be lucky.",
																], game => {
																	currentScene.startTalk(game, "stranger", [
																		"That game has nothing to do with luck.",
																	], game => {
																		currentScene.rightHandState(game, "grabCard");
																		currentScene.startTalk(game, "stranger", [
																			"Here, take this with you.",
																		], game => {
																			currentScene.rightHandState(game, "retractHand");
																			game.pickUp({item: "ace of hearts", image: ASSETS.GRAB_PLAYING_CARD,
																				message: "The ace of hearts.\nIt's signed on with a marker.",
																				onPicked: game => {
																					game.dialog.paused = false;
																					game.dialog.index = 4;
																				},
																			});
																		});
																	});
																});
															});
														});
													});
												}, 1000);
											});
										});
									});
								}, 2000)
							} else {
								game.useItem = null;
								game.showTip("I think he wants me to light his cig first.");
							}
							return true;
						case "lighter":
							game.useItem = null;
							if (situation.cigLit) {
								game.showTip("Already lit his cig.");
							} else {
								game.waitCursor = true;
								situation.cigLit = now;
								sceneData.puffing = now + 1000;
								game.delayAction(game => {
									const message = [
										"Thanks.",
									];
									currentScene.startTalk(game, "stranger", message, game => {
										game.waitCursor = false;
										sceneData.nextPuff = now + 15000;
										currentScene.startDiscussion(game);
									});
								}, 3000);
							}
							return true;
						case "coin":
							currentScene.startTalk(game, "stranger", "I'm not asking for charity.");
							return true;
						default:
							break;
					}
				},
			},
			{
				//	hand card
				src: ASSETS.DARK_CLOTH_STRANGER, col: 5, row: 5,
				index: ({ sceneData, now }) => {
					if (sceneData.retractHand) {
						const frame = Math.min(2, Math.floor((now - sceneData.retractHand) / 200));
						if (frame < 2) {
							return 6 - frame;
						}
					}
					if (sceneData.grabCard) {
						return 5 + Math.min(1, Math.floor((now - sceneData.grabCard) / 200));
					}
					if (sceneData.lookAtPhoto) {
						return 6 + Math.min(2, Math.floor((now - sceneData.lookAtPhoto) / 200));
					}
					if (sceneData.returnPhoto) {
						return 8 - Math.min(2, Math.floor((now - sceneData.returnPhoto) / 200));
					}
					return 21;
				},
			},
			{
				//	cigarette
				src: ASSETS.DARK_CLOTH_STRANGER, col: 5, row: 5,
				index: ({ sceneData, now, situation }) => {
					if (sceneData.puffing) {
						const frame = Math.max(0, Math.floor((now - sceneData.puffing) / 200));
						if (frame <= 3) {
							return 16 + frame;
						}
					}
					if (situation.cigLit) {
						return 12 + Math.floor(now / 200) % 4;
					}
					if (sceneData.takeOutCig) {
						return 9 + Math.min(2, Math.floor((now - sceneData.takeOutCig) / 200));
					}
					return 21;
				},
			},
			{
				src: ASSETS.SPEECH_OUT,
				hidden: game => !game.dialog || game.dialog.paused || game.bagOpening || game.useItem || game.pendingTip,
				index: game => Math.min(3, Math.floor((game.now - game.sceneTime) / 50)),
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);