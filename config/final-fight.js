game.addScene(
	{
		name: "final-fight",
		onScene: game => {
			game.hideCursor = true;
			game.playTheme(null);
			game.delayAction(game => {
				game.hideCursor = false;
				game.playTheme(SOUNDS.BATTLE_THEME);
			}, 1000);
		},
		sprites: [
			{
				custom: (game, sprite, ctx) => {
					ctx.clearRect(0, 0, 64, 64);
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