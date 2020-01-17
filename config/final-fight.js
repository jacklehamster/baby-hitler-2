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
			}, 1000);
			game.sceneData.shift = -32;
			game.useItem = "gun";
		},
		onSceneRefresh: game => {
			if (game.mouse && game.mouse.x > 64 - 5 || game.actionDown === RIGHT) {
				game.sceneData.shift -= .3;
				game.sceneData.shift = Math.max(-64, Math.min(0, game.sceneData.shift));
			} else if (game.mouse && game.mouse.x < 5 || game.actionDown === LEFT) {
				game.sceneData.shift += .3;
				game.sceneData.shift = Math.max(-64, Math.min(0, game.sceneData.shift));				
			}
		},
		customCursor: (game, ctx) => {
			if (game.mouse) {
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
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.clearRect(0, 0, 64, 64);
				},
			},
			{
				src: ASSETS.SHOOT_OUT, size: [128, 64], col: 3, row: 6,
				offsetX: game => Math.round(game.sceneData.shift),
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