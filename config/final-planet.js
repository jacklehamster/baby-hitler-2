game.addScene(
	{
		name: "final-planet",
		onScene: game => {
			delete game.inventory["warpdrive"];

			game.save();
			game.playSound(SOUNDS.DIVING);
			game.playTheme(null);
			game.delayAction(game => {
				game.gotoScene("final-planet-world");
			}, 4000)
		},
		onSceneRefresh: game => {
		},
		sprites: [
			{
				src: ASSETS.FINAL_PLANET, col: 1, row: 2,
			},
			{
				src: ASSETS.SPACESHIP_STAIRS, col: 4, row: 4,
				scale: .8,
				index: game => {
					const frame = Math.floor((game.now - game.sceneTime - 2000) / 100);
					return Math.max(5, 15 - Math.min(frame, 15));
				},
				offsetY: game => {
					const time = Math.max(0, game.now - game.sceneTime) / 2;
					return Math.round(Math.min(7, Math.sqrt(time) - 30));
				},
				offsetX: 4,
				hidden: game => game.now - game.sceneTime < 1000,
			},
			{
				src: ASSETS.SPACESHIP, col: 1, row: 2,
				scale: .8,
				offsetY: game => {
					const time = Math.max(0, game.now - game.sceneTime) / 2;
					return Math.round(Math.min(7, Math.sqrt(time) - 30));
				},
				offsetX: 4,
			},
			...standardMenu(),
			...standardBag(),		
		],
	},
);
