game.addScene(
	{
		name: "not-so-fast",
		onScene: game => {
			game.sceneData.credits = `
				You did it!
				You found
				Baby Hitler!

				What a champ! What a champ!

				Baby Hitler stayed with you and Yupa.

				All of you travelled to space,

				in the direction of

				EARTH

				and the rest... is history!

				So to speak.




				${game.title||" Where in Space is\n  BABY HITLER?"}

				A game from
				DOBUKI STUDIO
				by
				Jack Le Hamster

				Coded in JavaScript
				with Sublime Text

				Art made with Piskel

				Music made with BeepBox

				Sound effects made with VoiceChanger.io and Brfx

				Music covers:
				“La Soupe aux Choux”
				(Raymond Lefèvre)

				This game is a sequel to “Kill Baby Hitler”. The first part of this game was released for
				#LOWREZJAM\n2019\nas “Escape from Labbyrithe”.

				You have finished the game with
				HITLER ENDING

				That's right, this is indeed...

				The REAL ENDING.

				Although this is not really the end.

				The story is to be continued, with the sequel:

				FICKEN BABY HITLER

				Congratulation, du bist der beste!

				Have a nice day!
			`.split("\n").map((a, index) => index > 2 ? game.wordwrap(a.trim(), 9) : a).join("\n").split("\n");



			game.delayAction(game => {
				game.playTheme(SOUNDS.FUTURE_SONG_THEME, {volume: .8});

				game.currentScene.startTalk(game, "boy", [
					"Not so fast.",
				], game => {
					game.sceneData.turning = game.now;
					game.delayAction(game => {
						game.sceneData.showBoy = game.now;
						game.currentScene.startTalk(game, "boy", [
							"YOU, DROP\nyour weapon\nSLOWly.",
							"I SAW what you can do with that.",
							"If you try\nANYthing funny, I'll SHOOT you right in the eye.",
						], game => {
							game.sceneData.facing = game.now;
							game.sceneData.showBoy = 0;
							game.delayAction(game => {
								game.sceneData.humanToYupa = game.now;
								game.sceneData.yupaToHuman = game.now;
							}, 500);
							game.delayAction(game => {
								game.sceneData.showBoy = game.now;
								game.currentScene.startTalk(game, "boy", [
									"Hey BALDIE!\nIt's YOU I'm talking to.",
								], game => {
									game.sceneData.humanToYupa = 0;
									game.sceneData.yupaToHuman = 0;
									game.sceneData.showBoy = 0;
									game.sceneData.hitmanDropGun = game.now;
									game.currentScene.startTalk(game, "human", [
										"Calm down, kid!",
										"I ain't gonna to hurt you.",
									], game => {
										const FAV_DRINK = game.data.love === "cidah"
											? "a crate\nof sparklin\ncidah"
											: game.data.love === "beer"
											? "a pack\no beer"
											: "a crate\nof ramune";

										const DRINK_QUESTION = game.data.love === "cidah"
											? "the sparkling cidah?"
											: game.data.love === "beer"
											? "the beer?"
											: "the ramune?";

										game.startDialog({
											conversation: [
												{
													options: [
														{
															msg: "You're angry.",
															onSelect: game => {
																game.currentScene.startTalk(game, "human", [
																	"I know you're angry.",
																	"But calm down, I can explain.",
																], game => {
																	game.currentScene.startTalk(game, "boy", [
																		"BULLSHIT!",
																	], game => {
																		game.dialog.index++;
																	});
																});
															},
														},
														{
															msg: "It's not a toy",
															onSelect: game => {
																game.currentScene.startTalk(game, "human", [
																	"It's not a toy you're holding, kid.",
																	"Don't play with that, it's\ndangerous.",
																], game => {
																	game.sceneData.showBoy = game.now;
																	game.currentScene.startTalk(game, "boy", [
																		"I know\nPERFECTLY\nhow to use a gun, ASShole!",
																		"Now someone tells me what's going on!",
																	], game => {
																		game.sceneData.showBoy = 0;
																		game.dialog.index++;
																	});
																});
															},
														},
														{
															msg: "Do it! Shoot!",
															onSelect: game => {
																game.currentScene.startTalk(game, "human", [
																	"Do it! Shoot me!",
																	"You don't have the balls to kill me,",
																	"Baby Hitler."
																], game => {
																	game.sceneData.showBoy = game.now;
																	game.currentScene.startTalk(game, "boy", [
																		"Don't SCREW with me, I'll SHOOT you for real!",
																		"You don't have ANY IDEA, what I'm capable of.",
																	], game => {
																		game.sceneData.showBoy = 0;
																		game.currentScene.startTalk(game, "human", [
																			"Oh, yes I do."
																		], game => {
																			game.dialog.index++;
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
															msg: "I know you.",
															onSelect: game => {
																game.currentScene.startTalk(game, "human", [
																	"I know who you are, Baby Hitler.",
																	"Deep inside, you have this anger, this desire for hurting people.",
																	"But we can fix it, Baby Hitler.",
																	"We can work together to change you.",
																], game => {
																	game.sceneData.showBoy = game.now;
																	game.currentScene.startTalk(game, "boy", [
																		"You don't know shit!",
																		"And stop calling me that!",
																	], game => {
																		game.sceneData.showBoy = 0;
																	});
																});
															},
														},
														{
															msg: "I'm sorry.",
															onSelect: game => {
																game.sceneData.humanSurprised = game.now;
																game.currentScene.startTalk(game, "human", [
																	"Baby Hitler,",
																	"I'm sorry we left you alone on this planet.",
																	"Recently, I got amnesia, so I don't\nremember how or why we did that.",
																], game => {
																	game.sceneData.yupaToHuman = game.now;
																	game.delayAction(game => {
																		game.sceneData.humanToYupa = game.now;
																	}, 500);
																	game.currentScene.startTalk(game, "yupa", [
																		"Actualy, I\nknow wad\nhappent. I\nwaz dhere!",
																		`You traded\nBaby Hitler\nfo ${FAV_DRINK}.`,																		
																	], game => {
																		game.sceneData.humanToYupa = game.now;
																		game.sceneData.humanAngry = game.now;
																		game.currentScene.startTalk(game, "human", [
																			"Wait, what\nthe hell are you saying?",
																			"Did I\nREALLY\ndo that?",
																		], game => {
																			game.sceneData.yupaToHuman = game.now;
																			game.currentScene.startTalk(game, "yupa", [
																				"Yeah, yu\nware realy\ndronk.",
																				"Nex day,\nyu change\nya mind,",
																				"So wi\ntry get\nBaby Hitla\nbak, but\ndat didn\nturn out\nwel.",
																				"Dat's how\nwe got\narested.",
																			], game => {
																				game.sceneData.humanSurprised = game.now;
																				game.sceneData.humanAngry = 0;
																				game.sceneData.humanToYupa = 0;
																				game.sceneData.yupaToHuman = 0;
																				game.currentScene.startTalk(game, "human", [
																					"Ah you see? we never meant to leave you.",
																					"I was drunk and I made a stupid mistake,",
																					"but then I tried to correct it.",
																					"Can you forgive me, Baby Hitler?",
																				], game => {
																					game.sceneData.showBoy = game.now;
																					game.currentScene.startTalk(game, "boy", [
																						"Wow, what a terrific story.",
																						"I'm so glad you told me what happened and all...",
																						"but there is still one little detail that doesn't fit...",
																					], game => {
																						game.sceneData.showBoy = 0;
																						game.dialog.index++;
																					});
																				});
																			});
																		});
																	});
																});
															},
														},
														{
															msg: "Let me explain.",
															onSelect: game => {
																game.delayAction(game => game.sceneData.humanSurprised = game.now, 5000);
																game.delayAction(game => game.sceneData.humanSurprised = 0, 20000);
																game.delayAction
																game.currentScene.startTalk(game, "human", [
																	"Let me explain what happened, Baby Hitler.",
																	"You see, I don't remember why we left you here alone.",
																	"Recently, I lost my memory and woke up in a prison on a foreign planet.",
																	"And I have no idea how I got there.",
																	"So I don't know what happened back then...",
																], game => {
																	game.sceneData.yupaToHuman = game.now;
																	game.delayAction(game => {
																		game.sceneData.humanToYupa = game.now;
																	}, 500);

																	game.currentScene.startTalk(game, "yupa", [
																		"Actualy, I\nknow wad\nhappent. I\nwaz dhere!",
																		`You traded\nBaby Hitler\nfo ${FAV_DRINK}.`,																		
																	], game => {
																		game.sceneData.humanToYupa = game.now;
																		game.sceneData.humanAngry = game.now;
																		game.currentScene.startTalk(game, "human", [
																			"Wait, what\nthe hell are you saying?",
																			"Did I\nREALLY\ndo that?",
																		], game => {
																			game.sceneData.yupaToHuman = game.now;
																			game.currentScene.startTalk(game, "yupa", [
																				"Yeah, yu\nware realy\ndronk.",
																				"Nex day,\nyu change\nya mind,",
																				"So wi\ntry get\nBaby Hitla\nbak, but\ndat didn\nturn out\nwel.",
																				"Dat's how\nwe got\narested.",
																			], game => {
																				game.sceneData.humanSurprised = game.now;
																				game.sceneData.humanAngry = 0;
																				game.sceneData.humanToYupa = 0;
																				game.sceneData.yupaToHuman = 0;
																				game.currentScene.startTalk(game, "human", [
																					"Ah you see? So we didn't want to leave you alone after all.",
																					"It was not really my fault, I just got drunk,",
																					"and then I tried to get you back.",
																					"I deserve a second chance, right Baby Hitler?",
																				], game => {
																					game.sceneData.showBoy = game.now;
																					game.currentScene.startTalk(game, "boy", [
																						"Wow, what a terrific story.",
																						"I'm so glad you told me all that, it makes perfect sense...",
																						"but there is still one little detail that does not fit...",
																					], game => {
																						game.sceneData.showBoy = 0;
																						game.dialog.index++;
																					});
																				});
																			});
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
															msg: "the jail?",
															onSelect: game => {
																game.currentScene.startTalk(game, "human", [
																	"What? The jail?",
																], game => {
																	game.currentScene.bigReveal(game);
																});
															},
														},
														{
															msg: "the amnesia?",
															onSelect: game => {
																game.currentScene.startTalk(game, "human", [
																	"What? The\namnesia?",
																], game => {
																	game.currentScene.bigReveal(game);
																});
															},
														},
														{
															msg: DRINK_QUESTION,
															onSelect: game => {
																game.currentScene.startTalk(game, "human", [
																	"What?\n" + DRINK_QUESTION,
																], game => {
																	game.currentScene.bigReveal(game);
																});
															},
														},
													],
												},
												{
													options: [
														{},
														{
															msg: "you're not?",
															onSelect: game => {
																game.currentScene.startTalk(game, "human", [
																	"You're not Baby Hitler?",
																], game => {
																	game.sceneData.showBoy = game.now;
																	game.currentScene.startTalk(game, "boy", [
																		"I'm not, you moron!",
																		"I never met you in my life!",
																		"I was born here, my parents died ages ago.",
																	], game => {
																		game.currentScene.confusedHitman(game);
																	});
																});
															},
														},
														{
															msg: "I know.",
															onSelect: game => {
																game.sceneData.humanSurprised = 0;
																game.currentScene.startTalk(game, "human", [
																	"I know you're not.",
																	"You're not a baby anymore,",
																	"but it's just an term of\nendearment, or a nickname.",
																	"We can call you Teen Hitler if you want,",
																	"or Mr. Hitler, or the Fuhrer!",
																], game => {
																	game.sceneData.showBoy = game.now;
																	game.currentScene.startTalk(game, "boy", [
																		"Hey retard!",
																		"I am NOT\nHITLER!",
																		"I was born here, my parents died ages ago.\nThat's when Dick Ruber took me in.",
																		"Did I make\nmyself clear, Baldie?",
																	], game => {
																		game.currentScene.confusedHitman(game);
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
							}, 3000);
						});
					}, 1000);
				});
			}, 4000);
		},
		onSceneRefresh: game => {
			const shift = - (game.now - game.sceneData.creditStart) / 200 + 50;
			if (game.sceneData.credits.length * 6 + shift < -25) {
				if (!game.sceneData.showGameOver) {
					game.sceneData.showGameOver = game.now;
					game.gameOver(" ", true, true);
				}
			}
		},
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y, maxLines = null;
			if (talker === "yupa") {
				x = 24;
				y = 36;
				game.playSound(SOUNDS.YUPA);
				maxLines = 5;
			} else if (talker === "human") {
				x = 2;
				y = 61;
				game.playSound(SOUNDS.HUM);				
			} else if (talker === "boy") {
				x = 7;
				y = 64;
				game.playSound(SOUNDS.HUM_KID);
			} else if (talker === "stranger") {
				x = 2;
				y = 60;
				game.playSound(SOUNDS.HUM_KID);
			} else if (talker === "both") {
				x = 2;
				y = 63;
				game.playSound(SOUNDS.HUM);				
				game.playSound(SOUNDS.YUPA);				
			}
			game.showTip(msg, onDone, speed || 80, { x, y, talker, removeLock, maxLines });
		},
		bigReveal: game => {
			game.sceneData.showBoy = game.now;
			game.currentScene.startTalk(game, "boy", [
				"No you dumfuck!",
			], game => {
				game.sceneData.zoomBoy = game.now;
				game.currentScene.startTalk(game, "boy", [
					"I am NOT",
					"FUCKING",
					"BABY HITLER!",
				], game => {
					game.sceneData.zoomBoy = 0;
					game.sceneData.showBoy = 0;
					game.dialog.index++;
				});
			});
		},
		confusedHitman: game => {
			game.dialog = null;
			game.sceneData.showBoy = 0;
			game.sceneData.humanSurprised = 0;
			game.delayAction(game => {
				game.sceneData.humanToYupa = game.now;
				game.sceneData.hitmanShrug = game.now;
				game.delayAction(game => {
					game.sceneData.yupaToHuman = game.now;
				}, 500);
				game.currentScene.startTalk(game, "human", [
					"Yupa, he\nbelieves\nhe's not\nBaby Hitler",
				], game => {
					game.currentScene.startTalk(game, "yupa", [
						"I think he\ntallin da\ntrutt",
					], game => {
						game.sceneData.humanAngry = game.now;
						game.sceneData.hitmanShrug = 0;
						game.currentScene.startTalk(game, "human", [
							"WhAT?!",
						], game => {
							game.currentScene.startTalk(game, "yupa", [
								"Befare,\nin tavern",
								"From\nfarway\nhe realy\nluk like\nBaby Hitlah.",
								"I waz\n79% shur.",
							], game => {
								game.currentScene.startTalk(game, "human", [
									"And now?",
								], game => {
									game.sceneData.yupaShrug = game.now;
									game.currentScene.startTalk(game, "yupa", [
										"Naow I am\n0.3% shur.",
										"muybe he\ngat platic\nsugery?",
									], game => {
										game.sceneData.yupaShrug = 0;
										game.sceneData.hitmanShrug = game.now;
										game.currentScene.startTalk(game, "human", [
											"Yupa,\nyou idiot!",
											"Do you\nrealize the\nmistake we\njust made?",
										], game => {
											game.sceneData.yupaShrug = game.now;
											game.sceneData.yupaAngry = game.now;
											game.currentScene.startTalk(game, "yupa", [
												"Hey, gimme\nbrake!",
												"Imma Yupa.\nNot expurt\ntelin\nhuman\nfacez\napart!",
											], game => {
												game.delayAction(game => {
													game.sceneData.yupaToHuman = 0;
													game.sceneData.humanToYupa = 0;
													game.sceneData.humanSurprised = game.now;
												}, 500);
												game.currentScene.startTalk(game, "boy", [
													"SHUT UP YOU TWO!",
												], game => {
													game.sceneData.showBoy = game.now;
													game.currentScene.startTalk(game, "boy", [
														"I'll TELL you how it's gonna be.",
														"FIRST, you\nGIVE me the remote for that\nspaceship of yours.",
														"Then I'm gonna shoot either one or both of you",
														"Depending on my mood",
														"Do I make\nmyself CLEAR?",
													], game => {
														game.dialog = null;
														game.sceneData.knockout = game.now;
														game.delayAction(game => {
															game.playSound(SOUNDS.HIT);
															game.playTheme(null);
															game.currentScene.startTalk(game, "boy", "OUCH!", false, 50);
															game.delayAction(game => {
																game.sceneData.showBoy = 0;
																game.sceneData.hitmanShrug = 0;
																game.sceneData.yupaShrug = 0;
															}, 2000);
															game.delayAction(game => {
																game.sceneData.humanAngry = 0;
																game.sceneData.yupaAngry = 0;
																game.sceneData.yupaToHuman = game.now;
																game.sceneData.humanToYupa = game.now;
															}, 2500);
															game.delayAction(game => {
																game.sceneData.yupaToHuman = 0;
																game.sceneData.humanToYupa = 0;
																game.currentScene.startTalk(game, "human", [
																	"Wow! Thank you stranger.",
																	"I didn't expect you to show up so suddenly out of nowhere and save the day.",
																], game => {
																	game.currentScene.reveal(game);
																});
															}, 3500);
														}, 700);
													});
												});
											});
										});
									});
								})
							});
						});
					});
				});
			}, 1000);
		},
		reveal: game => {
			game.sceneData.showStranger = game.now;
			game.currentScene.startTalk(game, "stranger", [
				"Well, to be honest,",
				"I did not expect you bozos to show up again either...",
			], game => {
				game.sceneData.showStranger = 0;
				game.sceneData.yupaToHuman = game.now;
				game.sceneData.humanToYupa = game.now;
				game.delayAction(game => {
					game.sceneData.yupaToHuman = 0;
					game.sceneData.humanToYupa = 0;
					game.sceneData.humanSurprised = game.now;
					game.currentScene.startTalk(game, "human", [
						"Hold on a sec...",
						"Who are you exactly?",
					], game => {
						game.sceneData.showStranger = game.now;
						game.delayAction(game => {
							game.sceneData.reveal = game.now;
							game.delayAction(game => {
								game.sceneData.showStranger = 0;
								game.sceneData.surprise = game.now;
							}, 4000);
							game.delayAction(game => {
								game.sceneData.yupaToHuman = game.now;
								game.sceneData.humanToYupa = game.now;								
							}, 5000);
							game.delayAction(game => {
								game.sceneData.yupaToHuman = 0;
								game.sceneData.humanToYupa = 0;								
							}, 6000);
							game.delayAction(game => {
								game.currentScene.startTalk(game, "both", [
									"IT'S BABY\nHITLER!",
								], game => {
									game.sceneData.showStranger = game.now;
									game.delayAction(game => {
										game.sceneData.smirk = game.now;
										game.sceneData.showFinalTitle = game.now;
									}, 500);
									game.delayAction(game => {
										game.playTheme(SOUNDS.BEEBOP_THEME, {volume: .7});
										game.delayAction(game => {
											game.sceneData.creditStart = game.now;
											game.hideCursor = true;
										}, 5000);
									}, 1000);
								});
							}, 7000);
						}, 2000);
					});
				}, 1000);
			});
		},
		sprites: [
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
				index: 1,
			},
			{
				src: ASSETS.MOUNTAINS, col: 1, row: 2,
				offsetY: -24,
				alpha: .6,
				index: 0,
			},
			{
				src: ASSETS.CRATER, col: 3, row: 4,
				index: 10,
			},
			{
				src: ASSETS.SPACESHIP, col: 1, row: 2,
				alpha: .5,
				scale: .4,
				offsetX: 25,
				offsetY: 28,
			},		
			{
				src: ASSETS.YUPA_HITMAN_AT_GUNPOINT, col: 5, row: 5,
				side: LEFT,
				index: ({pendingTip, sceneData, now}) => {
					if (sceneData.facing) {
						if (sceneData.humanToYupa) {
							if (sceneData.surprise) {
								return (pendingTip && pendingTip.talker === "both" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 + 11: 12)
							}
							if (sceneData.humanAngry) {
								return 15 + (pendingTip && pendingTip.talker === "human" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0);								
							}
							return 11 + (pendingTip && pendingTip.talker === "human" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0);
						}
						if (sceneData.humanSurprised) {
							if (sceneData.surprise) {
								return (pendingTip && pendingTip.talker === "both" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 + 7: 8)
							}
							return 7 + (pendingTip && pendingTip.talker === "human" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0);
						}
						return 3 + (pendingTip && pendingTip.talker === "human" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0);
					}
					if (sceneData.turning) {
						return Math.min(2, Math.floor((now - sceneData.turning)/100));
					}
					return 0;
				},
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				scale: .8,
				offsetX: ({sceneData}) => sceneData.humanToYupa ? -11 : -12,
				offsetY: game => -2,
				index: ({sceneData, pendingTip, now}) => {
					if (sceneData.surprise) {
						return (pendingTip && pendingTip.talker === "both" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4: 3);
					}					
					return pendingTip && pendingTip.progress < 1 && pendingTip.talker === "human" ? Math.floor(now / 100) % 4 : 0;
				},
				hidden: game => !game.sceneData.facing,
			},			
			{	//	overlay
				src: ASSETS.YUPA_HITMAN_AT_GUNPOINT, col: 5, row: 5,
				side: LEFT,
				index: ({pendingTip, sceneData, now}) => {
					if (sceneData.hitmanShrug) {
						return 20;
					}
					if (sceneData.hitmanDropGun) {
						const frame = Math.floor((now - sceneData.hitmanDropGun) / 150);
						const frames = [-1, 21, 22, 22, 22, 22, 23, 23, 21, -1];
						return frames[Math.min(frames.length - 1, frame)];
					}
					return -1;
				},
				hidden: ({pendingTip, sceneData, now}) => {
					return !sceneData.hitmanShrug && !sceneData.hitmanDropGun;
				},
			},
			{
				src: ASSETS.YUPA_HITMAN_AT_GUNPOINT, col: 5, row: 5,
				side: RIGHT,
				index: ({pendingTip, sceneData, now}) => {
					if (sceneData.facing) {
						if (sceneData.yupaToHuman) {
							if (sceneData.surprise) {
								return (pendingTip && pendingTip.talker === "both" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 + 11: 12)
							}
							if (sceneData.yupaAngry) {
								return 15 + (pendingTip && pendingTip.talker === "yupa" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0);							
							}
							return 11 + (pendingTip && pendingTip.talker === "yupa" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0);
						}
						if (sceneData.surprise) {
							return (pendingTip && pendingTip.talker === "both" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 + 7: 8)
						}
						return 3 + (pendingTip && pendingTip.talker === "yupa" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0);
					}
					if (sceneData.turning) {
						return Math.min(2, Math.floor((now - sceneData.turning)/100));
					}
					return 0;
				},
			},
			{	//	overlay
				src: ASSETS.YUPA_HITMAN_AT_GUNPOINT, col: 5, row: 5,
				side: RIGHT,
				index: ({pendingTip, sceneData, now}) => {
					if (sceneData.yupaShrug) {
						return 20;						
					}
					return -1;
				},
				hidden: game => !game.sceneData.yupaShrug,
			},
			{
				src: ASSETS.YUPA_HITMAN_AT_GUNPOINT, col: 5, row: 5,
				index: 24,
				offsetY: game => Math.max(0, Math.round(20 - (game.now - game.sceneTime) / 100)),
				hidden: game => game.sceneData.knockout,
			},
			{
				src: ASSETS.BOY_GUNPOINT, col: 4, row: 5,
				index: 4,
				hidden: ({sceneData}) => !sceneData.showBoy,
			},
			{
				src: ASSETS.BOY_GUNPOINT, col: 4, row: 5,
				index: ({pendingTip, now, sceneData}) => {
					if (sceneData.knockout) {
						const time = now - sceneData.knockout;
						const frames = [5, 5, 5, 5, 6, 7, 8, 9, 10, 11, 12, 13];
						const frame = Math.min(frames.length-1, Math.floor(time / 100));
						return frames[frame];
					}
					if (sceneData.zoomBoy) {
						return 14 + (pendingTip && pendingTip.talker==="boy" && pendingTip.progress < 1 ? Math.floor(now / 100) % 4 : 0);
					}
					if (pendingTip && pendingTip.talker==="boy" && pendingTip.progress < 1) {
						return Math.floor(now / 100) % 4;
					}
					return 0;
				},
				hidden: ({sceneData}) => !sceneData.showBoy,
			},
			{
				src: ASSETS.STRANGER_REVEAL, col: 4, row: 4,
				index: ({pendingTip, now, sceneData}) => {
					if (sceneData.smirk) {
						return 12;
					}
					if (sceneData.reveal) {
						return Math.min(11, 5 + Math.floor((now - sceneData.reveal)/100));
					}
					return pendingTip && pendingTip.talker === "stranger" && pendingTip.progress < 1 ? Math.floor(now/100) % 4 : 0;
				},
				hidden: ({sceneData}) => !sceneData.showStranger,
			},
			{
				src: ASSETS.STRANGER_REVEAL, col: 4, row: 4,
				side: LEFT,
				index: 13,
				offsetX: ({sceneData, now}) => {
					const time = now - sceneData.showFinalTitle;
					return - Math.round(Math.max(0, (1000 - time)/5));
				},
				hidden: ({sceneData}) => !sceneData.showFinalTitle,
			},
			{
				src: ASSETS.STRANGER_REVEAL, col: 4, row: 4,
				side: RIGHT,
				index: 13,
				offsetX: ({sceneData, now})  => {
					const time = now - sceneData.showFinalTitle;
					return + Math.round(Math.max(0, (1000 - time)/5));
				},
				hidden: ({sceneData}) => !sceneData.showFinalTitle,
			},
			{
				hidden: game => !game.sceneData.creditStart,
				custom: (game, sprite, ctx) => {
					if (game.now - game.sceneData.creditStart) {
						ctx.fillStyle = "#000000";
						ctx.globalAlpha = Math.min(.7, (game.now - game.sceneData.creditStart) / 3000);
						ctx.fillRect(0, 0, 64, 64);
					}
					ctx.globalAlpha = 1;

					const shift = - (game.now - game.sceneData.creditStart - 2000) / 200 + 50;
					game.sceneData.credits.forEach((line, index) => {
						const y = index * 6 + shift;
						if (y > 0 && y < 55) {
							game.displayTextLine(ctx, {
								msg: line,
								x:1, y: Math.round(y),
								alpha: Math.max(0.05, Math.min(.8, y/5, (55 - y)/5)),
							});
						}
					});
				},
			},
		],
	},
);