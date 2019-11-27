gameConfig.scenes.push(
	{
		name: "asteroid-field",
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
		customCursor: (game, ctx) => {
			return game.sceneData.lives > 0 ? Cursor.NONE : null;
		},
		onScene: game => {
			game.save();
			game.delayAction(game => {
				game.playTheme(SOUNDS.BATTLE_THEME, {volume: .8});
			}, 1000);
			game.sceneData.missiles = [];
			game.sceneData.lastShot = game.now;
			game.sceneData.maxLives = 30;
			game.sceneData.lives = game.sceneData.maxLives;
			game.sceneData.maxShots = 300;
			game.sceneData.shots = game.sceneData.maxShots;
			game.delayAction(game => {
				console.log(game.sceneData.lives);
			}, 90000);

			game.delayAction(game => {
				if (game.data.gameOver) {
					return;
				}
				game.sceneData.asteroids = [];
				game.sceneData.passed = game.now;
				game.waitCursor = true;
				game.currentScene.startTalk(game, "yupa", "Hey good moaning? Wad happan?", game => {
					game.currentScene.startTalk(game, "human", "Damnit Yupa! While you were dozing off, we just passed through\nan asteroid field!", game => {
						game.currentScene.startTalk(game, "yupa", [
							"Ya were drivin da ship?",
							"Why not let Alectra do it? She can dodge asteroidz, itz piecea cake!",
						], game => {
							game.currentScene.startTalk(game, "human", [
								"What?!! You're kidding me!",
							], game => {
								game.currentScene.startTalk(game, "yupa", [
									"Hey next tam dhere prablem,",
									"dunt try be a heru! Just wak me up!"
								], game => {
									game.currentScene.startTalk(game, "human", [
										"Yupa, I'm gonna kill you!",
									], game => {
										game.sceneData.liftOff = game.now;
										game.playSound(SOUNDS.DIVING);
										game.delayAction(game => {
											game.fadeToScene("final-planet");
										}, 3000);
									});
								});
							});
						});
					});
				});

			}, 85000);
			game.data.ship.superGun = true;
			game.data.ship.superShield = true;
		},
		onSceneRefresh: ({now, sceneData}) => {
			const time = (sceneData.shakeTime - now);
			if (time > 0) {
				sceneData.shiftX = Math.round((Math.random() * time) / 200);
				sceneData.shiftY = Math.round((Math.random() * time) / 200);
			} else {
				sceneData.shiftX = 0;
				sceneData.shiftY = 0;
			}
		},
		drawAsteroid: (game, ctx, { rads, rotation, distance, x, y, heating, cooling }) => {
			const { shiftX, shiftY } = game.sceneData;
			ctx.fillStyle = cooling ? "#554444" : heating ? "#884444" : "#444444";
			ctx.beginPath();
			rads.forEach((dist, index) => {
				const angle = Math.PI * 2 * (index / rads.length + rotation * game.now / 1000);
				const px = x + Math.cos(angle) * dist * distance;
				const py = y + Math.sin(angle) * dist * distance;
				if (index === 0) {
					ctx.moveTo(px + shiftX, py + shiftY);
				} else {
					ctx.lineTo(px + shiftX, py + shiftY);
				}
			});
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = cooling ? "#665555" : heating ? "#aa5555" :  "#555555";
			ctx.beginPath();
			rads.forEach((dist, index) => {
				const angle = Math.PI / 3 + Math.PI * 2 * (index / rads.length + rotation * game.now / 1000);
				const px = x + Math.cos(angle) * dist * .8 * distance;
				const py = y + Math.sin(angle) * dist * .8 * distance;
				if (index === 0) {
					ctx.moveTo(px + shiftX, py + shiftY);
				} else {
					ctx.lineTo(px + shiftX, py + shiftY);
				}
			});
			ctx.closePath();
			ctx.fill();

			ctx.fillStyle = cooling ? "#886666" : heating ? "#bb6666" :  "#666666";
			ctx.beginPath();
			rads.forEach((dist, index) => {
				const angle = Math.PI / 2 + Math.PI * 2 * (index / rads.length + rotation * game.now / 1000);
				const px = x + Math.cos(angle) * dist * .6 * distance;
				const py = y + Math.sin(angle) * dist * .6 * distance;
				if (index === 0) {
					ctx.moveTo(px + shiftX, py + shiftY);
				} else {
					ctx.lineTo(px + shiftX, py + shiftY);
				}
			});
			ctx.closePath();
			ctx.fill();
		},
		makeDust: ({sceneData}, {x, y, dx, dy}, color) => {
			if (sceneData.dusts) {
				for (let i = 0; i < 10; i++) {
					sceneData.dusts.push({
						x,
						y,
						dx: Math.random()-.5 + dx,
						dy: Math.random()-.5 + dy,
						color: color || "#cc6699",
						size: 3,
					});
				}
			}
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#000011";
					ctx.fillRect(0, 0, 64, 64);
				},
			},
			{
				mouseHovered: true,
				onClick: game => {
					const {sceneData, now} = game;
					if (sceneData.shots > 0) {
						game.playSound(SOUNDS.LAZER);
						sceneData.missiles.push({
							x: sceneData.ship.x + Math.random() - .5, y: sceneData.ship.y - 5,
						});
						sceneData.lastShot = now;
						sceneData.shots --;
					} else {
						game.playSound(SOUNDS.ERROR);
						sceneData.lastShot = now;
					}
				},
				onRefresh: (game, sprite) => {
					const {sceneData, mouseDown, now, data} = game;
					if (data.gameOver) {
						return;
					}
					const delay = 200;
					if (mouseDown && now - sceneData.lastShot > delay) {
						sprite.onClick(game);
					} else if (!mouseDown) {
						sceneData.lastShot = 0;
					}
				},
				hidden: game => game.data.ship.superGun,
			},
			{
				init: game => {
					game.sceneData.stars = new Array(100).fill(null).map(a => {
						const d = Math.random();
						return {
							d,
							col: Math.floor(d * 100),
							x: Math.random() * 64,
							y: Math.random() * 64,
							speed: (1 + d) / 20,
						};
					});
				},
				custom: (game, sprite, ctx) => {
					const { shiftX, shiftY } = game.sceneData;
					const imageData = ctx.getImageData(0, 0, 64, 64);
					game.sceneData.stars.forEach(star => {
						const index = Math.floor(Math.round(star.x + shiftX) + Math.round(star.y + shiftY) * 64) * 4;
						const col = star.col;
						imageData.data[index] = col;
						imageData.data[index+1] = col;
						imageData.data[index+2] = col;
						imageData.data[index+3] = 255;

						star.y += star.speed;
						if (star.y > 64) {
							star.x = Math.random() * 64;
							star.y = -1;
						}
					});
					ctx.putImageData(imageData, 0, 0);
				},
			},
			{
				custom: ({now, sceneTime, sceneData, mouseDown}, sprite, ctx) => {
					if (now - sceneTime > 1000 && sceneData.ship && mouseDown && sceneData.shots > 0) {
						const { x, y } = sceneData.ship;
						const rx = Math.round(x), ry = Math.round(y);
						ctx.fillStyle = "#ffdddd";
						ctx.fillRect(rx-3, ry-64, 6, 64);
					}
				},
				onRefresh: (game, sprite) => {
					const {sceneData, mouseDown, now, data} = game;
					if (data.gameOver) {
						return;
					}
					const delay = 150;
					let didShoot = false;
					if (mouseDown && now - sceneData.lastShot > delay) {
						if (sceneData.shots > 0) {
							game.playSound(SOUNDS.LAZER);
							sceneData.shots -= 2.5;
							didShoot = true;
						} else {
							game.playSound(SOUNDS.ERROR);
						}
						sceneData.lastShot = now;
					} else if (!mouseDown) {
						sceneData.lastShot = 0;
					}
					if (!didShoot) {
						if (!sceneData.lastRecharge || now - sceneData.lastRecharge > delay) {
							sceneData.shots = Math.min(game.sceneData.maxShots, sceneData.shots + 1);
							sceneData.lastRecharge = now;
						}
					}
				},				
				hidden: game => !game.data.ship.superGun,
			},
			{
				init: game => {
					game.sceneData.ship = { x: 32, y: 32 };
				},
				custom: ({now, sceneTime, sceneData}, sprite, ctx) => {
					if (now - sceneTime > 1000) {
						const { x, y } = sceneData.ship;
						ctx.fillStyle = "#ffffff";
						ctx.beginPath();
						ctx.arc(x, y, 5, 0, 2 * Math.PI);
						ctx.fill();
						ctx.fillStyle = "#75b0d0";
						ctx.beginPath();
						ctx.arc(x, y, 3, 0, 2 * Math.PI);
						ctx.fill();
						ctx.fillStyle = "#aacccc";
						ctx.beginPath();
						ctx.arc(x-1, y-1, 1, 0, 2 * Math.PI);
						ctx.fill();
					}
				},
				onRefresh: ({mouse, sceneData, now, sceneTime}) => {
					if (mouse && !sceneData.liftOff) {
						sceneData.ship.x += (mouse.x - sceneData.ship.x) / 2;
						sceneData.ship.y += (mouse.y - sceneData.ship.y) / 2;
					} else if (sceneData.liftOff) {
						const accel = (now - sceneData.liftOff) / 500;
						sceneData.ship.y -= accel;
					}
				},
				hidden: game => {
					return game.sceneData.lives <= 0;
				},
			},
			{
				initialize: (game, asteroid) => {
					asteroid.x = Math.random() * 64;
					asteroid.y = - Math.random() * 64;
					asteroid.dx = Math.random() - .5;
					asteroid.dy = Math.random() + .5;
					asteroid.rads = new Array(9).fill(null).map(a => (Math.random()+1));
					asteroid.rotation = Math.random() + .5;
					asteroid.distance = 3 + Math.random();

					return asteroid;
				},
				init: (game, sprite) => {
					const {sceneData} = game;
					sceneData.rads = new Array(9).fill(null).map(a => (Math.random()+1));
					sceneData.asteroids = [];
				},
				custom: (game, sprite, ctx) => {
					const {sceneData} = game;
					sceneData.asteroids.forEach(asteroid => {
						game.currentScene.drawAsteroid(game, ctx, asteroid);
					});
				},
				destroyAsteroid: (asteroid, game, sprite) => {
					asteroid.destroyed = game.now;
					game.playSound(SOUNDS.HIT_LAND);

					if (asteroid.distance > 2) {
						const debris = [
							sprite.initialize(game, {}),
							sprite.initialize(game, {}),
						];
						debris.forEach(debris => {
							debris.x = asteroid.x;
							debris.y = asteroid.y;
							debris.dx = asteroid.dx + Math.random() - .5;
							debris.dy = asteroid.dy /2;
							debris.distance = asteroid.distance / 2;
							game.sceneData.asteroids.push(debris);
						});
					}

					game.currentScene.makeDust(game, asteroid);
				},
				onRefresh: (game, sprite) => {
					const {sceneData, now, sceneTime, mouseDown} = game;
					sceneData.asteroids.forEach((asteroid, index) => {
						const shipDist = 2 + asteroid.distance;
						const hitDist = 4 + asteroid.distance;
						asteroid.x += asteroid.dx;
						asteroid.y += asteroid.dy;

						//	asteroid collision
						sceneData.asteroids.forEach((asteroidCollided, indexCollided) => {
							if (indexCollided > index) {
								const distX = asteroid.x - asteroidCollided.x;
								const distY = asteroid.y - asteroidCollided.y;
								const dist = Math.sqrt(distX * distX + distY * distY);
								if (dist < asteroid.distance + asteroidCollided.distance) {
									const tempDx = asteroid.dx * asteroid.distance;
									const tempDy = asteroid.dy * asteroid.distance;
									asteroid.dx = (asteroidCollided.dx * asteroidCollided.distance) / asteroid.distance;
									asteroid.dy = (asteroidCollided.dy * asteroidCollided.distance) / asteroid.distance;
									asteroidCollided.dx = tempDx / asteroidCollided.distance;
									asteroidCollided.dy = tempDy / asteroidCollided.distance;

									asteroid.x += asteroid.dx;
									asteroid.y += asteroid.dy;
									asteroidCollided.x += asteroidCollided.dx;
									asteroidCollided.y += asteroidCollided.dy;
								}
							}
						});

						if (Math.abs(asteroid.x - sceneData.ship.x) < shipDist && Math.abs(asteroid.y - sceneData.ship.y) < shipDist) {
							if (sceneData.lives > 0) {
								//	player collision
								game.playSound(game.data.ship.superShield ? SOUNDS.DUD : SOUNDS.PLAYER_HURT);
								asteroid.destroyed = true;
								const speed = Math.sqrt(asteroid.dx * asteroid.dx + asteroid.dy * asteroid.dy);
								if (!game.data.ship.superShield) {
									sceneData.shakeTime = Math.max(now + (asteroid.distance * speed * 400), sceneData.shakeTime||0);
								}
								game.currentScene.makeDust(game, asteroid, "#882200");
								const damage = (asteroid.distance * speed) / (sceneData.lives < sceneData.maxLives / 4 ? 2 : 1);
								sceneData.lives -= game.data.ship.superShield ? Math.sqrt(damage) : damage;
								if (sceneData.lives <= 0) {
									game.currentScene.makeDust(game, asteroid, "#888888");
									game.gameOver("    “The odds of\n    navigating an\n    asteroid field\n    is 3721 to 1”");
								}
							}
						} else {
							//	missile collision
							sceneData.missiles.forEach(missile => {			
								const { x, y } = missile;			
								if (Math.abs(asteroid.x - x)<=hitDist && Math.abs(asteroid.y - y)<=hitDist) {
									missile.destroyed = game.now;
									sprite.destroyAsteroid(asteroid, game, sprite);
								}
							});

							let shot = false;
							//	superLazer collision
							if (game.data.ship.superGun && mouseDown && sceneData.shots > 0) {
								const { x, y } = sceneData.ship;
								if (Math.abs(asteroid.x - x) < hitDist && asteroid.y < y) {
									//	push
									const intensity = hitDist / Math.max(1, Math.max(asteroid.x - x));
									const direction = asteroid.x < x ? -1 : 1;
									asteroid.dx += direction * intensity / 50;
									asteroid.dy -= .1;
									shot = true;

									if (Math.random() < .15) {
										if (!asteroid.destroyed) {
											sprite.destroyAsteroid(asteroid, game, sprite);
										}
									}

									if (!asteroid.heating) {
										asteroid.heating = game.now;
										asteroid.cooling = 0;
									}
								}
							}
							if (!shot) {								
								if (asteroid.heating && !asteroid.cooling) {
									asteroid.heating = 0;
									asteroid.cooling = game.now;
								}
							}
						}
					});
					sceneData.asteroids = sceneData.asteroids.filter(({x, y, destroyed})=>{
						return y >= -5 && y < 70 && x >= -5 && x < 70 && !destroyed;
					});
					const maxAsteroid = Math.min((now - sceneTime - 2000) / 2000, 25, 25 - (now - sceneTime - 70000) / 500);
					if (sceneData.asteroids.length < maxAsteroid && !game.sceneData.passed) {
						sceneData.asteroids.push(sprite.initialize(game, {}));
					}
				},
			},
			{
				init: ({sceneData}) => {
					sceneData.dusts = [];
				},
				custom: ({sceneData}, sprite, ctx) => {
					const { shiftX, shiftY } = sceneData;
					sceneData.dusts.forEach(({x,y,color, size}) => {
						ctx.fillStyle = color;
						ctx.fillRect(x-size/2 + shiftX,y-size/2 + shiftY,size,size);
					});
				},
				onRefresh: ({sceneData}) => {
					sceneData.dusts.forEach(dust => {
						dust.x += dust.dx;
						dust.y += dust.dy;
						dust.dx *= .9;
						dust.dy *= .9;
						dust.size *= .9;
					});
					sceneData.dusts = sceneData.dusts.filter(({size}) => size > .5);
				},
			},
			{
				custom: ({sceneData}, sprite, ctx) => {
					const { shiftX, shiftY } = sceneData;
					ctx.fillStyle = "#cccccc";
					sceneData.missiles.forEach(({x, y}) => {
						ctx.fillRect(Math.round(x + shiftX), y + shiftY, 1, 2);
					});
					ctx.fillStyle = "#FFFFaa";
					sceneData.missiles.forEach(({x, y}) => {
						ctx.fillRect(Math.round(x + shiftX), y + 2 + shiftY, 1, 2);
					});
					sceneData.missiles.forEach(missile => {
						missile.y -= 2;
					});
					sceneData.missiles = sceneData.missiles.filter(({y, destroyed}) => y > -5 && !destroyed);
				},
			},
			{
				custom: ({sceneData}, sprite, ctx) => {
					const { shiftX, shiftY } = sceneData;
					ctx.globalAlpha = .7;
					ctx.fillStyle = "#222222";
					ctx.fillRect( 61, 4, 1, 5);
					ctx.fillRect( 4, 4, 1, 5);
					ctx.fillRect( 5, 4, 56, 1);
					ctx.fillRect( 5, 6, 56, 1);
					ctx.fillRect( 5, 8, 56, 1);

					ctx.globalAlpha = .5;
					ctx.fillStyle = sceneData.lives / sceneData.maxLives < 1/4 && Math.floor(game.now/200) % 3 === 0 ? "#660000" : "#990000";
					ctx.fillRect( 5, 5, 56, 1);

					ctx.fillStyle = sceneData.shots <= 0 && Math.floor(game.now/200) % 3 === 0 ? "#888888" : "#111111";
					ctx.fillRect( 5, 7, 56, 1);
					ctx.globalAlpha = 1;

					if (sceneData.lives > 0) {
						ctx.fillStyle = game.data.ship.superShield ? "#88bbaa" : "#44bb44";
						ctx.fillRect( 5, 5, 56 * sceneData.lives / sceneData.maxLives, 1);
					}

					ctx.fillStyle = "#bbbb44";
					if (sceneData.shots > 0) {
						ctx.fillRect( 5, 7, 56 * sceneData.shots / sceneData.maxShots, 1);
					}
				},
				hidden: game => game.now - game.sceneTime > 83000 || game.sceneData.lives <= 0,
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
		],
	},
);
