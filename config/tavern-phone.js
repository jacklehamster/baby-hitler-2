game.addScene(
	{
		name: "tavern-phone",
		arrowGrid: [
			[null, null,  MENU,  null, null ],
			[],
			[ null, null, null,  null, null ],
			[ null, null, null,  null, null ],
			[ null, null, BAG,  null, null ],
		],
		onScene: game => {
			game.sceneData.digitDown = [];
			game.sceneData.numberDialed = "";
			if (!game.situation.coin) {
				game.situation.coin = 0;
			}
			game.sceneData.canCall = game.situation.yupaPhone;
			game.playTheme(SOUNDS.TURTLE_SONG_THEME, {volume: .2});
			if (game.situation.yupaAndBrutus) {
				game.sceneData.phoneSplit = game.now - 1000;
				game.sceneData.pickup = game.now - 1000;
				game.sceneData.yupaPhone = game.now;
				game.sceneData.talker = "brutus";
				game.currentScene.startTalk(game, "yupa", [
					"So dats how I save da day! ...",
					"Oh, my frend iz here",
					"He wantz to tolk"
				], game => {
					game.sceneData.pickup = game.now - 1000;
					game.sceneData.putBack = 0;
					game.situation.yupaPhone = 0;
					game.sceneData.yupaReturnPhone = game.now;
					game.currentScene.brutusOnPhone(game);					
				});
			}
		},
		brutusOnPhone: game => {
			game.sceneData.pickup = game.now - 1000;
			if (!game.sceneData.phoneSplit || game.sceneData.phoneOut) {
				game.sceneData.phoneSplit = game.now;
				game.sceneData.phoneOut = 0;
			}
			game.sceneData.talker = "brutus";
			game.currentScene.startTalk(game, "phone", [
				!game.situation.startedTalking ? "Mr. Ruber is busy." : "Yes?",
			], game => {
				game.situation.startedTalking = game.now;
				game.startDialog({
					conversation: [
						{
							options: [
								{
									msg: "Who are you?",
									onSelect: (game, dialog) => {
										game.currentScene.startTalk(game, "human", "Who is it on the phone?", game => {
											game.currentScene.startTalk(game, "phone", "I'm Brutus");
										});
									},
								},
								{
									msg: "Please hold",
									onSelect: (game, dialog) => {
										game.currentScene.startTalk(game, "human", [
											"Can you please hold?",
										], game => {
											game.dialog = null;
										});
									},								
								},
								{
									msg: "Bye",
									onSelect: (game, dialog) => {
										game.currentScene.startTalk(game, "human", [
											"Bye for now.",
										], game => {
											game.playSound(SOUNDS.HIT);
											game.sceneData.phoneOut = game.now;
											game.sceneData.phoneSplit = 0;
											game.situation.yupaPhone = 0;
											game.sceneData.yupaReturnPhone = 0;
											game.sceneData.numberDialed = "";
											game.situation.yupaAndBrutus = 0;

											game.dialog = null;
										});
									},
								},
							],
						},
					],
				})
			});
		},
		onDial: (game, sprite) => {
			const digit = (sprite.index - 12) % 10;
			game.sceneData.digitDown[digit] = game.now;
			if (game.sceneData.canCall) {
				if (game.sceneData.numberDialed.length < 7) {
					game.sceneData.numberDialed += digit;
					if (game.sceneData.pickup || game.situation.yupaPhone) {
						game.setTone(5, digit);
					}

					const PASSWORD = "7078008";

					if (game.sceneData.numberDialed.length === 7) {
						game.waitCursor = true;
						game.delayAction(game => {
							if (game.sceneData.numberDialed === PASSWORD) {
								game.sceneData.canCall = 0;
								game.setTone(4);
								game.delayAction(game => {
									game.setTone(0);
									game.playSound(SOUNDS.HIT);
									game.sceneData.phoneSplit = game.now;
									game.sceneData.phoneOut = 0;
									game.sceneData.talker = "bartender";
									game.delayAction(game => {
										game.currentScene.startTalk(game, "phone", [
											"Hello",
											"This is Westrow's tavern.",
											"How can I assist you?",
										], game => {
											game.waitCursor = false;
											if (game.situation.yupaPhone) {
												game.currentScene.startTalk(game, "yupa", [
													`Ma frend ~${game.data.name||"Hitman"}~ wanna talk to yu.`,
												], game => {
													game.sceneData.pickup = game.now - 1000;
													game.sceneData.putBack = 0;
													game.situation.yupaPhone = 0;
													game.sceneData.yupaReturnPhone = game.now;
												});
											}

											game.startDialog({
												conversation: [
													{
														options: [
															{
																msg: "Order pizza",
																onSelect: (game, dialog) => {
																	game.currentScene.startTalk(game, "human", [
																		"Hey so... I'd like to order a pizza.",
																	], game => {
																		game.currentScene.startTalk(game, "phone", [
																			"Sorry, we don't deliver...",
																			"and we also don't make pizza!"
																		], game => {
																			game.playSound(SOUNDS.HIT);
																			game.sceneData.phoneOut = game.now;
																			game.sceneData.phoneSplit = 0;
																			game.situation.yupaPhone = 0;
																			game.sceneData.yupaReturnPhone = 0;
																			game.sceneData.numberDialed = "";

																			game.dialog = null;
																		});
																	});
																}
															},
															{
																msg: "Dick Ruber",
																onSelect: (game, dialog) => {
																	game.currentScene.startTalk(game, "human", [
																		"Is Dick Ruber around?",
																		"I'd like to talk to him.",
																	], game => {
																		game.currentScene.startTalk(game, "phone", [
																			"Oh yes, he's here.",
																			"Give me a second.",
																		], game => {
																			game.getSituation("explore-tavern").confirmDick = game.now;
																			game.gotoScene("call-gangsta");
																		});
																	});
																},
															},
															{
																msg: "Wrong number",
																onSelect: (game, dialog) => {
																	game.currentScene.startTalk(game, "human", [
																		"Sorry I dialed the wrong\nnumber.",
																	], game => {
																		game.playSound(SOUNDS.HIT);
																		game.sceneData.phoneOut = game.now;
																		game.sceneData.phoneSplit = 0;
																		game.situation.yupaPhone = 0;
																		game.sceneData.yupaReturnPhone = 0;
																		game.sceneData.numberDialed = "";

																		game.dialog = null;
																	});
																},
															},
														],
													},
												],
											});

										});
									}, 500);
								}, 5000);
							} else {
								game.waitCursor = false;
								game.playSound(SOUNDS.INVALID_NUMBER, {volume: .2, loop: true});
								game.showTip("Wrong number...", null, null, {removeLock: true});
							}
						}, 600);
					}
				}
			}
			console.log(game.sceneData.numberDialed);
		},		
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y;
			if (talker === "human") {
				x = 2;
				y = 55;
				game.playSound(SOUNDS.HUM);
			} else if (talker === "human2") {
				x = 2;
				y = 35;
				game.playSound(SOUNDS.HUM);
			} else if (talker === "yupa") {
				x = 5;
				y = 40;
				game.playSound(SOUNDS.YUPA);				
			} else if (talker === "phone") {
				x = 2;
				y = 45;
				game.playSound(game.sceneData.talker === "brutus" ? SOUNDS.YES_BOSS : SOUNDS.HELLO_HUMAN, {volume: .5});
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
		},
		putBackPhone: game => {
			if (game.sceneData.pickup) {
				game.sceneData.pickup = 0;
				game.sceneData.putBack = game.now;
				game.situation.yupaPhone = 0;
				game.sceneData.yupaReturnPhone = 0;
				game.sceneData.numberDialed = "";
				game.delayAction(game => {
					game.playSound(SOUNDS.HIT, {volume: .5});
					game.setTone(0);
					game.stopSound(SOUNDS.INVALID_NUMBER);
					if (game.sceneData.phoneSplit) {
						game.sceneData.phoneOut = game.now;
						game.sceneData.phoneSplit = 0;
						game.situation.yupaAndBrutus = 0;
					}
					if (game.sceneData.canCall) {
						game.delayAction(game => {
							game.playSound(SOUNDS.DUD, {volume: .5});
							game.situation.droppedCoins = (game.situation.droppedCoins||0) + 1;
						}, 100);
					}
					game.sceneData.canCall = false;
				}, 200);
			}
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#00000088";
					ctx.fillRect(48, 0, 16, 64);
				},
				noHighlight: true,
				onClick: game => {
					game.stopSound(SOUNDS.INVALID_NUMBER);
					if (game.sceneData.pickup) {
						game.currentScene.putBackPhone(game);						
					} else {
						game.gotoScene("explore-tavern");
					}
				},
			},
			{	//	yupa
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: 26,
				onClick: game => {
					if (game.dialog) {
						return;
					}
					if (game.sceneData.pickup && !game.situation.yupaPhone) {
						if (game.sceneData.talker === "brutus" && game.sceneData.phoneSplit) {
							if (game.situation.explainedToYupa) {
								game.currentScene.startTalk(game, "human2", [
									"You're ready to keep that guy busy on the phone?",
								], game => {
									game.currentScene.startTalk(game, "yupa", [
										"Shure! I gat latza thingz to talkabowt.",
									], game => {
										game.situation.yupaPhone = game.now;
										game.currentScene.startTalk(game, "yupa", [
											"Halo?",
											"Wanna hear an awesume storey?",
										], game => {
											game.situation.yupaAndBrutus = game.now;
											game.gotoScene("explore-tavern");
										});
									});										
								});
							} else {
								game.situation.explainedToYupa = true;
								game.currentScene.startTalk(game, "human2", [
									"Listen Yupa,",
									"One of Dick Ruber's\nbodyguard is on the other line.",
									"I'm gonna need you to keep him on the phone as long as possible.",
									"Just make up a conversation,",
									"you can talk about your life in the parallel universe..."
								], game => {
									game.currentScene.startTalk(game, "yupa", [
										"Oh dat's rite!",
										"Itz a prutty awesume story!",
									], game => {
										game.situation.yupaPhone = game.now;
										game.currentScene.startTalk(game, "yupa", [
											"Halo?",
											"Wanna hear an awesume storey?",
										], game => {
											game.situation.yupaAndBrutus = game.now;
											game.gotoScene("explore-tavern");
										});
									});
								});
							}
						} else {
							game.situation.yupaPhone = game.now;
							game.currentScene.startTalk(game, "yupa", [
								"Halo?",
								"Whoz on da fone?",
							]);
						}
					} else if (game.situation.yupaPhone) {
						game.currentScene.startTalk(game, "yupa", [
							`Ma frend ~${game.data.name||"Hitman"}~ wanna talk to yu.`,
						], game => {
							game.sceneData.pickup = game.now - 1000;
							game.sceneData.putBack = 0;
							game.situation.yupaPhone = 0;
							game.sceneData.yupaReturnPhone = game.now;
							game.situation.yupaAndBrutus = 0;
						});
					} else {
						game.currentScene.startTalk(game, "yupa", [
							"Who ya ganna call?",
						]);
					}
				},
			},
			{
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
			},
			{	//	yupa mouth
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: ({now}) => Math.floor(now / 50) % 3 + 1,
				hidden: ({pendingTip}) => !pendingTip || pendingTip.progress >= 1 || pendingTip.talker !== "yupa",
			},
			{	//	sign
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: 24,
				tip: "“- Lift handle.\n- Wait for the tone.\n- Insert coin.\n- Dial number.”",
			},
			{
				custom: ({sceneData}, sprite, ctx) => {
					ctx.fillStyle = "#002222";
					ctx.fillRect(28, 10, 3, 3);
					const PASSWORD = "7078008";
					ctx.fillStyle = game.sceneData.numberDialed === PASSWORD ? "#00FF77"
						: game.sceneData.numberDialed.length === 7 ? "#cc4400"
						: sceneData.canCall ? "#0088aa"
						: "#000000";
					ctx.fillRect(28, 10, 2, 2);
				},
			},
			{	//	coin
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: ({now, sceneData}) => {
					if (sceneData.insertCoin) {
						const frame = 4 + Math.floor((now - sceneData.insertCoin) / 100);
						return frame > 8 ? 4 : frame;
					}
					return 4;
				},
				combine: (item, game) => {
					if (item === "coin") {
						game.useItem = null;
						game.delayAction(game => {
							game.playSound(SOUNDS.DUD);
							if (!game.sceneData.pickup && !game.situation.yupaPhone) {
								game.delayAction(game => {
									game.playSound(SOUNDS.DUD);
									game.situation.droppedCoins = (game.situation.droppedCoins||0) + 1;
								}, 300);
							} else {
								game.sceneData.canCall = true;
								game.setTone(2);
							}
						}, 500);
						game.sceneData.insertCoin = game.now;
						game.situation.coin = (game.situation.coin||0) + 1;
						game.removeFromInventory("coin");
						return true;
					}
				},
				tip: "“Insert 1 coin”",
			},
			... new Array(10).fill(null).map((a, idx) => {
				return {	//	digit
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
					index: 12 + (1 + idx),
					onClick: (game, sprite) => game.currentScene.onDial(game, sprite),
					offsetX: ({now, sceneData}, {index}) => now - sceneData.digitDown[(index - 12)%10] < 100 ? -1 : 0,
					offsetY: ({now, sceneData}, {index}) => now - sceneData.digitDown[(index - 12)%10] < 100 ? 1 : 0,
				};
			}),
			{	//	hole
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: 25,
				onClick: game => {
					game.currentScene.putBackPhone(game);
				},
			},
			{
				//	coins
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: 28,
				hidden: game => !game.situation.droppedCoins,
				onClick: game => {
					game.pickUp({item:"coin", count: game.situation.droppedCoins, image:ASSETS.GRAB_COIN, message:""});
					game.situation.droppedCoins = 0;
				},
			},
			{	//	handle
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: ({now, sceneData, situation}) => {
					if (situation.yupaPhone) {
						return 23;
					}
					if (sceneData.yupaReturnPhone && game.now - sceneData.yupaReturnPhone < 150) {
						return 29;
					}
					if (sceneData.putBack) {
						const frame = Math.max(9, 12 - Math.floor((now - sceneData.putBack) / 150));
						return frame;
					}
					if (sceneData.pickup) {
						const frame = 9 + Math.floor((now - sceneData.pickup) / 150);
						return frame > 12 ? -1 : frame;
					}
					return 9;
				},
				onClick: game => {
					if (!game.sceneData.pickup) {
						game.sceneData.numberDialed = "";
						game.sceneData.pickup = game.now;
						game.sceneData.putBack = 0;
						game.situation.yupaPhone = 0;
						game.sceneData.yupaReturnPhone = 0;
						game.situation.callingDick = 0;
						game.delayAction(game => {
							game.playSound(SOUNDS.HIT, {volume: .5});
							game.delayAction(game => {
								game.setTone(1);
							}, 500);
						}, 400);
					}
				},
			},
			{	//	split
				src: ASSETS.PHONE_SPLIT, col: 3, row: 3,
				offsetX: game => {
					if (game.sceneData.phoneOut) {
						return Math.max(-32, - Math.round((game.now - game.sceneData.phoneOut) / 10));
					}
					return Math.min(0, -32 + Math.round((game.now - game.sceneData.phoneSplit) / 10));
				},
				offsetY: game => {
					if (game.sceneData.phoneOut) {
						return Math.max(-32, - Math.round((game.now - game.sceneData.phoneOut) / 10));
					}
					return Math.min(0, -32 + Math.round((game.now - game.sceneData.phoneSplit) / 10));
				},
				hidden: game => !game.sceneData.phoneSplit && !game.sceneData.phoneOut,
				index: ({sceneData, pendingTip, now}) => {
					if (sceneData.talker === "bartender") {
						return pendingTip && pendingTip.talker === "phone" && pendingTip.progress < 1 
								? Math.floor(now / 100) % 4
								: 0;
					} else {
						return pendingTip && pendingTip.talker === "phone" && pendingTip.progress < 1 
								? 4 + Math.floor(now / 100) % 4
								: 4;
					}
				},
				noHighlight: game => game.dialog,
				onClick: game => {
					if (!game.dialog && game.sceneData.talker === "brutus") {
						game.currentScene.brutusOnPhone(game);
					}
				},
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);
