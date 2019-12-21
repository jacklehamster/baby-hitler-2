game.addScene(
	{
		name: "9-months",
		onScene: game => {
			game.stopSound(SOUNDS.CHIN_TOK_THEME, true);
			game.playTheme(SOUNDS.CHIN_TOK_THEME, {volume: .8});
			game.hideCursor = true;
			game.delayAction(game => {
				game.currentScene.startTalk(game, "yupa", [
					"Common Pedro!",
					"Stop messin wid uz!",
				], game => {
					game.currentScene.startTalk(game, "pedro", [
						"No, me telling ya the truth!",
						"She dun't know who da father is.",
					], game => {
						game.currentScene.startTalk(game, "yupa", [
							"Ya dun wanna admit",
							"I'm shure itz you!",
							"Ya horn doug",
						], game => {
							game.currentScene.startTalk(game, "pedro", [
								"Hey, me and miss Amari, we not like that!",
								"What's more strange, I'd say",
								"Miss Amari swears she still a virgin!",
								"As far as she remembers",
							], game => {
								game.currentScene.startTalk(game, "yupa", [
									"Meybe she forgat",
									"Ya know, what happenz in Ecsta City ...",
								], game => {
									game.currentScene.startTalk(game, "pedro", [
										"Stop talking nonsense, Yupa!",
									], game => {
										game.sceneData.lookAtCamera = game.now;
										game.currentScene.startTalk(game, "pedro", [
											"Oh look, here comes doctor Sarlie",
											"and our beautiful new mommy!",
										], game => {
											game.sceneData.frontView = game.now;
											game.sceneData.showAmari = game.now + 2000;
											game.currentScene.showAmari(game);
										});
									});
								});
							})
						});
					});
				});
			}, 10000);
		},
		showAmari: game => {
			game.currentScene.startTalk(game, "doctar", [
				"Greeting boys,",
				"I'm happy to\nannounce ...",
				"we have a\nhalf-human boy!",
			], game => {
				game.sceneData.frontView = 0;
				game.sceneData.surprised = game.now;
				game.currentScene.startTalk(game, "all", "A HALF-HUMAN BOY!", game => {
					game.currentScene.startTalk(game, "pedro", [
						"I told you dufus, I'm not da father!",
					], game => {
						game.sceneData.frontView = game.now;
						game.sceneData.lookAtAmari = game.now;
						game.currentScene.startTalk(game, "amari", [
							"I don't\nunderstand what happened and I don't care.",
						], game => {
							game.currentScene.startTalk(game, "amari", [
								"This is a little miracle from God that I\nwelcome with open arms!",
							], game => {
								game.currentScene.startTalk(game, "doctar", [
									"So, how are you going to name your baby?",
								], game => {
									game.gotoScene("amari-baby");
								});
							});
						});
					});
				});
			});
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.clearRect(0, 0, 64, 64);
				},
				hidden: game => game.now - game.sceneTime >= 10000,
			},
			{
				custom: (game, sprite, ctx) => {
					ctx.globalAlpha = game.evaluate(sprite.alpha);
					game.displayTextLine(ctx, {msg: "9 MONTHS", x: 10, y: 22});
					game.displayTextLine(ctx, {msg: "LATER", x: 17, y: 29});
					ctx.globalAlpha = 1;
				},
				hidden: game => game.now - game.sceneTime >= 10000 || game.now === game.sceneTime,
				alpha: game => {
					const time = game.now - game.sceneTime;
					return time < 5000 ? Math.min(1, time / 3000) : Math.max(0, 1 - (time - 5000) / 3000);
				},
			},
			{
				src: ASSETS.DOCTOR_LOBBY, col: 3, row: 3,
				hidden: game => game.now - game.sceneTime < 10000,
				index: ({sceneData, pendingTip, now}) => {
					if (sceneData.surprised) {
						return pendingTip && pendingTip.talker==="pedro" && pendingTip.progress < 1 ? 6 + Math.floor(now / 100)%2 : 6;
					}

					const frame = Math.floor(now / 100) % 2;
					if (pendingTip && pendingTip.progress < 1 && frame) {
						switch(pendingTip.talker) {
							case "pedro":
								return sceneData.lookAtCamera ? 5 : 2;
							case "yupa":
								return 1;
							case "yula":
								return 3;
						}
						if (game.pendingTip.talker === "pedro") {
							return 2;
						}
					}
					return sceneData.lookAtCamera ? 4 : 0;
				},
				onRefresh: game => {
					if (game.pendingTip && (game.pendingTip.talker === "pedro" || game.pendingTip.talker === "all") && game.pendingTip.progress < 1) {
						if (!game.sceneData.yapping) {
							game.sceneData.yapping = true;
							game.playSound(SOUNDS.YAP, {loop:true});
						}						
					} else {
						if (game.sceneData.yapping) {
							game.sceneData.yapping = false;
							game.stopSound(SOUNDS.YAP);
						}
					}
					if (!game.pendingTip || game.pendingTip.talker !== "yupa") {
						if (game.sceneData.yupaTalking) {
		//					game.stopSound(SOUNDS.YUPA);
							game.sceneData.yupaTalking = false;
						}
					}
				},	
			},
			{
				src: ASSETS.DOCTOR_LOBBY_SARLIE,
				hidden: ({sceneData}) => !sceneData.frontView,
				index: ({sceneData, pendingTip, now}) => {
					if (pendingTip && pendingTip.talker==="doctar" && pendingTip.progress < 1) {
						if (sceneData.lookAtAmari) {
							return 2 + Math.floor(now / 100) % 2;
						} else {
							return Math.floor(now / 100) % 2;
						}
					}
					return sceneData.lookAtAmari ? 3 : 0;
				},
			},
			{
				src: ASSETS.DOCTOR_LOBBY_AMARI,
				offsetX: ({sceneData, now}) => Math.round(-40 + 40 * Math.sqrt(Math.min(1, Math.max(0, now - sceneData.showAmari)/ 4000))),
				hidden: ({sceneData}) => !sceneData.frontView,
				index: ({pendingTip, now}) => {
					return 3 + (pendingTip && pendingTip.talker==="amari" && pendingTip.progress < 1 ? Math.floor(now / 100)%2 : 0);
				}
			},
		],
		startTalk: (game, talker, msg, onDone, removeLock, speed) => {
			let x, y, maxLines = 3;
			if (talker === "yupa") {
				x = 2;
				y = 63;
				game.playSound(SOUNDS.YUPA);
			} else if (talker === "pedro") {
				x = 4;
				y = 63;
			} else if (talker === "yula") {
				x = 7;
				y = 63;
				game.playSound(SOUNDS.YULA);
			} else if (talker === "doctar") {
				x = 2;
				y = 60;
				maxLines = 2;
				game.playSound(SOUNDS.HUHUH);
			} else if (talker === "amari") {
				x = 2;
				y = 62;
				maxLines = 2;
				game.playSound(SOUNDS.ANIMAL_CRY);
			} else if (talker === "all") {
				x = 3;
				y = 62;
				game.playSound(SOUNDS.YUPA);
			}
			game.showTip(msg, onDone, speed || (talker==="yupa"?100:80), { x, y, talker, removeLock, maxLines });
		},
	},
);