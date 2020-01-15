game.addScene(
	{
		name: "space-adventure",
		startTalk: (game, talker, msg, onDone, removeLock) => {
			let x, y;
			if (talker === "human") {
				x = 7;
				y = 58;
				game.playSound(SOUNDS.HUM);
			} else if (talker === "yupa") {
				x = 2;
				y = 22;
				game.playSound(SOUNDS.YUPA);				
			}
			game.showTip(msg, onDone, 100, { x, y, talker, removeLock });
		},
		drawAsteroid: (game, ctx, { dir, rads, rotation, born }) => {
			const d = (game.now - born) / 2000;
			if (d < 0) {
				return;
			}
			const dd = d*d;
			if (dd < 1) return;
			const speed = 2.5;
			const x = 32 + Math.cos(dir) * dd * speed;
			const y = 32 + Math.sin(dir) * dd * speed;
			ctx.fillStyle = "#444444";
			ctx.beginPath();
			rads.forEach((dist, index) => {
				const angle = Math.PI * 2 * (index / rads.length + rotation * game.now / 1000);
				const px = x + Math.cos(angle) * dist * dd;
				const py = y + Math.sin(angle) * dist * dd;
				if (index === 0) {
					ctx.moveTo(px, py);
				} else {
					ctx.lineTo(px, py);
				}
			});
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = "#555555";
			ctx.beginPath();
			rads.forEach((dist, index) => {
				const angle = Math.PI / 3 + Math.PI * 2 * (index / rads.length + rotation * game.now / 1000);
				const px = x + Math.cos(angle) * dist * dd * .8;
				const py = y + Math.sin(angle) * dist * dd * .8;
				if (index === 0) {
					ctx.moveTo(px, py);
				} else {
					ctx.lineTo(px, py);
				}
			});
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = "#666666";
			ctx.beginPath();
			rads.forEach((dist, index) => {
				const angle = Math.PI / 2 + Math.PI * 2 * (index / rads.length + rotation * game.now / 1000);
				const px = x + Math.cos(angle) * dist * dd * .6;
				const py = y + Math.sin(angle) * dist * dd * .6;
				if (index === 0) {
					ctx.moveTo(px, py);
				} else {
					ctx.lineTo(px, py);
				}
			});
			ctx.closePath();
			ctx.fill();
		},
		onScene: game => {
			/** restore health */
			game.data.stats.life = game.data.stats.maxLife;

			//[.5,.4,.3,.7,.4,.3,.8,.3,.5,.4]
			game.waitCursor = true;
			game.sceneData.rads = new Array(9).fill(null).map(a => Math.random()+1);

			game.delayAction(game => {
				game.currentScene.startTalk(game, "human", [
					"Yupa! Yupa!",
				], game => {
					game.delayAction(game => {
						game.currentScene.startTalk(game, "human", [
							"Hey Yupa, did you see that?",
							"We just barely avoided collision with a giant asteroid.",
						], game => {
							game.delayAction(game => {
								game.currentScene.startTalk(game, "human", [
									"YUPAAA!",
								]);
								game.delayAction(game => {
									game.playTheme(null);
									game.playSound(SOUNDS.RANDOM);
									game.sceneData.nextScene = game.now;
									game.delayAction(game => {
										game.gotoScene("asteroid-field");										
									}, 1000);
								}, 3000);
							}, 5000);
						});
					}, 4000);
				});
			}, 8000);
		},
		sprites: [
			{
				init: (game, sprite) => {
					game.playTheme(SOUNDS.SOUP_CHOU_THEME, {volume: .5});

					const {sceneData} = game;
					sceneData.stars = new Array(100).fill(null).map(() => {
						return {
							x: (Math.random() - .5) * 64,
							y: (Math.random() - .5) * 64,
							size: .2,
						};
					});
					for (let i = 0; i < 100; i++) {
						sprite.onRefresh(game, sprite);
					}
				},
				onRefresh: (game, sprite) => {
					const { sceneData, now, sceneTime } = game;
					sceneData.stars.forEach(star => {
						star.x *= 1.01;
						star.y *= 1.01;
						star.size *= 1.01;
						if (star.size > 1) {
							star.size = 1;
						}
						if (Math.abs(star.x) > 32 || Math.abs(star.y) > 32) {
							star.x = (Math.random() - .5) * 64;
							star.y = (Math.random() - .5) * 64;
							star.size = .2;
						}
					});
				},
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#000022";
					ctx.fillRect(0, 0, 64, 64);
					ctx.fillStyle = "#FFFFFF";
					const { sceneData } = game;
					sceneData.stars.forEach(({x, y, size}) => {
						ctx.fillRect(32 + x, 32 + y, size, size);
					});
				},
				hidden: ({sceneData}) => !sceneData.stars,
			},
			{
				custom: (game, sprite, ctx) => {
					game.currentScene.drawAsteroid(game, ctx, {
						dir:Math.PI/3,
						rotation: 1,
						born:game.sceneTime,
						rads: game.sceneData.rads,
					});

					for (let i = 0; i < 10; i++) {
						game.currentScene.drawAsteroid(game, ctx, {
							dir:Math.PI * 2 * i / 10,
							rotation: i / 10,
							born: game.sceneTime + ((i * 7) % 4) * 2000 + 25000,
							rads: game.sceneData.rads,
						});						
					}

				},
			},
			{
				src: ASSETS.SPACESHIP, col: 1, row: 2,
				scale: game => {
					if (!game.sceneData.toPlanet) {
						return 1;
					}
					const timeProgress = Math.max(0, 1 - (Math.max(0, game.now - game.sceneData.toPlanet - 5000) / 3000));
					return timeProgress * timeProgress;
				},
				offsetX: (game, sprite) => {
					return 10 + 20 - game.evaluate(sprite.scale) * 20;
				},
				offsetY: (game, sprite) => {
					return 10 + 20 - game.evaluate(sprite.scale) * 20;
				},
				hidden: (game, sprite) => !game.evaluate(sprite.scale),
			},
			{
				custom: (game, sprite, ctx) => {
					const fade = Math.min(1, (game.now - game.sceneData.nextScene) / 1000);
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
				hidden: game => !game.sceneData.nextScene,
			},			
		],
	},
);