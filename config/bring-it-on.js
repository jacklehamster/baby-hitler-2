game.addScene(
	{
		name: "bring-it-on",
		onScene: game => {
			game.hideCursor = true;
			game.playTheme(null);
		},
		onSceneRefresh: game => {
			if (!game.sceneData.nextScene) {
				if (!game.sceneData.lastCrowd || game.now - game.sceneData.lastCrowd > 1000) {
					game.playSound(SOUNDS.RANDOM, {volume: .15});		
					game.sceneData.lastCrowd = game.now + Math.random() * 1000 + 500;		
				}
			}
		},
		sprites: [
			{
				src: ASSETS.BRING_IT_ON,
				index: game => game.pendingTip && game.pendingTip.progress < 1 ? Math.floor(game.now / 100) % 4 : 0,
				init: game => {
					game.delayAction(game => {
						game.playSound(SOUNDS.HUM);
						game.showTip([
							"Bring it on!",
						], game => {
							game.playSound(SOUNDS.RANDOM, {volume: .5});		
							game.sceneData.nextScene = game.now;
							game.delayAction(game => {
								game.gotoScene("final-fight");
							}, 1000);
						});
					}, 2000);
				},
			},
			{
				src: ASSETS.BEARD_SHAVED, col: 3, row: 3,
				scale: 1.4,
				offsetX: 0,
				offsetY: -17,
				index: game => game.pendingTip && game.pendingTip.progress < 1 ? Math.floor(game.now / 100) % 4 : 0,
			},
			{
				custom: (game, sprite, ctx) => {
					const fade = Math.min(1, (game.now - game.sceneData.nextScene) / 1000);
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
				hidden: game => !game.sceneData.nextScene,
			},			
		],
	},
);