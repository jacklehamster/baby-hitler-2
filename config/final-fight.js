game.addScene(
	{
		name: "final-fight",
		arrowGrid: [
			[null, null,  null,  null, null ],
			[],
			[ null, null, null,  null, null ],
			[ null, null, null,  null, null ],
			[ null, null, BAG,  null, null ],
		],
		onScene: game => {
			game.hideCursor = true;
			game.playTheme(null);
			game.delayAction(game => {
				game.hideCursor = false;
				game.playTheme(SOUNDS.BATTLE_THEME);
				game.sceneData.battleStarted = game.now;
			}, 1000);
			game.sceneData.shift = -32;
			game.useItem = "gun";
			game.sceneData.showLifebar = true;
			game.sceneData.actionScequence = game.now;
		},
		onSceneRefresh: game => {
			if (!game.sceneData.bossEntering) {
				if (game.mouse && game.mouse.x > 64 - 5 || game.actionDown === RIGHT) {
					game.sceneData.shift -= .3;
					game.sceneData.shift = Math.max(-64, Math.min(0, game.sceneData.shift));
				} else if (game.mouse && game.mouse.x < 5 || game.actionDown === LEFT) {
					game.sceneData.shift += .3;
					game.sceneData.shift = Math.max(-64, Math.min(0, game.sceneData.shift));				
				}
				if (game.now - game.sceneTime > 30000) {
					game.sceneData.bossEntering = game.now;
					game.playSound(SOUNDS.WELCOME_TO_YOUR_DOOM);
				}
			} else if (Math.abs(game.sceneData.shift - -32) > 1) {
				game.sceneData.shift += (-32 - game.sceneData.shift) / 10;
			} else {
				game.sceneData.shift = -32;
			}
		},
		customCursor: (game, ctx) => {
			if (game.mouse && !game.sceneData.bossEntering) {
				const { x, y } = game.mouse;
				if (x > 64 - 5 && game.sceneData.shift > -64) {
					game.displayImage(ctx, { src:ASSETS.ARROW_CURSOR, offsetX:x-5, offsetY:y-5, size: [11,11], col: 1, row: 2, index: 1 });
					return "none";
				} else if (x < 5 && game.sceneData.shift < 0) {
					game.displayImage(ctx, { src:ASSETS.ARROW_CURSOR, offsetX:x-5, offsetY:y-5, size: [11,11], col: 1, row: 2, index: 0 });
					return "none";
				}
			}
		},
		checkBossEntrance: (game) => {
			if (game.sceneData.shotLeft2nd && game.sceneData.shotRight2nd && game.sceneData.shotCenter2nd) {
				if (!game.sceneData.bossEntering) {
					game.sceneData.bossEntering = game.now;
					game.playSound(SOUNDS.WELCOME_TO_YOUR_DOOM);
				}
			}
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.clearRect(0, 0, 64, 64);
				},
			},
			{
				src: ASSETS.SHOOT_OUT, size: [128, 64], col: 3, row: 8,
				offsetX: game => Math.round(game.sceneData.shift),
			},
			{
				src: game => game.sceneData.left2nd ? ASSETS.SHOOT_OUT_2 : ASSETS.SHOOT_OUT, size: [128, 64], col: 3, row: 8,
				side: LEFT,
				offsetX: game => Math.round(game.sceneData.shift),
				period: 100,
				frames: [ 1, 2, 3, 3, 4, 3, 3, 3, 3, 3, 2, 1, -1 ],
				index: (game, sprite) => {
					if (!game.sceneData.leftShooter) {
						return -1;
					}
					if (game.sceneData.leftShot) {
						const time = game.now - game.sceneData.leftShot;
						const index = Math.floor(time / 150);
						return index < 2 ? 5 + index : -1;
					}
					const time = game.now - game.sceneData.leftShooter;
					const index = Math.floor(time / sprite.period);
					return sprite.frames[Math.min(sprite.frames.length - 1, index)];
				},
				onRefresh: (game, sprite) => {
					if (!game.sceneData.leftShooter) {
						if (!game.sceneData.nextLeftShooter || game.now > game.sceneData.nextLeftShooter) {
							if (!game.sceneData.bossEntering) {
								game.sceneData.leftShooter = game.now;
							}
						}
					} else if(game.sceneData.leftShooter) {
						const time = game.now - game.sceneData.leftShooter;
						const frame = Math.floor(time / sprite.period);

						if (frame >= sprite.frames.length) {
							game.sceneData.leftShooter = 0;
							game.sceneData.nextLeftShooter = game.now + 1000 + Math.random() * 4000;
						} else {
							const frameId = game.evaluate(sprite.index, sprite);
							if (frameId === 1) {
								game.sceneData.leftDidShoot = 0;
							}
							if (frameId === 4 && !game.sceneData.leftDidShoot) {
								game.playSound(SOUNDS.GUN_SHOT);
								game.sceneData.leftDidShoot = game.now;
								game.damagePlayer(10);
							}							
						}
					}
				},
				onShot: (game, sprite) => {
					if (!game.sceneData.leftShot) {
						game.sceneData.leftShot = game.now;
						if (!game.sceneData.left2nd) {
							game.delayAction(game => {
								game.sceneData.left2nd = game.now;
								game.sceneData.leftShot = 0;
							}, 5000 + 5000 + Math.random());
						} else if (!game.sceneData.shotLeft2nd) {
							game.sceneData.shotLeft2nd = game.now;
							game.currentScene.checkBossEntrance(game);
						}
					}
				},
				hidden: game => !game.sceneData.battleStarted,
			},
			{
				src: game => game.sceneData.right2nd ? ASSETS.SHOOT_OUT_2 : ASSETS.SHOOT_OUT, size: [128, 64], col: 3, row: 8,
				side: RIGHT,
				offsetX: game => Math.round(game.sceneData.shift),
				period: 100,
				frames: [ 1, 2, 3, 3, 4, 3, 3, 3, 3, 3, 2, 1, -1 ],
				index: (game, sprite) => {
					if (!game.sceneData.rightShooter) {
						return -1;
					}
					if (game.sceneData.rightShot) {
						const time = game.now - game.sceneData.rightShot;
						const index = Math.floor(time / 150);
						return index < 2 ? 5 + index : -1;
					}
					const time = game.now - game.sceneData.rightShooter;
					const index = Math.floor(time / sprite.period);
					return sprite.frames[Math.min(sprite.frames.length - 1, index)];
				},
				onRefresh: (game, sprite) => {
					if (!game.sceneData.rightShooter) {
						if (!game.sceneData.nextRightShooter || game.now > game.sceneData.nextRightShooter) {
							if (!game.sceneData.bossEntering) {
								game.sceneData.rightShooter = game.now;
							}
						}
					} else if(game.sceneData.rightShooter) {
						const time = game.now - game.sceneData.rightShooter;
						const frame = Math.floor(time / sprite.period);
						if (frame >= sprite.frames.length) {
							game.sceneData.rightShooter = 0;
							game.sceneData.nextRightShooter = game.now + 1000 + Math.random() * 4000;
						} else {
							const frameId = game.evaluate(sprite.index, sprite);
							if (frameId === 1) {
								game.sceneData.rightDidShoot = 0;
							}
							if (frameId === 4 && !game.sceneData.rightDidShoot) {
								game.playSound(SOUNDS.GUN_SHOT);
								game.sceneData.rightDidShoot = game.now;
								game.damagePlayer(10);
							}							
						}
					}
				},
				onShot: (game, sprite) => {
					if (!game.sceneData.rightShot) {
						game.sceneData.rightShot = game.now;
						if (!game.sceneData.right2nd) {
							game.delayAction(game => {
								game.sceneData.right2nd = game.now;
								game.sceneData.rightShot = 0;
							}, 5000 + 5000 + Math.random());
						} else if (!game.sceneData.shotRight2nd) {
							game.sceneData.shotRight2nd = game.now;
							game.currentScene.checkBossEntrance(game);
						}
					}
				},
				hidden: game => !game.sceneData.battleStarted,
			},
			{
				src: game => game.sceneData.center2nd ? ASSETS.SHOOT_OUT_2 : ASSETS.SHOOT_OUT, size: [128, 64], col: 3, row: 8,
				offsetX: game => Math.round(game.sceneData.shift),
				period: 150,
				frames: [ 7, 7, 7, 8, 9, -1 ],
				index: (game, sprite) => {
					if (!game.sceneData.centerMoving) {
						return -1;
					}
					const time = game.now - game.sceneData.centerMoving;
					const index = Math.floor(time / sprite.period);
					return sprite.frames[Math.min(sprite.frames.length - 1, index)];					
				},
				onRefresh: (game, sprite) => {
					if (game.sceneData.centerMoving) {
						const time = game.now - game.sceneData.centerMoving;
						const index = Math.floor(time / sprite.period);
						if (index >= sprite.frames.length) {
							game.sceneData.centerShooterReady = game.now;
						}
					} else {
						game.sceneData.centerMoving = game.now;
					}
				},
				hidden: game => !game.sceneData.battleStarted || game.sceneData.centerShooterReady,
			},
			{
				src: game => game.sceneData.center2nd ? ASSETS.SHOOT_OUT_2 : ASSETS.SHOOT_OUT, size: [128, 64], col: 3, row: 8,
				offsetX: game => Math.round(game.sceneData.shift),
				period: 100,
				frames: [ 10, 11, 12, 12, 13, 12, 12, 12, 12, 12, 11, 10, -1 ],
				index: (game, sprite) => {
					if (!game.sceneData.centerShooter) {
						return -1;
					}
					if (game.sceneData.centerShot) {
						const time = game.now - game.sceneData.centerShot;
						const index = Math.floor(time / 150);
						return index < 2 ? 14 + index : -1;
					}
					const time = game.now - game.sceneData.centerShooter;
					const index = Math.floor(time / sprite.period);
					return sprite.frames[Math.min(sprite.frames.length - 1, index)];
				},
				onRefresh: (game, sprite) => {
					if (!game.sceneData.centerShooter) {
						if (!game.sceneData.nextCenterShooter || game.now > game.sceneData.nextCenterShooter) {
							if (!game.sceneData.bossEntering) {
								game.sceneData.centerShooter = game.now;
							}
						}
					} else if(game.sceneData.centerShooter) {
						const time = game.now - game.sceneData.centerShooter;
						const frame = Math.floor(time / sprite.period);
						if (frame >= sprite.frames.length) {
							game.sceneData.centerShooter = 0;
							game.sceneData.nextCenterShooter = game.now + 1000 + Math.random() * 4000;
						} else {
							const frameId = game.evaluate(sprite.index, sprite);
							if (frameId === 10) {
								game.sceneData.centerDidShoot = 0;
							}
							if (frameId === 13 && !game.sceneData.centerDidShoot) {
								game.playSound(SOUNDS.GUN_SHOT);
								game.sceneData.centerDidShoot = game.now;
								game.damagePlayer(10);
							}
						}
					}
					game.sceneData.centerMoving = 0;
				},
				onShot: (game, sprite) => {
					if (!game.sceneData.centerShot) {
						game.sceneData.centerShot = game.now;
						if (!game.sceneData.center2nd) {
							game.delayAction(game => {
								game.sceneData.center2nd = game.now;
								game.sceneData.centerShooterReady = 0;
								game.sceneData.centerShot = 0;
							}, 5000 + 5000 + Math.random());
						} else if (!game.sceneData.shotCenter2nd) {
							game.sceneData.shotCenter2nd = game.now;
							game.currentScene.checkBossEntrance(game);
						}
						// game.delayAction(game => {
						// 	if (!game.sceneData.bossEntering) {
						// 		game.sceneData.bossEntering = game.now;
						// 		game.playSound(SOUNDS.WELCOME_TO_YOUR_DOOM);
						// 	}
						// }, 1000);
					}
				},
				hidden: game => !game.sceneData.battleStarted || !game.sceneData.centerShooterReady,
			},
			{
				src: ASSETS.SHOOT_OUT, size: [128, 64], col: 3, row: 8,
				offsetX: game => Math.round(game.sceneData.shift),
				period: 150,
				frames: [ 16, 17, 18, 19, 20, 21, 22 ],
				index: (game, sprite) => {
					const time = game.now - game.sceneData.bossEntering;
					const index = Math.floor(time / sprite.period);
					return sprite.frames[Math.min(sprite.frames.length - 1, index)];					
				},
				hidden: game => !game.sceneData.battleStarted || !game.sceneData.bossEntering || game.data.battle,
				onRefresh: (game, sprite) => {
					if (!game.data.battle) {
						const frame = game.evaluate(sprite.index, sprite);
						if (frame === 22) {
							const foeLife = 1000;
							game.data.battle = {
								time: game.now,
								foe: "boss",
								fist: LEFT,
								attackSpeed: 1500,
								playerHit: 0,
								playerBlock: 0,
								foeBlockChance: .8,
								playerLeftAttack: 0,
								playerRightAttack: 0,
								playerAttackLanded: 0,
								playerAttackPeriod: 45,
								foeLife,
								foeMaxLife: foeLife,
								foeBlock: 0,
								foeDefense: 12,
								foeDefeated: 0,
								attackPeriod: 100,
								riposteChance: .6,
								foeDamage: 10,
								preventEscape: true,
								gunDamage: 200,
								onWin: game => {
									game.sceneData.defeatedBoss = game.now;
									game.fadeToScene("ending");
								},
								xp: 0,
								belowTheBelt: false,
								theme: "none",
							};						
						}
					}
				},
			},
			{
				src: ASSETS.GANGSTA_FIGHTER, col: 4, row: 4,
		//		globalCompositeOperation: ({now, battle}) => now - battle.playerAttackLanded < 50 ? "lighten" : null,
				offsetX: ({now, battle, sceneData}) => {
					const hitTime = Math.max(1, now - (battle.playerAttackLanded||0));
					return 5 + 32 + Math.round(sceneData.shift) + (hitTime < 500 ? Math.round((Math.random() - .5) * Math.min(10, 200 / hitTime)) : 0);
				},
				offsetY: ({now, battle}) => {
					const hitTime = Math.max(1, now - battle.playerAttackLanded);
					return hitTime < 500 ? Math.round((Math.random() - 1) * Math.min(10, 200 / hitTime)) : 0;
				},
				index: ({now, battle, data}) => {
					if (!battle || data.gameOver) {
						return 0;
					}
					if (battle.foeDefeated) {
						return Math.min(15, 9 + Math.floor((now - battle.foeDefeated) / 100));
					}
					const hitTime = Math.max(1, now - battle.playerAttackLanded);
					if (hitTime < 400) {
						return 9;
					}
					if (battle.foeBlock && now - battle.foeBlock < 200) {
						return 8;
					}
					if (now > battle.nextAttack) {
						return 4 + Math.floor((now - battle.nextAttack)/100) % 4;
					}
					return Math.floor(now/200) % 4;
				},
				hidden: ({battle, now}) => !battle || battle.foe != 'boss' || battle.foeDefeated && now - battle.foeDefeated >= 2000,
				onShot: (game, sprite) => {
					const {battle, data} = game;
					if (!battle.invincible) {
						game.damageFoe(100, {shot:true});
					}
				},
				combine: (item, game) => {
					game.battle.nextAttack =  Math.min(game.now + 3000, game.battle.nextAttack);
					if (item === "gun") {
						game.showTip("I'm out of ammo.", null, 50, {removeLock: true});
					} else if (item === "photo") {
						game.playSound(SOUNDS.HUM);
						game.showTip("Have you seen this baby?", null, 50, {removeLock: true});
					} else {
						game.playSound(SOUNDS.HUM);
						game.showTip(`Would you like this ${item}?`, null, 50, {removeLock: true});
					}
					return true;
				},
			},
			{
				custom: (game, sprite, ctx) => {
					const fade = 1 - Math.min(1, (game.now - game.sceneTime) / 1000);
					const imageData = ctx.getImageData(0, 0, 64, 64);
					for (let i = 0; i < imageData.data.length; i+= 4) {
						if (Math.random() < fade) {
							imageData.data[i] = 255;
							imageData.data[i+1] = 255;
							imageData.data[i+2] = 255;
							imageData.data[i+3] = 255;
						}
					}
					ctx.putImageData(imageData, 0, 0);
				},
				hidden: game => game.now - game.sceneTime > 1000,
			},
			...standardBattle(),
			...standardBag(),		
		],
		... makeOnSceneBattle(),
	},
);