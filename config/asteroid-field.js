gameConfig.scenes.push(
	{
		name: "asteroid-field",
		customCursor: ({mouse, now, sceneTime}, ctx) => {
			if (now - sceneTime > 1000) {
				const { x, y } = mouse;
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
			return Cursor.NONE;
		},
		onScene: game => {
			game.delayAction(game => {
				game.playTheme(SOUNDS.BATTLE_THEME, {volume: .8});
			}, 1000);
			game.sceneData.missiles = [];
			game.sceneData.lastShot = game.now;
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#000011";
					ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				},
				onClick: ({now, sceneData, mouse}) => {
					if (now - sceneData.lastShot > 50) {
						sceneData.missiles.push({
							x: mouse.x, y: mouse.y,
						});
						sceneData.lastShot = now;
					}
				},
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
					const imageData = ctx.getImageData(0, 0, 64, 64);
					game.sceneData.stars.forEach(star => {
						const index = Math.floor(Math.round(star.x) + Math.round(star.y) * 64) * 4;
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
				custom: ({sceneData}, sprite, ctx) => {
					ctx.fillStyle = "#cccccc";
					sceneData.missiles.forEach(({x, y}) => {
						ctx.fillRect(Math.round(x), y, 1, 2);
					});
					ctx.fillStyle = "#FFFFaa";
					sceneData.missiles.forEach(({x, y}) => {
						ctx.fillRect(Math.round(x), y + 2, 1, 2);
					});
					sceneData.missiles.forEach(missile => {
						missile.y -= 2;
					});
					sceneData.missiles = sceneData.missiles.filter(({y}) => y > -5);
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
		],
	},
);
