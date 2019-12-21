game.addScene(
	{
		name: "land-planet",
		onScene: game => {
			game.hideCursor = true;
		},
		sprites: [
			...standardMenu(),
			...standardBag(),		
		],
	},
);