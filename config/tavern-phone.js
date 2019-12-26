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
			if (!game.situation.alreadySeen) {
				game.situation.alreadySeen = game.now;
				game.situation.droppedCoins = 1;
			}
			game.sceneData.canCall = game.situation.yupaPhone;
			game.playTheme(SOUNDS.TURTLE_SONG_THEME, {volume: .2});
		},
		onDial: (game, sprite) => {
			const digit = (sprite.index - 12) % 10;
			game.sceneData.digitDown[digit] = game.now;
			if (game.sceneData.canCall) {
				if (game.sceneData.numberDialed.length < 7) {
					game.sceneData.numberDialed += digit;
					if (game.sceneData.pickup || game.situation.yupaPhone) {
						game.setTone(5, digit);
	//					game.playSound(SOUNDS.BEEP);
					}

					const PASSWORD = "7078008";

					if (game.sceneData.numberDialed.length === 7) {
						game.waitCursor = true;
						game.delayAction(game => {
							if (game.sceneData.numberDialed === PASSWORD) {
								game.setTone(4);
								game.delayAction(game => {
									game.setTone(0);
									game.playSound(SOUNDS.HIT);
									game.sceneData.phoneSplit = game.now;
									game.sceneData.talker = "bartender";
									game.delayAction(game => {
										game.currentScene.startTalk(game, "phone", [
											"Hello",
											"This is Westrow's tavern.",
											"How can I assist you?",
										], game => {
											game.waitCursor = false;

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
																			game.dialog = null;
																		});
																	});
																}
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
																		game.dialog = null;
																	});
																}
															},
															{
																msg: "Dick Ruber",
																onSelect: (game, dialog) => {
																	game.currentScene.startTalk(game, "human", [
																		"Is Dick Ruber here?",
																		"I'd like to talk to him.",
																	], game => {
																		game.currentScene.startTalk(game, "phone", [
																			"Oh yes, he's here.",
																			"Give me a second.",
																		], game => {
																			console.log("Get dick ruber");
																		});
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
			} else if (talker === "yupa") {
				x = 6;
				y = 40;
				game.playSound(SOUNDS.YUPA);				
			} else if (talker === "phone") {
				x = 2;
				y = 45;
				game.playSound(SOUNDS.HELLO_HUMAN, {volume: .5});
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock });
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
					game.gotoScene("explore-tavern");
				},
			},
			{	//	yupa
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: 26,
				onClick: game => {
					if (game.sceneData.pickup && !game.situation.yupaPhone) {
						game.sceneData.putBack = game.now;
						game.situation.yupaPhone = game.now;
						game.currentScene.startTalk(game, "yupa", [
							"Halo?",
							"Whoz on a fone?",
						], game => {
							if (game.situation.callingDick) {
								if (game.situation.explainedToYupa) {
									game.currentScene.startTalk(game, "human", [
										"You're ready to keep that guy busy on the phone?",
									], game => {
										game.currentScene.startTalk(game, "yupa", [
											"Shure! I gat latza thingz to talkabowt.",
										]);										
									});
								} else {
									game.situation.explainedToYupa = true;
									game.currentScene.startTalk(game, "human", [
										"Listen Yupa,",
										"One of Dick Ruber's bodyguard is on the other line.",
										"I'm gonna need you to keep him on the phone as long as possible.",
										"Just make up a conversation,",
										"you can talk about your life in the parallel universe..."
									], game => {
										game.currentScene.startTalk(game, "yupa", [
											"Oh dat's rite!",
											"Itz a prutty awesume story!",
										]);
									});
								}
							}
						});
					} else if (game.situation.yupaPhone) {
						game.currentScene.startTalk(game, "yupa", [
							`Ma frend ~${game.data.name||"Hitman"}~ wanna talk to yu.`,
						], game => {
							game.sceneData.pickup = game.now - 1000;
							game.sceneData.putBack = 0;
							game.situation.yupaPhone = 0;
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
					if (game.sceneData.pickup) {
						game.sceneData.pickup = 0;
						game.sceneData.putBack = game.now;
						game.situation.yupaPhone = 0;
						game.delayAction(game => {
							game.playSound(SOUNDS.HIT, {volume: .5});
							game.setTone(0);
							game.stopSound(SOUNDS.INVALID_NUMBER);

							game.delayAction(game => {
								game.playSound(SOUNDS.DUD, {volume: .5});
								game.situation.droppedCoins = (game.situation.droppedCoins||0) + 1;
							}, 100);
						}, 200);
					}
				},
			},
			{	//	handle
				src: ASSETS.INSIDE_TAVERN_PHONE, col: 5, row: 6,
				index: ({now, sceneData, situation}) => {
					if (situation.yupaPhone) {
						return 23;
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
						game.situation.callingDick = 0;
						game.delayAction(game => {
							game.playSound(SOUNDS.HIT, {volume: .5});
							game.delayAction(game => {
								game.setTone(1);
							}, 800);
						}, 400);
					}
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
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);
