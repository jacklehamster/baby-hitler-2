game.addScene(
	{
		name: "inside-tavern",
		onScene: game => {
			game.delayAction(game => {
				game.gotoScene("look-over-there");
			}, 64 * 200);
		},
		sprites: [
			{
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 4,
				index: game => Math.floor(game.now / 500) % 2,
				offsetX: game => Math.max(- 64, - (game.now - game.sceneTime) / 200),
			},
			{
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 4,
				index: 2,
				offsetX: game => - (game.now - game.sceneTime) / 50,
				offsetY: game => 2 - Math.abs(Math.sin(game.now / 100)),
			},
			{
				src: ASSETS.INSIDE_TAVERN, size: [128, 64], col: 2, row: 4,
				index: 3,
				offsetX: game => Math.max(- 64, - (game.now - game.sceneTime) / 150),
			},
		],
	},
);