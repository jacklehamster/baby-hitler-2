game.addScene(
	{
		name: "stay-here-baby-hitler",
		onScene: game => {
			game.playTheme(null);
		},
		onSceneRefresh: game => {
			if (!game.sceneData.lastCrowd || game.now - game.sceneData.lastCrowd > 1000) {
				game.playSound(SOUNDS.RANDOM, {volume: .15});		
				game.sceneData.lastCrowd = game.now + Math.random() * 1000 + 500;		
			}
		},
		sprites: [
		],
	},
);