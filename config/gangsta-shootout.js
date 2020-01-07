game.addScene(
	{
		name: "gangsta-shootout",
		arrowGrid: [
			[null, null,  null,  null, null ],
			[],
			[ null, null, null,  null, null ],
			[ null, null, null,  null, null ],
			[ null, null, BAG,  null, null ],
		],
		onScene: game => {
			game.delayAction(game => {
				game.sceneData.startDraw = game.now;
			}, 500);
			game.delayAction(game => {
				game.sceneData.drawGun = game.now;
			}, 1200);
			game.delayAction(game => {
				if (!game.sceneData.dickShot) {
					game.playSound(SOUNDS.GUN_SHOT);
					game.sceneData.dickShoot = game.now;
					game.currentScene.hideBartender(game);
					game.currentScene.onHitPlayer(game);
				}
			}, 2600);
		},
		onSceneRefresh: game => {
			if (game.sceneData.bodyguardShoot) {
				const progress = Math.min(1, (game.now - game.sceneData.bodyguardShoot) / 3000);
				game.fade = game.sceneData.bodyguardShoot ? .6 * progress : 0;
				game.fadeColor = "#990000";
				if (progress >= 1 && !game.data.gameOver && !game.sceneData.overrideGameOver) {
					game.gameOver(
						! game.countItem("bullet") && game.sceneData.triedToShoot
						? "  “Can't function\n   on an empty\n   barrel.” "
						: !game.sceneData.dickShot || game.getSituation("tavern-phone").yupaAndBrutus
						? "   “In a shootout,\n you gotta draw\n  quickly.”"
						: " “Three might be\n   too much to\n     handle.”");
					game.waitCursor = 0;
				}
			}
		},
		hideBartender: game => {
			game.delayAction(game => {
				if (!game.sceneData.hideBartender) {
					game.sceneData.hideBartender = game.now;
				}
			}, 200);
		},
		alertBrutus: game => {
			game.delayAction(game => {
				if (!game.sceneData.alertBrutus) {
					game.sceneData.alertBrutus = game.now;
				}
			}, 200);
		},
		hideBrutus: game => {
			game.delayAction(game => {
				if (!game.sceneData.hideBrutus) {
					game.sceneData.hideBrutus = game.now;
				}
			}, 500);
		},
		onHitPlayer: game => {
			if (game.useItem === "gun") {
				game.sceneData.triedToShoot = true;
			}
			game.useItem = null;
			game.waitCursor = true;
			game.sceneData.bodyguardShoot = game.now;
		},
		guardAlert: game => {
			if (!game.getSituation("tavern-phone").yupaAndBrutus) {
				game.delayAction(game => {
					if (!game.sceneData.leftGuardAlert) {
						game.sceneData.leftGuardAlert = game.now;
					}
				}, 300);
				game.delayAction(game => {
					if (!game.sceneData.leftGuardShot && !game.sceneData.leftGuardShoots) {
						game.sceneData.leftGuardShoots = game.now;
						game.playSound(SOUNDS.GUN_SHOT);
						game.currentScene.onHitPlayer(game);
					}
				}, 800);
			}
			game.delayAction(game => {
				if (!game.sceneData.rightGuardAlert) {
					game.sceneData.rightGuardAlert = game.now;
				}
			}, 200);
			game.delayAction(game => {
				if (!game.sceneData.rightGuardShot && !game.sceneData.rightGuardShoots) {
					game.sceneData.rightGuardShoots = game.now;
					game.playSound(SOUNDS.GUN_SHOT);
					game.currentScene.onHitPlayer(game);
				}
			}, 700);
		},
		onSceneShot: game => {
			game.currentScene.hideBartender(game);
			game.currentScene.alertBrutus(game);
			game.currentScene.guardAlert(game);
		},
		sprites: [
			{
				src: ASSETS.TAVERN_GANGSTA_SHOOTOUT, col: 5, row: 6,
			},
			{	//	bartender
				src: ASSETS.TAVERN_GANGSTA_SHOOTOUT, col: 5, row: 6,
				index: game => {
					if (game.sceneData.hideBartender) {
						let frame = 1 + Math.floor((game.now - game.sceneData.hideBartender)/100);
						if (frame > 3) {
							frame = -1;
						}
						return frame;
					}
					return 1;
				},
			},
			{	//	brutus phone
				src: ASSETS.TAVERN_GANGSTA_SHOOTOUT, col: 5, row: 6,
				index: game => {
					if (game.sceneData.hideBrutus) {
						return Math.min(9, 5 + Math.floor((game.now - game.sceneData.hideBrutus)/100));
					}
					if (game.sceneData.alertBrutus) {
						return 5;
					}
					return 4;
				},
				hidden: game => !game.getSituation("tavern-phone").yupaAndBrutus,
			},
			{	//	left bodyguard
				src: ASSETS.TAVERN_GANGSTA_SHOOTOUT, col: 5, row: 6,
				side: LEFT,
				index: game => {
					if (game.sceneData.leftGuardShot) {
						let frame = 14 + Math.floor((game.now - game.sceneData.leftGuardShot)/100);
						if (frame > 16) {
							frame = -1;
						}
						return frame;
					}
					if (game.sceneData.leftGuardShoots) {
						return game.now - game.sceneData.leftGuardShoots < 100 ? 13 : 12;
					}
					if (game.sceneData.leftGuardAlert) {
						return game.now - game.sceneData.leftGuardAlert < 200 ? 10 : 12;
					}
					return 11;
				},
				hidden: game => game.getSituation("tavern-phone").yupaAndBrutus,
				onShot: game => {
					if (!game.sceneData.leftGuardShot) {
						game.sceneData.leftGuardShot = game.now;
						game.currentScene.hideBartender(game);
						game.currentScene.guardAlert(game);
					}
				},
			},
			{	//	right bodyguard
				src: ASSETS.TAVERN_GANGSTA_SHOOTOUT, col: 5, row: 6,
				side: RIGHT,
				index: game => {
					if (game.sceneData.rightGuardShot) {
						let frame = 14 + Math.floor((game.now - game.sceneData.rightGuardShot)/100);
						if (frame > 16) {
							frame = -1;
						}
						return frame;
					}
					if (game.sceneData.rightGuardShoots) {
						return game.now - game.sceneData.rightGuardShoots < 100 ? 13 : 12;
					}
					if (game.sceneData.rightGuardAlert) {
						return game.now - game.sceneData.rightGuardAlert < 200 ? 10 : 12;
					}
					return 11;
				},
				onShot: game => {
					if (!game.sceneData.rightGuardShot) {
						game.sceneData.rightGuardShot = game.now;
						game.currentScene.hideBartender(game);
						game.currentScene.alertBrutus(game);
						game.currentScene.hideBrutus(game);
						game.currentScene.guardAlert(game);
					}
				},
			},
			{	//	dick
				src: ASSETS.TAVERN_GANGSTA_SHOOTOUT, col: 5, row: 6,
				index: game => {
					if (game.sceneData.dickShot) {
						return Math.min(29, 25 + Math.floor((game.now - game.sceneData.dickShot)/100));
					}
					if (game.sceneData.dickShoot) {
						return game.now - game.sceneData.dickShoot < 100 ? 24 : 23;
					}
					if (game.sceneData.drawGun) {
						return Math.min(23, 19 + Math.floor((game.now - game.sceneData.drawGun)/150));
					}
					if (game.sceneData.startDraw) {
						return Math.min(19, 18 + Math.floor((game.now - game.sceneData.startDraw)/150));						
					}
					return 18;
				},
				onShot: game => {
					if (!game.sceneData.dickShot) {
						game.sceneData.dickShot = game.now;
						game.currentScene.hideBartender(game);
						game.currentScene.alertBrutus(game);
						game.currentScene.guardAlert(game);
					}
				},
			},
			{	//	table
				src: ASSETS.TAVERN_GANGSTA_SHOOTOUT, col: 5, row: 6,
				index: 17,
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);