game.addScene(
	{
		name: "creator",
		onScene: game => {
			game.sceneData.index = 0;
		},
		sprites: [
			{
				src: ASSETS.CREATOR, col: 5, row: 6,
				index: game => game.sceneData.index,
				onClick: game => {
					game.sceneData.index ++;
				},
			},
		],
	},
);