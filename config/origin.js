gameConfig.scenes.push(
	{
		name: "origin",
		onScene: game => {
			game.playTheme(SOUNDS.F1, {volume:.2});
			game.sceneData.credits = `
				In ${new Date().getFullYear()}, I was sent on a mission.

				I travelled back in time to 1889.

				To stop the holocaust.

				By killing a newborn baby named Adolf Hitler.

				I failed the mission.

				I was not capable of shooting the baby.

				However, an alien named Yupa, appeared out of nowhere.

				Together, we kidnapped Baby Hitler and took him on a spaceship.

				We travelled the universe ever since.

				That is the last thing I remember ..

			`.split("\n").map((a, index) => game.wordwrap(a.trim(), 9)).join("\n").split("\n");
			game.delayAction(game => {
				game.gotoScene("jail-cell");
			}, 80000);

			game.hideCursor = true;
			game.delayAction(game => {
				game.hideCursor = true;
			}, 70000);		
		},
		onSceneRefresh: game => {
			const threshold = 3000;
			if (game.hideCursor && game.now - game.lastMouseMove < threshold) {
				if (game.now - game.sceneTime < 70000) {
					game.hideCursor = false;				
				}
			} else if (!game.hideCursor && game.now - game.lastMouseMove >= threshold) {
				game.hideCursor = true;
			}
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.clearRect(0, 0, 64, 64);
				},
			},
			{
				src: ASSETS.ORIGIN_STORY,
				index: 3,
				fadeTime: 75000,
				alpha: ({now, sceneTime}, {fadeTime}) => {
					return Math.min(1, Math.max(0, 1 - ((now - sceneTime - fadeTime) / 3000)));
				},
				hidden: ({now, sceneTime}, {fadeTime}) => {
					return Math.min(1, Math.max(0, 1 - ((now - sceneTime - fadeTime) / 3000))) <= 0;
				},
			},
			{
				src: ASSETS.ORIGIN_STORY,
				index: 2,
				fadeTime: 55000,
				alpha: ({now, sceneTime}, {fadeTime}) => {
					return Math.min(1, Math.max(0, 1 - ((now - sceneTime - fadeTime) / 3000)));
				},
				hidden: ({now, sceneTime}, {fadeTime}) => {
					return Math.min(1, Math.max(0, 1 - ((now - sceneTime - fadeTime) / 3000))) <= 0;
				},
			},
			{
				src: ASSETS.ORIGIN_STORY,
				index: 1,
				fadeTime: 38000,
				alpha: ({now, sceneTime}, {fadeTime}) => {
					return Math.min(1, Math.max(0, 1 - ((now - sceneTime - fadeTime) / 3000)));
				},
				hidden: ({now, sceneTime}, {fadeTime}) => {
					return Math.min(1, Math.max(0, 1 - ((now - sceneTime - fadeTime) / 3000))) <= 0;
				},
			},
			{
				src: ASSETS.ORIGIN_STORY,
				index: 0,
				fadeTime: 22000,
				alpha: ({now, sceneTime}, {fadeTime}) => {
					return Math.min(1, Math.max(0, 1 - ((now - sceneTime - fadeTime) / 3000)));
				},
				hidden: ({now, sceneTime}, {fadeTime}) => {
					return Math.min(1, Math.max(0, 1 - ((now - sceneTime - fadeTime) / 3000))) <= 0;
				},
			},
			{
				custom: (game, sprite, ctx) => {
					if (game.now - game.sceneTime) {
						ctx.fillStyle = "#000000";
						ctx.globalAlpha = Math.min(.6, (game.now - game.sceneTime) / 5000);
						ctx.fillRect(0, 0, 64, 64);
					}
					ctx.globalAlpha = .8;

					const shift = - (game.now - game.sceneTime - 2000) / 200 + 50;
					game.sceneData.credits.forEach((line, index) => {
						const y = index * 7 + shift;
						if (y > 0 && y < 55) {
							game.displayTextLine(ctx, {
								msg: line,
								x:10, y: Math.round(y),
								alpha: Math.max(0.05, Math.min(.8, y/5, (55 - y)/5)),
							});
						}
					});
				},
			},
			{
				src: ASSETS.NEXT_SCENE,
				hidden: game => game.hideCursor || game.waitCursor,
				onClick: game => game.fadeToScene("jail-cell", null, 3000),
				alpha: .5,
				offsetX: 3,
				offsetY: 3,
			},
			{
				custom: (game, sprite, ctx) => {
					game.displayTextLine(ctx, {
						msg: "skip", x: 50, y: 47,
					});
				},
				hidden: game => !game.hoverSprite || game.hoverSprite.src !== ASSETS.NEXT_SCENE,
			},			
		],
	},
);