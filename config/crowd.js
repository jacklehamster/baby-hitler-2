game.addScene(
	{
		name: "crowd",
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
			{
				custom: (game, sprite, ctx) => {
					ctx.fillStyle = "#352727";
					ctx.fillRect(0, 0, 64, 64);
				},
			},
			... new Array(10).fill(null).map((dummy, idx) => {
				const offsetY = Math.max(10, (idx / 10) * 50);
				const startTime = Math.random() * 2000;
				return {
					src: ASSETS[`RUNNER${idx % 6}`],
					scale: offsetY / 64,
					index: (game, sprite) => Math.floor((game.now - game.evaluate(sprite.startRun)) / 50) % 4,
					offsetX: (game, sprite) => {
						return (sprite.scale * (game.now - game.evaluate(sprite.startRun)) / 10) % 100 - 30;
					},
					offsetY: offsetY * .6 - 10,
					startRun: game => game.sceneTime - startTime,
					flipH: Math.random() < .5,
				};
			}),
			{
				src: ASSETS.CRAWLING_BOY, col: 3, row: 3,
				index: game => game.sceneData.putHand ? game.sceneData.boyIndex : Math.round((Math.sin(game.now / 150) + 1)/2 * 4),
				init: game => {
					game.sceneData.boyX = 150;
				},
				onRefresh: (game, sprite) => {
					const index = game.evaluate(sprite.index);
					if (!game.sceneData.putHand) {
						if (index > 0 && index < 4) {
							game.sceneData.boyX = Math.max(0, game.sceneData.boyX - .8);
						}
						if ((index === 0 || index === 4) && game.sceneData.boyX === 0) {
							game.sceneData.boyIndex = index;
							game.sceneData.putHand = game.now;

							game.delayAction(game => {
								game.playSound(SOUNDS.HUM);
								game.showTip("You stay here!\nBaby Hitler", game => {
									game.gotoScene("we-take-care-of-you");
								});
							}, 500);
						}
					}
				},
				offsetX: game => {
					return Math.round(game.sceneData.boyX);
				},
				offsetY: game => {
					if (game.sceneData.putHand) {
						const handTime = 80;
						if (game.now - game.sceneData.putHand < handTime) {
							return Math.max(0, -27 + 30 * (game.now - game.sceneData.putHand) / handTime);
						}
						return Math.max(0, 3 - (game.now - game.sceneData.putHand - handTime) / 10);
					}
					return 0;
				},
			},
			{
				src: ASSETS.CRAWLING_BOY, col: 3, row: 3,
				index: 6,
				offsetY: game => {
					const handTime = 80;
					if (game.now - game.sceneData.putHand < handTime) {
						return -27 + 30 * (game.now - game.sceneData.putHand) / handTime;
					}
					return Math.max(0, 3 - (game.now - game.sceneData.putHand - handTime) / 10);
				},
				hidden: game => !game.sceneData.putHand,
			},
			{
				src: ASSETS.CRAWLING_BOY, col: 3, row: 3,
				index: 5,
				hidden: game => !game.sceneData.putHand || game.now - game.sceneData.putHand < 1000,
			},
		],
	},
);