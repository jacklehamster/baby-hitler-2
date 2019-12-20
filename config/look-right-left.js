gameConfig.scenes.push(
	{
		name: "look-right-left",
		onScene: game => {
			game.playTheme(SOUNDS.JAIL_CELL_THEME);
			game.delayAction(game => {
				game.gotoAndScene("inside-tavern");
			}, 11000);
		},
		sprites: [
			{
				src: ASSETS.LOOK_RIGHT_LEFT, col: 3, row: 4,
				index: 0,
			},
			{
				src: ASSETS.LOOK_RIGHT_LEFT, col: 3, row: 4,
				index: game => {
					const period = 400, timeTurn = 7000;
					if (game.now - game.sceneTime > timeTurn && (game.now - game.sceneTime - timeTurn) / period < Math.PI*2) {
						const frame = Math.round(Math.sin((game.now - game.sceneTime - timeTurn) / period) * 2);
						if (frame > 0) {
							return 1 + frame;
						} else if (frame < 0) {
							return 3 - frame;
						}
					}
					return 1;
				},
				scale: game => Math.min(1, .7 + .3 * (game.now - game.sceneTime)/5000),
				offsetX: (game, sprite) => 3 + (game.now - game.sceneTime >= 5000 ? 0 : 32 - 32 * game.evaluate(sprite.scale)),
				offsetY: (game, sprite) => +3 + (game.now - game.sceneTime >= 5000 ? 0 : 64 - (64 + Math.abs(Math.sin((5000 + game.sceneTime - game.now)/300)) * 2) * game.evaluate(sprite.scale)),
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				scale: (game, sprite) => .2 + game.evaluate(sprite.innerScale),
				innerScale: game => Math.min(1, .7 + .3 * (game.now - game.sceneTime)/5000),
				offX: game => {
					const period = 400, timeTurn = 7000;
					if (game.now - game.sceneTime > timeTurn && (game.now - game.sceneTime - timeTurn) / period < Math.PI*2) {
						const frame = Math.sin((game.now - game.sceneTime - timeTurn) / period) * .7;
						return 7 - frame;
					}
					return 7;
				},
				offY: 3,
				offsetX: (game, sprite) => 3 + (game.now - game.sceneTime >= 5000 ? 32 - 1.2 * (32 - game.evaluate(sprite.offX)) : 32 - (32 - game.evaluate(sprite.offX)) * game.evaluate(sprite.scale, sprite)),
				offsetY: (game, sprite) => +3 + (game.now - game.sceneTime >= 5000 ? 64 - 1.2 * (64 - game.evaluate(sprite.offY)) : 64 - (64 - game.evaluate(sprite.offY) + Math.abs(Math.sin((5000 + game.sceneTime - game.now)/300)) * 2) * game.evaluate(sprite.scale, sprite)),
			},
			{
				src: ASSETS.LOOK_RIGHT_LEFT, col: 3, row: 4,
				index: game => {
					const period = 350, timeTurn = 7500;
					if (game.now - game.sceneTime > timeTurn && (game.now - game.sceneTime - timeTurn) / period < Math.PI*2) {
						const frame = Math.round(Math.sin((game.now - game.sceneTime - timeTurn) / period) * 2);
						if (frame > 0) {
							return 6 + frame;
						} else if (frame < 0) {
							return 8 - frame;
						}
					}
					return 6;
				},
				scale: game => Math.min(1, .7 + .3 * (game.now - game.sceneTime)/5000),
				offsetX: (game, sprite) => game.now - game.sceneTime >= 5000 ? 0 : 32 - 32 * game.evaluate(sprite.scale),
				offsetY: (game, sprite) => +1 + (game.now - game.sceneTime >= 5000 ? 0 : 64 - (64 + Math.abs(Math.sin((5000 + game.sceneTime - game.now)/200)) * 1) * game.evaluate(sprite.scale)),
			},
		],
	},
);